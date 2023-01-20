/* eslint no-unused-expressions: "off" */
/* eslint-env jest */

'use strict';

import parser from '../src/parser/parser';
import nodes from '../src/parser/nodes';

describe('Parser', () => {
  it('can parse simple text', () => {
    const results = parser.parse('some text');

    const expected = [
      new nodes.TextNode('some text', { first_line: results[0].lineNum }),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse a simple command', () => {
    const results = parser.parse('<<commandtext>>');

    const expected = [
      new nodes.GenericCommandNode(
        [new nodes.TextNode('commandtext', { first_line: results[0].lineNum })],
        { first_line: results[0].lineNum },
      ),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse a function call with spaces', () => {
    const results = parser.parse('<<commandtext 2 "face" true>>');

    const expected = [
      new nodes.GenericCommandNode(
        [new nodes.TextNode('commandtext 2 "face" true', { first_line: results[0].lineNum })],
        { first_line: results[0].lineNum },
      ),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse some text followed by a newline and a command', () => {
    const results = parser.parse('some text\n<<commandtext>>');

    const expected = [
      new nodes.TextNode('some text', { first_line: results[0].lineNum }),
      new nodes.GenericCommandNode(
        [new nodes.TextNode('commandtext', { first_line: results[1].lineNum })],
        { first_line: results[1].lineNum },
      ),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse a simple assignment', () => {
    const results = parser.parse('<<set $testvar = 5>>');

    const expected = [
      new nodes.SetVariableEqualToNode('testvar', new nodes.NumericLiteralNode('5')),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an assignment with function call', () => {
    const results = parser.parse('<<set $testvar = visited(1)>>');

    const expected = [
      new nodes.SetVariableEqualToNode('testvar',
        new nodes.FunctionCallNode('visited', [new nodes.NumericLiteralNode('1')], { first_line: 1 })),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an assignment with function call containing expression', () => {
    const results = parser.parse('<<set $testvar = visited(1 + 2)>>');

    const expected = [
      new nodes.SetVariableEqualToNode('testvar',
        new nodes.FunctionCallNode('visited', [new nodes.ArithmeticExpressionAddNode(
          new nodes.NumericLiteralNode('1'),
          new nodes.NumericLiteralNode('2'))], { first_line: 1 })),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an assignment with function call containing expression 2', () => {
    const results = parser.parse('<<set $testvar = visited((1 + 2))>>');

    const expected = [
      new nodes.SetVariableEqualToNode('testvar',
        new nodes.FunctionCallNode('visited', [
          new nodes.ArithmeticExpressionAddNode(
            new nodes.NumericLiteralNode('1'),
            new nodes.NumericLiteralNode('2'),
          ),
        ], { first_line: 1 })),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an assignment involving arithmetic', () => {
    const results = parser.parse('<<set $testvar = -4.3 - (1 + 2) * 3.1 / 5>>');

    const expected = [
      new nodes.SetVariableEqualToNode(
        'testvar',
        new nodes.ArithmeticExpressionMinusNode(
          new nodes.NumericLiteralNode('-4.3'),
          new nodes.ArithmeticExpressionDivideNode(
            new nodes.ArithmeticExpressionMultiplyNode(
              new nodes.ArithmeticExpressionAddNode(
                new nodes.NumericLiteralNode('1'),
                new nodes.NumericLiteralNode('2'),
              ),
              new nodes.NumericLiteralNode('3.1'),
            ),
            new nodes.NumericLiteralNode('5'),
          ),
        ),
      ),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse a shortcut command', () => {
    const results = parser.parse('text\n-> shortcut1\n\tText1\n\tText1a\n-> shortcut2\n\tText2\nmore text');

    const expected = [
      new nodes.TextNode('text', { first_line: 1 }),
      new nodes.DialogShortcutNode(
        [new nodes.TextNode('shortcut1', { first_line: 2 })],
        [
          new nodes.TextNode('Text1', { first_line: 3 }),
          new nodes.TextNode('Text1a', { first_line: 4 }),
        ],
        { first_line: 2 }),
      new nodes.DialogShortcutNode(
        [new nodes.TextNode('shortcut2', { first_line: 5 })],
        [new nodes.TextNode('Text2', { first_line: 6 })], { first_line: 5 }),
      new nodes.TextNode('more text', { first_line: 7 }),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse nested shortcut commands', () => {
    const results = parser.parse('text\n-> shortcut1\n\tText1\n\t-> nestedshortcut1\n\t\tNestedText1\n\t-> nestedshortcut2\n\t\tNestedText2\n-> shortcut2\n\tText2\nmore text');

    const expected = [
      new nodes.TextNode('text', { first_line: 1 }),
      new nodes.DialogShortcutNode(
        [new nodes.TextNode('shortcut1', { first_line: 2 })],
        [
          new nodes.TextNode('Text1', { first_line: 3 }),
          new nodes.DialogShortcutNode(
            [new nodes.TextNode('nestedshortcut1', { first_line: 4 })],
            [
              new nodes.TextNode('NestedText1', { first_line: 5 }),
            ],
            { first_line: 4 },
          ),
          new nodes.DialogShortcutNode(
            [new nodes.TextNode('nestedshortcut2', { first_line: 6 })],
            [new nodes.TextNode('NestedText2', { first_line: 7 })],
            { first_line: 6 },
          ),
        ], { first_line: 2 }),
      new nodes.DialogShortcutNode(
        [new nodes.TextNode('shortcut2', { first_line: 8 })],
        [new nodes.TextNode('Text2', { first_line: 9 })], { first_line: 8 }),
      new nodes.TextNode('more text', { first_line: 10 }),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse a shortcut option containing an assignment', () => {
    const results = parser.parse('<<set $testvar to 6>>\ntext\n-> shortcut1\n\tshortcut text1\n-> shortcut2\n\tshortcut text2\nmore text {$testvar}');

    const expected = [
      new nodes.SetVariableEqualToNode('testvar', new nodes.NumericLiteralNode('6')),
      new nodes.TextNode('text', { first_line: 2 }),
      new nodes.DialogShortcutNode(
        [new nodes.TextNode('shortcut1', { first_line: 3 })],
        [new nodes.TextNode('shortcut text1', { first_line: 4 })],
        { first_line: 3 },
      ),
      new nodes.DialogShortcutNode(
        [new nodes.TextNode('shortcut2', { first_line: 5 })],
        [new nodes.TextNode('shortcut text2', { first_line: 6 })],
        { first_line: 5 },
      ),
      new nodes.TextNode('more text ', { first_line: 7 }),
      new nodes.InlineExpressionNode(new nodes.VariableNode('testvar'), { first_line: 7 }),
    ];

    expect(results).toEqual(expected);
  });

  it('correctly ignores a double newline', () => {
    const results = parser.parse('some text\n\n<<commandtext>>');

    const expected = [
      new nodes.TextNode('some text', { first_line: results[0].lineNum }),
      new nodes.GenericCommandNode(
        [new nodes.TextNode('commandtext', { first_line: results[1].lineNum })],
        { first_line: results[1].lineNum },
      ),
    ];

    expect(results).toEqual(expected);
  });

  it('correctly ignores a bunch of newlines', () => {
    const results = parser.parse('some text\n\n\n\n\n\n<<commandtext>>\n');

    const expected = [
      new nodes.TextNode('some text', { first_line: results[0].lineNum }),
      new nodes.GenericCommandNode(
        [new nodes.TextNode('commandtext', { first_line: results[1].lineNum })],
        { first_line: results[1].lineNum },
      ),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse a simple inline expression', () => {
    const results = parser.parse('{$testvar}');

    const expected = [
      new nodes.InlineExpressionNode(new nodes.VariableNode('testvar'), { first_line: results[0].lineNum }),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an escaped curly brace', () => {
    const results = parser.parse('\\{testtext\\}');

    const expected = [
      new nodes.EscapedCharacterNode('\\{', { first_line: 1 }),
      new nodes.TextNode('testtext', { first_line: 1 }),
      new nodes.EscapedCharacterNode('\\}', { first_line: 1 }),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an escaped command', () => {
    const results = parser.parse('\\<<testtext>>');

    const expected = [
      new nodes.EscapedCharacterNode('\\<', { first_line: 1 }),
      new nodes.TextNode('<testtext>>', { first_line: 1 }),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an escaped comment', () => {
    const results = parser.parse('\\//testtext');

    const expected = [
      new nodes.EscapedCharacterNode('\\/', { first_line: 1 }),
      new nodes.TextNode('/testtext', { first_line: 1 }),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an escaped hashtag', () => {
    const results = parser.parse('\\#testtext');

    const expected = [
      new nodes.EscapedCharacterNode('\\#', { first_line: 1 }),
      new nodes.TextNode('testtext', { first_line: 1 }),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an escaped regular character', () => {
    const results = parser.parse('\\testtext');

    const expected = [
      new nodes.EscapedCharacterNode('\\t', { first_line: 1 }),
      new nodes.TextNode('esttext', { first_line: 1 }),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse a simple inline expression within a sentence', () => {
    const results = parser.parse('Hello there {$testvar}.');

    // They should all be on the same line.
    // Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.TextNode('Hello there ', { first_line: results[0].lineNum }),
      new nodes.InlineExpressionNode(new nodes.VariableNode('testvar'), { first_line: results[0].lineNum }),
      new nodes.TextNode('.', { first_line: results[0].lineNum }),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an inline expression within a command', () => {
    const results = parser.parse('<<commandtext {$testvar}>>');

    const expected = [
      new nodes.GenericCommandNode(
        [
          new nodes.TextNode('commandtext ', { first_line: results[0].lineNum }),
          new nodes.InlineExpressionNode(
            new nodes.VariableNode('testvar'),
            { first_line: results[0].lineNum },
          ),
        ],
        { first_line: results[0].lineNum },
      ),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse inline expression with function call', () => {
    const results = parser.parse('Hello there {testfunc(1,2)}.');

    // They should all be on the same line.
    // Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.TextNode('Hello there ', { first_line: results[0].lineNum }),
      new nodes.InlineExpressionNode(new nodes.FunctionCallNode('testfunc', [
        new nodes.NumericLiteralNode('1'),
        new nodes.NumericLiteralNode('2'),
      ], { first_line: results[0].lineNum }), { first_line: results[0].lineNum }),
      new nodes.TextNode('.', { first_line: results[0].lineNum }),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse inline expression with addition within a sentence', () => {
    const results = parser.parse('Hello there {$testvar + 1} test.');

    // They should all be on the same line.
    // Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.TextNode('Hello there ', { first_line: results[0].lineNum }),
      new nodes.InlineExpressionNode(new nodes.ArithmeticExpressionAddNode(
        new nodes.VariableNode('testvar'),
        new nodes.NumericLiteralNode('1'))
      , { first_line: results[0].lineNum }),
      new nodes.TextNode(' test.', { first_line: results[0].lineNum }),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse a simple If expression', () => {
    const results = parser.parse('<<if $testvar == true>>\nHi\n<<endif>>');

    // They should all be on the same line.
    // Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(
        new nodes.EqualToExpressionNode(
          new nodes.VariableNode('testvar'),
          new nodes.BooleanLiteralNode('true')),
        [new nodes.TextNode('Hi', { first_line: 2 })]),
    ];

    expect(results).toEqual(expected);
  });

  // it.only('can parse a nested If expression', () => {
  it('can parse a nested If expression', () => {
    const results = parser.parse('<<if $testvar == true>>\n<<if $testvar2 == false>>\nHi\n<<endif>>\n<<endif>>');

    // They should all be on the same line.
    // Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(new nodes.EqualToExpressionNode(new nodes.VariableNode('testvar')
        , new nodes.BooleanLiteralNode('true'))
      , [new nodes.IfNode(new nodes.EqualToExpressionNode(new nodes.VariableNode('testvar2')
        , new nodes.BooleanLiteralNode('false'))
      , [new nodes.TextNode('Hi', { first_line: 3 })]),
      ]),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an assignment within an If expression', () => {
    const results = parser.parse('<<if $testvar == true>>\nHi\n<<set $testvar to 5>>\n<<endif>>');

    // They should all be on the same line.
    // Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(
        new nodes.EqualToExpressionNode(
          new nodes.VariableNode('testvar'),
          new nodes.BooleanLiteralNode('true')),
        [new nodes.TextNode('Hi', { first_line: 2 }),
          new nodes.SetVariableEqualToNode('testvar', new nodes.NumericLiteralNode('5'))]),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse am assignment within nested If expression', () => {
    const results = parser.parse('<<if $testvar == true>>\n<<if $testvar2 == false>>\nHi\n<<set $testvar to 5>>\n<<endif>>\n<<endif>>');

    // They should all be on the same line.
    // Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(new nodes.EqualToExpressionNode(new nodes.VariableNode('testvar')
        , new nodes.BooleanLiteralNode('true'))
      , [new nodes.IfNode(new nodes.EqualToExpressionNode(new nodes.VariableNode('testvar2')
        , new nodes.BooleanLiteralNode('false'))
      , [new nodes.TextNode('Hi', { first_line: 3 }),
        new nodes.SetVariableEqualToNode('testvar', new nodes.NumericLiteralNode('5'))]),
      ]),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an AND OR If expression', () => {
    const results = parser.parse('<<if ($testvar == true) || $override == true>>\nHi\n<<endif>>');

    // They should all be on the same line.
    // Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(
        new nodes.BooleanOrExpressionNode(
          new nodes.EqualToExpressionNode(
            new nodes.VariableNode('testvar'),
            new nodes.BooleanLiteralNode('true'),
          ),
          new nodes.EqualToExpressionNode(
            new nodes.VariableNode('override'),
            new nodes.BooleanLiteralNode('true'),
          ),
        ),
        [new nodes.TextNode('Hi', { first_line: 2 })],
      ),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an AND OR If expression2', () => {
    const results = parser.parse('<<if ($testvar == true && $testvar2 > 1) || $override == true>>\nHi\n<<endif>>');

    // They should all be on the same line.
    // Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(
        new nodes.BooleanOrExpressionNode(
          new nodes.BooleanAndExpressionNode(
            new nodes.EqualToExpressionNode(
              new nodes.VariableNode('testvar'),
              new nodes.BooleanLiteralNode('true'),
            ),
            new nodes.GreaterThanExpressionNode(
              new nodes.VariableNode('testvar2'),
              new nodes.NumericLiteralNode('1'),
            ),
          ),
          new nodes.EqualToExpressionNode(
            new nodes.VariableNode('override'),
            new nodes.BooleanLiteralNode('true'),
          ),
        ),
        [new nodes.TextNode('Hi', { first_line: 2 })],
      ),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse a function call within an If expression', () => {
    const results = parser.parse('<<if visited("testnode")>>\nHi\n<<set $testvar to 5>>\n<<endif>>');

    // They should all be on the same line.
    // Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(
        new nodes.FunctionCallNode('visited', [
          new nodes.StringLiteralNode('testnode'),
        ], { first_line: 1 }),
        [
          new nodes.TextNode('Hi', { first_line: 2 }),
          new nodes.SetVariableEqualToNode('testvar', new nodes.NumericLiteralNode('5')),
        ]),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse a function call within an If not expression', () => {
    const results = parser.parse('<<if not visited("testnode")>>\nHi\n<<set $testvar to 5>>\n<<endif>>');

    // They should all be on the same line.
    // Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(
        new nodes.NegatedBooleanExpressionNode(
          new nodes.FunctionCallNode('visited', [
            new nodes.StringLiteralNode('testnode'),
          ], { first_line: 1 }),
        ),
        [
          new nodes.TextNode('Hi', { first_line: 2 }),
          new nodes.SetVariableEqualToNode('testvar', new nodes.NumericLiteralNode('5')),
        ]),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse a function negated boolean expression', () => {
    const results = parser.parse('<<if not true>>\nHi\n<<set $testvar to 5>>\n<<endif>>');

    // They should all be on the same line.
    // Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(
        new nodes.NegatedBooleanExpressionNode(new nodes.BooleanLiteralNode('true')),
        [
          new nodes.TextNode('Hi', { first_line: 2 }),
          new nodes.SetVariableEqualToNode('testvar', new nodes.NumericLiteralNode('5')),
        ]),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an assignment involving exponent', () => {
    const results = parser.parse('<<set $testvar = 2 ** 2>>');

    const expected = [
      new nodes.SetVariableEqualToNode(
        'testvar',
        new nodes.ArithmeticExpressionExponentNode(
          new nodes.NumericLiteralNode('2'),
          new nodes.NumericLiteralNode('2'))),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an assignment involving exponent 2', () => {
    const results = parser.parse('<<set $testvar = (2 ** 2)>>');

    const expected = [
      new nodes.SetVariableEqualToNode(
        'testvar',
        new nodes.ArithmeticExpressionExponentNode(
          new nodes.NumericLiteralNode('2'),
          new nodes.NumericLiteralNode('2'),
        ),
      ),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse an inline expression with exponent within a sentence', () => {
    const results = parser.parse('Hello there {2 ** 2} test.');

    // They should all be on the same line.
    // Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.TextNode('Hello there ', { first_line: results[0].lineNum }),
      new nodes.InlineExpressionNode(new nodes.ArithmeticExpressionExponentNode(
        new nodes.NumericLiteralNode('2'),
        new nodes.NumericLiteralNode('2'))
      , { first_line: results[0].lineNum }),
      new nodes.TextNode(' test.', { first_line: results[0].lineNum }),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse a comment on a text node', () => {
    const results = parser.parse('some text// blah #ignore');

    const expected = [
      new nodes.TextNode('some text', { first_line: results[0].lineNum }),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse hashtags on a text node', () => {
    const results = parser.parse('some text#someHashtag#anotherHashtag #lastHashtag // #ignore');

    const expected = [
      new nodes.TextNode(
        'some text',
        { first_line: results[0].lineNum },
        ['someHashtag', 'anotherHashtag', 'lastHashtag'],
      ),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse comments on a simple function call', () => {
    const results = parser.parse('<<commandtext>>// blah #ignore');

    const expected = [
      new nodes.GenericCommandNode(
        [new nodes.TextNode('commandtext', { first_line: results[0].lineNum })],
        { first_line: results[0].lineNum },
      ),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse hashtags on a simple function call', () => {
    const results = parser.parse('<<commandtext>>#someHashtag#anotherHashtag #lastHashtag // #ignore');

    const expected = [
      new nodes.GenericCommandNode(
        [new nodes.TextNode('commandtext', { first_line: results[0].lineNum })],
        { first_line: results[0].lineNum },
        ['someHashtag', 'anotherHashtag', 'lastHashtag'],
      ),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse a shortcut option containing a comment', () => {
    const results = parser.parse('text//alaksjdakj\n-> shortcut1//alaksjdakj\n\tshortcut text1//alaksjdakj\n-> shortcut2//alaksjdakj\n\tshortcut text2//alaksjdakj\n<<set $testvar to 6>>//alaksjdakj\nmore text//alaksjdakj');

    const expected = [
      new nodes.TextNode('text', { first_line: 1 }),
      new nodes.DialogShortcutNode(
        [new nodes.TextNode('shortcut1', { first_line: 2 })],
        [new nodes.TextNode('shortcut text1', { first_line: 3 })],
        { first_line: 2 },
      ),
      new nodes.DialogShortcutNode(
        [new nodes.TextNode('shortcut2', { first_line: 4 })],
        [new nodes.TextNode('shortcut text2', { first_line: 5 })],
        { first_line: 4 },
      ),
      new nodes.SetVariableEqualToNode('testvar', new nodes.NumericLiteralNode('6')),
      new nodes.TextNode('more text', { first_line: 7 }),
    ];

    expect(results).toEqual(expected);
  });

  it('can parse hashtags on shortcut options', () => {
    const results = parser.parse('text\n-> shortcut1#hashtag1\n\tshortcut text1\n-> shortcut2<<if true == true>>#hashtag2\n\tshortcut text2\n<<set $testvar to 6>>\nmore text');

    const expected = [
      new nodes.TextNode('text', { first_line: 1 }),
      new nodes.DialogShortcutNode(
        [new nodes.TextNode('shortcut1', { first_line: 2 })],
        [new nodes.TextNode('shortcut text1', { first_line: 3 })],
        { first_line: 2 },
        ['hashtag1'],
      ),
      new nodes.DialogShortcutNode(
        [new nodes.TextNode('shortcut2', { first_line: 4 })],
        [new nodes.TextNode('shortcut text2', { first_line: 5 })],
        { first_line: 4 },
        ['hashtag2'],
        new nodes.EqualToExpressionNode(
          new nodes.BooleanLiteralNode('true'),
          new nodes.BooleanLiteralNode('true'),
        ),
      ),
      new nodes.SetVariableEqualToNode('testvar', new nodes.NumericLiteralNode('6')),
      new nodes.TextNode('more text', { first_line: 7 }),
    ];

    expect(results).toEqual(expected);
  });

  it('should throw an error if parsing invalid input', () => {
    const invalid = '<<al#ksjd #{sdasd}>>';
    expect(() => { parser.parse(invalid); }).toThrow("Parse error on line 2: Unexpected 'EndInlineExp'");
  });
});
