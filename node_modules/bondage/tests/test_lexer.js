/* eslint no-unused-expressions: "off" */
/* eslint-env mocha */

'use strict';

const chai = require('chai');
const Lexer = require('../src/lexer/lexer.js');

const expect = chai.expect;

describe('Lexer', () => {
  it('can tokenize some text', () => {
    const lexer = new Lexer();
    lexer.setInput('This is some text');

    expect(lexer.lex()).to.equal('Text');
  });

  it('can tokenize a jump', () => {
    const lexer = new Lexer();
    lexer.setInput('[[jump]]');

    expect(lexer.lex()).to.equal('OptionStart');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('OptionEnd');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

  it('can tokenize an option', () => {
    const lexer = new Lexer();
    lexer.setInput('[[option|dest]]');

    expect(lexer.lex()).to.equal('OptionStart');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('OptionDelimit');
    expect(lexer.lex()).to.equal('Identifier');
    expect(lexer.lex()).to.equal('OptionEnd');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

  it('can tokenize some text followed by a jump', () => {
    const lexer = new Lexer();
    lexer.setInput('text [[jump]]');

    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('OptionStart');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('OptionEnd');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

  it('can tokenize a jump followed by some text', () => {
    const lexer = new Lexer();
    lexer.setInput('[[jump]] text');

    expect(lexer.lex()).to.equal('OptionStart');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('OptionEnd');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

  it('can tokenize an option followed by some text', () => {
    const lexer = new Lexer();
    lexer.setInput('[[option|blah]] text');

    expect(lexer.lex()).to.equal('OptionStart');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('OptionDelimit');
    expect(lexer.lex()).to.equal('Identifier');
    expect(lexer.lex()).to.equal('OptionEnd');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

  it('can tokenize a command', () => {
    const lexer = new Lexer();
    lexer.setInput('<<somecommand>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('Identifier');
    expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

	it('can tokenize a command with paren no argument', () => {
    const lexer = new Lexer();
    lexer.setInput('<<somecommand()>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('Identifier');
		expect(lexer.lex()).to.equal('LeftParen');
		expect(lexer.lex()).to.equal('RightParen');
    expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

it('can tokenize a command with an open argument', () => {
    const lexer = new Lexer();
    lexer.setInput('<<somecommand 2>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('Identifier');
    expect(lexer.lex()).to.equal('Number');
    expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });


it('can tokenize a command with two open arguments', () => {
    const lexer = new Lexer();
    lexer.setInput('<<somecommand 2 "face">>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('Identifier');
    expect(lexer.lex()).to.equal('Number');
		expect(lexer.lex()).to.equal('String');
    expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });
	
	it('can tokenize a command with a paren argument', () => {
    const lexer = new Lexer();
    lexer.setInput('<<somecommand(2)>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('Identifier');
		expect(lexer.lex()).to.equal('LeftParen');
    expect(lexer.lex()).to.equal('Number');
		expect(lexer.lex()).to.equal('RightParen');
    expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });
	
	it('can tokenize a command with two paren arguments', () => {
    const lexer = new Lexer();
    lexer.setInput('<<somecommand(2, "Face")>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('Identifier');
		expect(lexer.lex()).to.equal('LeftParen');
    expect(lexer.lex()).to.equal('Number');
    expect(lexer.lex()).to.equal('Comma');
    expect(lexer.lex()).to.equal('String');
		expect(lexer.lex()).to.equal('RightParen');
    expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

	it('can tokenize a command with an expression argument', () => {
    const lexer = new Lexer();
    lexer.setInput('<<somecommand(2 + 1)>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('Identifier');
		expect(lexer.lex()).to.equal('LeftParen');
    expect(lexer.lex()).to.equal('Number');
		expect(lexer.lex()).to.equal('Add');
		expect(lexer.lex()).to.equal('Number');
		expect(lexer.lex()).to.equal('RightParen');
    expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

	it('can tokenize a command with an expression argument 2', () => {
    const lexer = new Lexer();
    lexer.setInput('<<somecommand((2 + 1))>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('Identifier');
		expect(lexer.lex()).to.equal('LeftParen');
		expect(lexer.lex()).to.equal('LeftParen');
    expect(lexer.lex()).to.equal('Number');
		expect(lexer.lex()).to.equal('Add');
		expect(lexer.lex()).to.equal('Number');
		expect(lexer.lex()).to.equal('RightParen');
		expect(lexer.lex()).to.equal('RightParen');
    expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });
	
  it('can tokenize shortcut options', () => {
    const lexer = new Lexer();
    lexer.setInput('text\n-> shortcut1\n\tText1\n-> shortcut2\n\tText2\nmore text');

    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('ShortcutOption');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('Indent');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('Dedent');
    expect(lexer.lex()).to.equal('ShortcutOption');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('Indent');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('Dedent');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

  it('can tokenize nested shortcut options', () => {
    const lexer = new Lexer();
    lexer.setInput('text\n-> shortcut1\n\tText1\n\t-> nestedshortcut1\n\t\tNestedText1\n\t-> nestedshortcut2\n\t\tNestedText2\n-> shortcut2\n\tText2\nmore text');

    expect(lexer.lex()).to.equal('Text');

    expect(lexer.lex()).to.equal('ShortcutOption');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('Indent');

    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('ShortcutOption');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('Indent');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('Dedent');

    expect(lexer.lex()).to.equal('ShortcutOption');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('Indent');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('Dedent');

    expect(lexer.lex()).to.equal('Dedent');

    expect(lexer.lex()).to.equal('ShortcutOption');
    expect(lexer.lex()).to.equal('Text');

    expect(lexer.lex()).to.equal('Indent');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('Dedent');

    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

  it('can tokenize a simple assignment', () => {
    const lexer = new Lexer();
    lexer.setInput('<<set $testvar = -4.3>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('Set');
    expect(lexer.lex()).to.equal('Variable');
    expect(lexer.lex()).to.equal('EqualToOrAssign');
    expect(lexer.lex()).to.equal('Number');
    expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

  it('can tokenize an assignment involving arithmetic', () => {
    const lexer = new Lexer();
    lexer.setInput('<<set $testvar = -4.3 - (1 + 2) * 3.1 / 5>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('Set');
    expect(lexer.lex()).to.equal('Variable');
    expect(lexer.lex()).to.equal('EqualToOrAssign');
    expect(lexer.lex()).to.equal('Number');
    expect(lexer.lex()).to.equal('Minus');
    expect(lexer.lex()).to.equal('LeftParen');
    expect(lexer.lex()).to.equal('Number');
    expect(lexer.lex()).to.equal('Add');
    expect(lexer.lex()).to.equal('Number');
    expect(lexer.lex()).to.equal('RightParen');
    expect(lexer.lex()).to.equal('Multiply');
    expect(lexer.lex()).to.equal('Number');
    expect(lexer.lex()).to.equal('Divide');
    expect(lexer.lex()).to.equal('Number');
    expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

  it('can tokenize assignment with Exponent', () => {
    const lexer = new Lexer();
    lexer.setInput('<<set $testvar = (2 ** 2)>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('Set');
    expect(lexer.lex()).to.equal('Variable');
    expect(lexer.lex()).to.equal('EqualToOrAssign');
    expect(lexer.lex()).to.equal('LeftParen');
    expect(lexer.lex()).to.equal('Number');
    expect(lexer.lex()).to.equal('Exponent');
    expect(lexer.lex()).to.equal('Number');
    expect(lexer.lex()).to.equal('RightParen');
    expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });
	
  it('can tokenize an assignment with function call', () => {
    const lexer = new Lexer();
    lexer.setInput('<<set $testvar = visited(1)>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('Set');
    expect(lexer.lex()).to.equal('Variable');
    expect(lexer.lex()).to.equal('EqualToOrAssign');
    expect(lexer.lex()).to.equal('Identifier');
    expect(lexer.lex()).to.equal('LeftParen');
    expect(lexer.lex()).to.equal('Number');
    expect(lexer.lex()).to.equal('RightParen');
    expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

  it('can tokenize a simple conditional expression', () => {
    const lexer = new Lexer();
    lexer.setInput('<<if true>>Hi<<endif>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('If');
		expect(lexer.lex()).to.equal('True');
		expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('Text');
    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('EndIf');
    expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

  it('can tokenize If expression equalto number', () => {
    const lexer = new Lexer();
    lexer.setInput('<<if $testvar == 1>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('If');
		expect(lexer.lex()).to.equal('Variable');
		expect(lexer.lex()).to.equal('EqualTo');
		expect(lexer.lex()).to.equal('Number');
		expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

  it('can tokenize If expression GreaterThanOrEqualTo number', () => {
    const lexer = new Lexer();
    lexer.setInput('<<if $testvar >= 10>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('If');
		expect(lexer.lex()).to.equal('Variable');
		expect(lexer.lex()).to.equal('GreaterThanOrEqualTo');
		expect(lexer.lex()).to.equal('Number');
		expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });
	
  it('can tokenize If AND expression', () => {
    const lexer = new Lexer();
    lexer.setInput('<<if $testvar >= 10 && $testbool == true>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('If');
		expect(lexer.lex()).to.equal('Variable');
		expect(lexer.lex()).to.equal('GreaterThanOrEqualTo');
		expect(lexer.lex()).to.equal('Number');
		expect(lexer.lex()).to.equal('And');		
		expect(lexer.lex()).to.equal('Variable');
		expect(lexer.lex()).to.equal('EqualTo');
		expect(lexer.lex()).to.equal('True');
		expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });

  it('can tokenize If AND OR expression', () => {
    const lexer = new Lexer();
    lexer.setInput('<<if ($testvar >= 10 && $testbool == true) || $testvar == 100>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('If');
		expect(lexer.lex()).to.equal('LeftParen');	
		expect(lexer.lex()).to.equal('Variable');
		expect(lexer.lex()).to.equal('GreaterThanOrEqualTo');
		expect(lexer.lex()).to.equal('Number');
		expect(lexer.lex()).to.equal('And');		
		expect(lexer.lex()).to.equal('Variable');
		expect(lexer.lex()).to.equal('EqualTo');
		expect(lexer.lex()).to.equal('True');
		expect(lexer.lex()).to.equal('RightParen');	
		expect(lexer.lex()).to.equal('Or');
		expect(lexer.lex()).to.equal('Variable');
		expect(lexer.lex()).to.equal('EqualTo');
		expect(lexer.lex()).to.equal('Number');
		expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });
	
	  it('can tokenize ElseIf AND OR expression', () => {
    const lexer = new Lexer();
    lexer.setInput('<<elseif ($testvar >= 10 && $testbool == true) || $testvar == 100>>');

    expect(lexer.lex()).to.equal('BeginCommand');
    expect(lexer.lex()).to.equal('ElseIf');
		expect(lexer.lex()).to.equal('LeftParen');	
		expect(lexer.lex()).to.equal('Variable');
		expect(lexer.lex()).to.equal('GreaterThanOrEqualTo');
		expect(lexer.lex()).to.equal('Number');
		expect(lexer.lex()).to.equal('And');		
		expect(lexer.lex()).to.equal('Variable');
		expect(lexer.lex()).to.equal('EqualTo');
		expect(lexer.lex()).to.equal('True');
		expect(lexer.lex()).to.equal('RightParen');	
		expect(lexer.lex()).to.equal('Or');
		expect(lexer.lex()).to.equal('Variable');
		expect(lexer.lex()).to.equal('EqualTo');
		expect(lexer.lex()).to.equal('Number');
		expect(lexer.lex()).to.equal('EndCommand');
    expect(lexer.lex()).to.equal('EndOfInput');
  });
	
  it('can tokenize a simple inline expression', () => {
    const lexer = new Lexer();
    lexer.setInput('{$test}');
		
		expect(lexer.lex()).to.equal('BeginInlineExp');
    expect(lexer.lex()).to.equal('Variable');
    expect(lexer.lex()).to.equal('EndInlineExp');
    expect(lexer.lex()).to.equal('EndOfInput');
  });
	
	it('can tokenize an inline expression in a sentence', () => {
		const lexer = new Lexer();
		lexer.setInput('This is a {$test} sentence');

		expect(lexer.lex()).to.equal('Text');
		expect(lexer.lex()).to.equal('BeginInlineExp');
		expect(lexer.lex()).to.equal('Variable');
		expect(lexer.lex()).to.equal('EndInlineExp');
		expect(lexer.lex()).to.equal('Text');
		expect(lexer.lex()).to.equal('EndOfInput');
	});

	it('can tokenize an inline expression with addition in a sentence', () => {
		const lexer = new Lexer();
		lexer.setInput('This is a {$test + 1} sentence');
	
		expect(lexer.lex()).to.equal('Text');
		expect(lexer.lex()).to.equal('BeginInlineExp');
		expect(lexer.lex()).to.equal('Variable');
    expect(lexer.lex()).to.equal('Add');
    expect(lexer.lex()).to.equal('Number');
		expect(lexer.lex()).to.equal('EndInlineExp');
		expect(lexer.lex()).to.equal('Text');
		expect(lexer.lex()).to.equal('EndOfInput');
	});

	it('can tokenize an inline expression with exponent in a sentence', () => {
		const lexer = new Lexer();
		lexer.setInput('This is a {2 ** 2} sentence');
	
		expect(lexer.lex()).to.equal('Text');
		expect(lexer.lex()).to.equal('BeginInlineExp');
		expect(lexer.lex()).to.equal('Number');
    expect(lexer.lex()).to.equal('Exponent');
    expect(lexer.lex()).to.equal('Number');
		expect(lexer.lex()).to.equal('EndInlineExp');
		expect(lexer.lex()).to.equal('Text');
		expect(lexer.lex()).to.equal('EndOfInput');
	});
});
