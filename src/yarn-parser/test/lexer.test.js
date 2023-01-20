/* eslint-env jest */

'use strict';

import Lexer from '../lexer/lexer';
import LexerState from '../lexer/lexer-state';

describe('Lexer', () => {
  it('can tokenize some text', () => {
    const lexer = new Lexer();
    lexer.setInput('This is some text');

    expect(lexer.lex()).toBe('Text');
  });

  it('can tokenize a comment', () => {
    const lexer = new Lexer();
    lexer.setInput('This is some text // and i am a comment');

    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('Comment');
  });

  it('can tokenize a hashtag', () => {
    const lexer = new Lexer();
    lexer.setInput('This is some text#hashy');

    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('Hashtag');
  });

  it('can tokenize a command', () => {
    const lexer = new Lexer();
    lexer.setInput('<<somecommand>>');

    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize a command with spaces', () => {
    const lexer = new Lexer();
    lexer.setInput('<<somecommand 2 "face">>');

    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize a command with inline expressions', () => {
    const lexer = new Lexer();
    lexer.setInput('<<This is a {$test} {1} sentence>>');

    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('BeginInlineExp');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('EndInlineExp');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('BeginInlineExp');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('EndInlineExp');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize shortcut options', () => {
    const lexer = new Lexer();
    lexer.setInput('text\n-> shortcut1\n\tText1\n-> shortcut2\n\tText2\nmore text');

    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfLine');
    expect(lexer.lex()).toBe('ShortcutOption');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfLine');
    expect(lexer.lex()).toBe('Indent');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfLine');
    expect(lexer.lex()).toBe('Dedent');
    expect(lexer.lex()).toBe('ShortcutOption');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfLine');
    expect(lexer.lex()).toBe('Indent');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfLine');
    expect(lexer.lex()).toBe('Dedent');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize nested shortcut options', () => {
    const lexer = new Lexer();
    lexer.setInput('text\n-> shortcut1\n\tText1\n\t-> nestedshortcut1\n\t\tNestedText1\n\t-> nestedshortcut2\n\t\tNestedText2\n-> shortcut2\n\tText2\nmore text');

    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfLine');

    expect(lexer.lex()).toBe('ShortcutOption');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfLine');
    expect(lexer.lex()).toBe('Indent');

    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfLine');
    expect(lexer.lex()).toBe('ShortcutOption');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfLine');
    expect(lexer.lex()).toBe('Indent');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfLine');
    expect(lexer.lex()).toBe('Dedent');

    expect(lexer.lex()).toBe('ShortcutOption');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfLine');
    expect(lexer.lex()).toBe('Indent');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfLine');
    expect(lexer.lex()).toBe('Dedent');
    expect(lexer.lex()).toBe('Dedent');

    expect(lexer.lex()).toBe('ShortcutOption');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfLine');

    expect(lexer.lex()).toBe('Indent');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfLine');
    expect(lexer.lex()).toBe('Dedent');

    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize a simple assignment', () => {
    const lexer = new Lexer();
    lexer.setInput('<<set $testvar = -4.3>>');

    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('Set');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('EqualToOrAssign');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize an assignment involving arithmetic', () => {
    const lexer = new Lexer();
    lexer.setInput('<<set $testvar = -4.3 - (1 + 2) * 3.1 / 5>>');

    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('Set');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('EqualToOrAssign');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('Minus');
    expect(lexer.lex()).toBe('LeftParen');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('Add');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('RightParen');
    expect(lexer.lex()).toBe('Multiply');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('Divide');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize assignment with Exponent', () => {
    const lexer = new Lexer();
    lexer.setInput('<<set $testvar = (2 ** 2)>>');

    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('Set');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('EqualToOrAssign');
    expect(lexer.lex()).toBe('LeftParen');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('Exponent');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('RightParen');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize an assignment with function call', () => {
    const lexer = new Lexer();
    lexer.setInput('<<set $testvar = visited(1)>>');

    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('Set');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('EqualToOrAssign');
    expect(lexer.lex()).toBe('Identifier');
    expect(lexer.lex()).toBe('LeftParen');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('RightParen');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize a simple conditional expression', () => {
    const lexer = new Lexer();
    lexer.setInput('<<if true>>Hi<<endif>>');

    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('If');
    expect(lexer.lex()).toBe('True');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('EndIf');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize a != conditional expression', () => {
    const lexer = new Lexer();
    lexer.setInput('<<if not true>>Hi<<endif>>');

    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('If');
    expect(lexer.lex()).toBe('Not');
    expect(lexer.lex()).toBe('True');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('EndIf');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize If expression equalto number', () => {
    const lexer = new Lexer();
    lexer.setInput('<<if $testvar == 1>>');

    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('If');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('EqualTo');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize If expression GreaterThanOrEqualTo number', () => {
    const lexer = new Lexer();
    lexer.setInput('<<if $testvar >= 10>>');

    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('If');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('GreaterThanOrEqualTo');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize If AND expression', () => {
    const lexer = new Lexer();
    lexer.setInput('<<if $testvar >= 10 && $testbool == true>>');

    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('If');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('GreaterThanOrEqualTo');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('And');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('EqualTo');
    expect(lexer.lex()).toBe('True');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize If AND OR expression', () => {
    const lexer = new Lexer();
    lexer.setInput('<<if ($testvar >= 10 && $testbool == true) || $testvar == 100>>');

    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('If');
    expect(lexer.lex()).toBe('LeftParen');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('GreaterThanOrEqualTo');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('And');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('EqualTo');
    expect(lexer.lex()).toBe('True');
    expect(lexer.lex()).toBe('RightParen');
    expect(lexer.lex()).toBe('Or');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('EqualTo');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize ElseIf AND OR expression', () => {
    const lexer = new Lexer();
    lexer.setInput('<<elseif ($testvar >= 10 && $testbool == true) || $testvar == 100>>');

    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('ElseIf');
    expect(lexer.lex()).toBe('LeftParen');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('GreaterThanOrEqualTo');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('And');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('EqualTo');
    expect(lexer.lex()).toBe('True');
    expect(lexer.lex()).toBe('RightParen');
    expect(lexer.lex()).toBe('Or');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('EqualTo');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('EndCommand');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize a simple inline expression', () => {
    const lexer = new Lexer();
    lexer.setInput('{$test}');

    expect(lexer.lex()).toBe('BeginInlineExp');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('EndInlineExp');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize a comment after a simple inline expression', () => {
    const lexer = new Lexer();
    lexer.setInput('{$test}#hashtag');

    expect(lexer.lex()).toBe('BeginInlineExp');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('EndInlineExp');
    expect(lexer.lex()).toBe('Hashtag');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize an escaped curly brace', () => {
    const lexer = new Lexer();
    lexer.setInput('\\{test\\}');

    expect(lexer.lex()).toBe('EscapedCharacter');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EscapedCharacter');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize an escaped comment', () => {
    const lexer = new Lexer();
    lexer.setInput('\\//test');

    expect(lexer.lex()).toBe('EscapedCharacter');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize an escaped regular character', () => {
    const lexer = new Lexer();
    lexer.setInput('\\test');

    expect(lexer.lex()).toBe('EscapedCharacter');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize an inline expression in a sentence', () => {
    const lexer = new Lexer();
    lexer.setInput('This is a {$test} sentence');

    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('BeginInlineExp');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('EndInlineExp');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize an inline expression with addition in a sentence', () => {
    const lexer = new Lexer();
    lexer.setInput('This is a {$test + 1} sentence');

    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('BeginInlineExp');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('Add');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('EndInlineExp');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize an inline expression with function call', () => {
    const lexer = new Lexer();
    lexer.setInput('This is a {getName($player1)} sentence');

    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('BeginInlineExp');
    expect(lexer.lex()).toBe('Identifier');
    expect(lexer.lex()).toBe('LeftParen');
    expect(lexer.lex()).toBe('Variable');
    expect(lexer.lex()).toBe('RightParen');
    expect(lexer.lex()).toBe('EndInlineExp');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('can tokenize an inline expression with exponent in a sentence', () => {
    const lexer = new Lexer();
    lexer.setInput('This is a {2 ** 2} sentence');

    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('BeginInlineExp');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('Exponent');
    expect(lexer.lex()).toBe('Number');
    expect(lexer.lex()).toBe('EndInlineExp');
    expect(lexer.lex()).toBe('Text');
    expect(lexer.lex()).toBe('EndOfInput');
  });

  it('throws an error on invalid syntax', () => {
    const lexer = new Lexer();
    lexer.setInput('<<jump somewhere $good>>');
    expect(lexer.lex()).toBe('BeginCommand');
    expect(lexer.lex()).toBe('Jump');
    expect(lexer.lex()).toBe('Identifier');
    expect(() => { lexer.lex(); }).toThrow();
  });

  it('throws an error if lexer is set to unknown state', () => {
    const lexer = new Lexer();
    expect(() => { lexer.setState('SomeUnknownState'); }).toThrow();
  });

  it('throws an error if one attempts to add two text states', () => {
    const lexerState = new LexerState();
    lexerState.addTextRule('Text', 'something');
    expect(() => { lexerState.addTextRule('Text', 'somethingElse'); }).toThrow();
  });
});
