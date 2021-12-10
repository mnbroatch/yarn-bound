/* eslint no-unused-expressions: "off" */
/* eslint-env mocha */

'use strict';

const chai = require('chai');
const parser = require('../src/parser/parser.js');
const nodes = require('../src/parser/nodes.js');

const expect = chai.expect;

describe('Parser', () => {
  it('can parse simple text', () => {
    const results = parser.parse('some text');

    const expected = [
      new nodes.TextNode('some text', { first_line: results[0].lineNum }),
    ];

    expect(results).to.deep.equal(expected);
  });

  it('can parse a jump', () => {
    const results = parser.parse('[[optiondest]]');

    const expected = [
      new nodes.JumpNode('optiondest',  { first_line: results[0].lineNum }),
    ];

    expect(results).to.deep.equal(expected);
  });

  it('can parse a named option', () => {
    const results = parser.parse('[[option text|optiondest]]');

    const expected = [
      new nodes.OptionNode('option text', 'optiondest', { first_line: results[0].lineNum }),
    ];

    expect(results).to.deep.equal(expected);
  });

  it('can parse several named options', () => {
    const results = parser.parse('[[text1|dest1]][[text2|dest2]]\n[[text3|dest3]]');

    const expected = [
      new nodes.OptionNode('text1', 'dest1', { first_line: results[0].lineNum }),
      new nodes.OptionNode('text2', 'dest2', { first_line: results[1].lineNum }),
      new nodes.OptionNode('text3', 'dest3', { first_line: results[2].lineNum }),
    ];

    expect(results).to.deep.equal(expected);
  });

  it('can parse some text followed by an option', () => {
    const results = parser.parse('some text [[text1|dest1]]');

    const expected = [
      new nodes.TextNode('some text ', { first_line: results[0].lineNum }),
      new nodes.OptionNode('text1', 'dest1', { first_line: results[1].lineNum }),
    ];

    expect(results).to.deep.equal(expected);
  });

  it('can parse some text followed by a newline and an option', () => {
    const results = parser.parse('some text\n[[text1|dest1]]');

    const expected = [
      new nodes.TextNode('some text', { first_line: results[0].lineNum }),
      new nodes.OptionNode('text1', 'dest1', { first_line: results[1].lineNum }),
    ];

    expect(results).to.deep.equal(expected);
  });

  it('can parse a simple function call', () => {
    const results = parser.parse('<<commandtext>>');

    const expected = [
      new nodes.FunctionResultNode('commandtext', [], results[0].lineNum),
    ];

    expect(results).to.deep.equal(expected);
  });

  it('can parse a function call with empty paren args', () => {
    const results = parser.parse('<<commandtext()>>');

    const expected = [
      new nodes.FunctionResultNode('commandtext', [], results[0].lineNum),
    ];

    expect(results).to.deep.equal(expected);
  });

	it('can parse a function call with one paren arg', () => {
    const results = parser.parse('<<commandtext(1)>>');

    const expected = [
      new nodes.FunctionResultNode('commandtext', [new nodes.NumericLiteralNode("1")]),
    ];

    expect(results).to.deep.equal(expected);
  });

	it('can parse a function call with one variable paren arg', () => {
    const results = parser.parse('<<commandtext($somevar)>>');

    const expected = [
      new nodes.FunctionResultNode('commandtext', [new nodes.VariableNode("somevar")]),
    ];

    expect(results).to.deep.equal(expected);
  });
	
	it('can parse a function call with two paren arg', () => {
    const results = parser.parse('<<commandtext(2, \"face\")>>');

    const expected = [
      new nodes.FunctionResultNode('commandtext', [new nodes.NumericLiteralNode("2"), new nodes.StringLiteralNode("face")]),
    ];

    expect(results).to.deep.equal(expected);
  });

	it('can parse a function call with one open arg', () => {
    const results = parser.parse('<<commandtext 1>>');

    const expected = [
      new nodes.FunctionResultNode('commandtext', [new nodes.NumericLiteralNode("1")]),
    ];

    expect(results).to.deep.equal(expected);
  });
	
	it('can parse a function call with one variable open arg', () => {
    const results = parser.parse('<<commandtext $somevar>>');

    const expected = [
      new nodes.FunctionResultNode('commandtext', [new nodes.VariableNode("somevar")]),
    ];

    expect(results).to.deep.equal(expected);
  });

	it('can parse a function call with two open args', () => {
    const results = parser.parse('<<commandtext 2 \"face\">>');

    const expected = [
      new nodes.FunctionResultNode('commandtext', [
					new nodes.NumericLiteralNode("2"), 
					new nodes.StringLiteralNode("face")
				]),
    ];

    expect(results).to.deep.equal(expected);
  });

	it('can parse a function call with three open args', () => {
    const results = parser.parse('<<commandtext 2 \"face\" true>>');

    const expected = [
      new nodes.FunctionResultNode('commandtext', [
					new nodes.NumericLiteralNode("2"), 
					new nodes.StringLiteralNode("face"), 
					new nodes.BooleanLiteralNode("true")
				]),
    ];

    expect(results).to.deep.equal(expected);
  });

	/*it('can parse a function call with multiple identifiers', () => {
    const results = parser.parse('<<commandtext ident1 ident2 true>>');

    const expected = [
      new nodes.FunctionResultNode('commandtext', [new nodes.TextNode("ident1"), new nodes.TextNode("ident2"), new nodes.BooleanLiteralNode("true")]),
    ];

    expect(results).to.deep.equal(expected);
  });*/
	
  it('can parse some text followed by a newline and a command', () => {
    const results = parser.parse('some text\n<<commandtext>>');

    const expected = [
      new nodes.TextNode('some text', { first_line: results[0].lineNum }),
      new nodes.FunctionResultNode('commandtext', []),
    ];

    expect(results).to.deep.equal(expected);
  });

  it('can parse a simple assignment', () => {
    const results = parser.parse('<<set $testvar = 5>>');

    const expected = [
      new nodes.SetVariableEqualToNode('testvar', new nodes.NumericLiteralNode('5'))
    ];

    expect(results).to.deep.equal(expected);
  });

  it('can parse an assignment with function call', () => {
    const results = parser.parse('<<set $testvar = visited(1)>>');

    const expected = [
      new nodes.SetVariableEqualToNode('testvar',
        new nodes.FunctionResultNode('visited', [new nodes.NumericLiteralNode("1")]))
    ];

    expect(results).to.deep.equal(expected);
  });
	
		it('can parse an assignment with function call containing expression', () => {
    const results = parser.parse('<<set $testvar = visited(1 + 2)>>');

    const expected = [
      new nodes.SetVariableEqualToNode('testvar',
        new nodes.FunctionResultNode('visited', [new nodes.ArithmeticExpressionAddNode(
                  new nodes.NumericLiteralNode('1'),
                  new nodes.NumericLiteralNode('2'))]))
    ];

    expect(results).to.deep.equal(expected);
  });
	
	it('can parse an assignment with function call containing expression 2', () => {
    const results = parser.parse('<<set $testvar = visited((1 + 2))>>');

    const expected = [
      new nodes.SetVariableEqualToNode('testvar',
        new nodes.FunctionResultNode('visited', [
					new nodes.ArithmeticExpressionNode(
						new nodes.ArithmeticExpressionAddNode(
							new nodes.NumericLiteralNode('1'),
							new nodes.NumericLiteralNode('2')))
				]))
    ];

    expect(results).to.deep.equal(expected);
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
              new nodes.ArithmeticExpressionNode(
                new nodes.ArithmeticExpressionAddNode(
                  new nodes.NumericLiteralNode('1'),
                  new nodes.NumericLiteralNode('2'))),
              new nodes.NumericLiteralNode('3.1')),
            new nodes.NumericLiteralNode('5')))),
    ];

    expect(results).to.deep.equal(expected);
  });

  it('can parse a shortcut command', () => {
    const results = parser.parse('text\n-> shortcut1\n\tText1\n-> shortcut2\n\tText2\nmore text');

    const expected = [
      new nodes.TextNode('text', { first_line: 1 }),
      new nodes.DialogShortcutNode('shortcut1', [new nodes.TextNode('Text1', { first_line: 3 })], { first_line: 2 }),
      new nodes.DialogShortcutNode('shortcut2', [new nodes.TextNode('Text2', { first_line: 5 })], { first_line: 4 }),
      new nodes.TextNode('more text', { first_line: 6 }),
    ];

    expect(results).to.deep.equal(expected);
  });

  it('can parse nested shortcut commands', () => {
    const results = parser.parse('text\n-> shortcut1\n\tText1\n\t-> nestedshortcut1\n\t\tNestedText1\n\t-> nestedshortcut2\n\t\tNestedText2\n-> shortcut2\n\tText2\nmore text');

    const expected = [
      new nodes.TextNode('text', { first_line: 1 }),
      new nodes.DialogShortcutNode('shortcut1', [
        new nodes.TextNode('Text1', { first_line: 3 }),
        new nodes.DialogShortcutNode('nestedshortcut1', [
          new nodes.TextNode('NestedText1', { first_line: 5 }),
        ], { first_line: 4 }),
        new nodes.DialogShortcutNode('nestedshortcut2', [
          new nodes.TextNode('NestedText2', { first_line: 7 }),
        ], { first_line: 6 }),
      ], { first_line: 2 }),
      new nodes.DialogShortcutNode('shortcut2', [new nodes.TextNode('Text2', { first_line: 9 })], { first_line: 8 }),
      new nodes.TextNode('more text', { first_line: 10 }),
    ];

    expect(results).to.deep.equal(expected);
  });

  it('can parse a shortcut option containing an assignment', () => {
    const results = parser.parse('text\n-> shortcut1\n\tshortcut text1\n-> shortcut2\n\tshortcut text2\n<<set $testvar to 6>>\nmore text');

    const expected = [
      new nodes.TextNode('text', { first_line: 1 }),
      new nodes.DialogShortcutNode('shortcut1', [new nodes.TextNode('shortcut text1', { first_line: 3 })], { first_line: 2 }),
      new nodes.DialogShortcutNode('shortcut2', [new nodes.TextNode('shortcut text2', { first_line: 5 })], { first_line: 4 }),
			new nodes.SetVariableEqualToNode('testvar', new nodes.NumericLiteralNode('6')),
      new nodes.TextNode('more text', { first_line: 7 }),
    ];

    expect(results).to.deep.equal(expected);
  });
	
  it('correctly ignores a double newline', () => {
    const results = parser.parse('some text\n\n<<commandtext>>');

    const expected = [
      new nodes.TextNode('some text', { first_line: results[0].lineNum }),
      new nodes.FunctionResultNode('commandtext', []),
    ];

    expect(results).to.deep.equal(expected);
  });

  it('correctly ignores a bunch of newlines', () => {
    const results = parser.parse('some text\n\n\n\n\n\n<<commandtext>>\n');

    const expected = [
      new nodes.TextNode('some text', { first_line: results[0].lineNum }),
      new nodes.FunctionResultNode('commandtext', []),
    ];

    expect(results).to.deep.equal(expected);
  });
	
  it('can parse a simple inline expression', () => {
    const results = parser.parse('{$testvar}');

    const expected = [
      new nodes.InlineExpressionNode(new nodes.VariableNode('testvar'), { first_line: results[0].lineNum })
    ];

    expect(results).to.deep.equal(expected);
  });
	
  it('can parse a simple inline expression within a sentence', () => {
    const results = parser.parse('Hello there {$testvar}.');

		// They should all be on the same line. Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.TextNode('Hello there ', { first_line: results[0].lineNum }),
      new nodes.InlineExpressionNode(new nodes.VariableNode('testvar'), { first_line: results[0].lineNum }),
			new nodes.TextNode('.', { first_line: results[0].lineNum })
    ];

    expect(results).to.deep.equal(expected);
  });
	
  it('can parse an expression with addition within a sentence', () => {
    const results = parser.parse('Hello there {$testvar + 1} test.');

		// They should all be on the same line. Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.TextNode('Hello there ', { first_line: results[0].lineNum }),
      new nodes.InlineExpressionNode(new nodes.ArithmeticExpressionAddNode(
				new nodes.VariableNode('testvar'),
				new nodes.NumericLiteralNode('1'))
				, { first_line: results[0].lineNum }),
			new nodes.TextNode('test.', { first_line: results[0].lineNum })
    ];

    expect(results).to.deep.equal(expected);
  });

  it('can parse a simple If expression', () => {
    const results = parser.parse('<<if $testvar == true>>Hi<<endif>>');

		// They should all be on the same line. Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(
				new nodes.EqualToExpressionNode(
					new nodes.VariableNode('testvar'),
					new nodes.BooleanLiteralNode('true')),
				[new nodes.TextNode('Hi', { first_line: 1 })])
    ];

    expect(results).to.deep.equal(expected);
  });
	
	it('can parse a nested If expression', () => {
    const results = parser.parse('<<if $testvar == true>><<if $testvar2 == false>>Hi<<endif>><<endif>>');

		// They should all be on the same line. Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(new nodes.EqualToExpressionNode(new nodes.VariableNode('testvar')
				, new nodes.BooleanLiteralNode('true'))
				, [new nodes.IfNode(new nodes.EqualToExpressionNode(new nodes.VariableNode('testvar2')
					, new nodes.BooleanLiteralNode('false'))
					,	[new nodes.TextNode('Hi', { first_line: 1 })])
					])			
    ];

    expect(results).to.deep.equal(expected);
  });
	
  it('can parse an assignment within an If expression', () => {
    const results = parser.parse('<<if $testvar == true>>Hi\n<<set $testvar to 5>><<endif>>');

		// They should all be on the same line. Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(
				new nodes.EqualToExpressionNode(
					new nodes.VariableNode('testvar'),
					new nodes.BooleanLiteralNode('true')),
				[new nodes.TextNode('Hi', { first_line: 1 }),
				new nodes.SetVariableEqualToNode('testvar', new nodes.NumericLiteralNode('5'))])
    ];

    expect(results).to.deep.equal(expected);
  });

	it('can parse am assignment within nested If expression', () => {
    const results = parser.parse('<<if $testvar == true>><<if $testvar2 == false>>Hi\n<<set $testvar to 5>><<endif>><<endif>>');

		// They should all be on the same line. Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(new nodes.EqualToExpressionNode(new nodes.VariableNode('testvar')
				, new nodes.BooleanLiteralNode('true'))
				, [new nodes.IfNode(new nodes.EqualToExpressionNode(new nodes.VariableNode('testvar2')
					, new nodes.BooleanLiteralNode('false'))
					,	[new nodes.TextNode('Hi', { first_line: 1 }), 
						new nodes.SetVariableEqualToNode('testvar', new nodes.NumericLiteralNode('5'))])
					])			
    ];

    expect(results).to.deep.equal(expected);
  });
	
  it('can parse an AND OR If expression', () => {
    const results = parser.parse('<<if ($testvar == true) || $override == true>>Hi<<endif>>');

		// They should all be on the same line. Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(
				new nodes.BooleanOrExpressionNode(
					new nodes.ArithmeticExpressionNode(
						new nodes.EqualToExpressionNode(
								new nodes.VariableNode('testvar'),
								new nodes.BooleanLiteralNode('true'))),
						new nodes.EqualToExpressionNode(
								new nodes.VariableNode('override'),
								new nodes.BooleanLiteralNode('true'))),
				[new nodes.TextNode('Hi', { first_line: 1 })])
    ];

    expect(results).to.deep.equal(expected);
  });
	
  it('can parse an AND OR If expression2', () => {
    const results = parser.parse('<<if ($testvar == true && $testvar2 > 1) || $override == true>>Hi<<endif>>');

		// They should all be on the same line. Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(
				new nodes.BooleanOrExpressionNode(
					new nodes.ArithmeticExpressionNode(
						new nodes.BooleanAndExpressionNode(
							new nodes.EqualToExpressionNode(
								new nodes.VariableNode('testvar'),
								new nodes.BooleanLiteralNode('true')),
							new nodes.GreaterThanExpressionNode(
								new nodes.VariableNode('testvar2'),
								new nodes.NumericLiteralNode('1')))),
					new nodes.EqualToExpressionNode(
							new nodes.VariableNode('override'),
							new nodes.BooleanLiteralNode('true'))),
				[new nodes.TextNode('Hi', { first_line: 1 })])
    ];

    expect(results).to.deep.equal(expected);
  });

  it('can parse a function call within an If expression', () => {
    const results = parser.parse('<<if visited("testnode")>>\nHi\n<<set $testvar to 5>>\n<<endif>>');

		// They should all be on the same line. Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.IfNode(
				new nodes.FunctionResultNode('visited', [
					new nodes.StringLiteralNode('testnode')
				]),
				[
					new nodes.TextNode('Hi', { first_line: 2 }),
					new nodes.SetVariableEqualToNode('testvar', new nodes.NumericLiteralNode('5'))
				])
    ];

    expect(results).to.deep.equal(expected);
  });
	
  it('can parse an assignment involving exponent', () => {
    const results = parser.parse('<<set $testvar = 2 ** 2>>');

    const expected = [
      new nodes.SetVariableEqualToNode(
        'testvar',
        new nodes.ArithmeticExpressionExponentNode(
          new nodes.NumericLiteralNode('2'),
          new nodes.NumericLiteralNode('2')))
    ];

    expect(results).to.deep.equal(expected);
  });	
	
	it('can parse an assignment involving exponent 2', () => {
    const results = parser.parse('<<set $testvar = (2 ** 2)>>');

    const expected = [
      new nodes.SetVariableEqualToNode(
        'testvar',
				new nodes.ArithmeticExpressionNode(
					new nodes.ArithmeticExpressionExponentNode(
						new nodes.NumericLiteralNode('2'),
						new nodes.NumericLiteralNode('2'))))
    ];

    expect(results).to.deep.equal(expected);
  });	
	
  it('can parse an inline expression with exponent within a sentence', () => {
    const results = parser.parse('Hello there {2 ** 2} test.');

		// They should all be on the same line. Runner aggregates text and expression value for same line.
    const expected = [
      new nodes.TextNode('Hello there ', { first_line: results[0].lineNum }),
      new nodes.InlineExpressionNode(new nodes.ArithmeticExpressionExponentNode(
				new nodes.NumericLiteralNode('2'),
				new nodes.NumericLiteralNode('2'))
				, { first_line: results[0].lineNum }),
			new nodes.TextNode('test.', { first_line: results[0].lineNum })
    ];

    expect(results).to.deep.equal(expected);
  });	
});
