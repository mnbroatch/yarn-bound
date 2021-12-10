'use strict';

const LexerState = require('./lexer-state.js');

/**
 * @return {Object}  all states in which the lexer can be with their associated transitions.
 */
function makeStates() {
  return {
    base: new LexerState()
			.addTransition('BeginCommand', 'command', true)
			.addTransition('OptionStart', 'option', true)
			.addTransition('BeginInlineExp', 'inlineExpression', true)
			.addTransition('ShortcutOption', 'shortcutOption')
			.addTextRule('Text'),

    shortcutOption: new LexerState()
			.setTrackNextIndentation(true)
			.addTransition('BeginCommand', 'expression', true)
			.addTextRule('Text', 'base'),

    command: new LexerState()
			.addTransition('If', 'expression')
			.addTransition('Else')
			.addTransition('ElseIf', 'expression')
			.addTransition('EndIf')
			.addTransition('Set', 'assignment')
			.addTransition('EndCommand', 'base', true)
			.addTransition('Identifier', 'commandArg', true)
			.addTextRule('Text'),

    commandArg: new LexerState()
			.addTransition('EndCommand', 'base', true)
			.addTransition('LeftParen', 'commandParenArgOrExpression')
			.addTransition('Variable')
			.addTransition('Number')
			.addTransition('String')
			.addTransition('True')
			.addTransition('False')
			.addTransition('Identifier')
			.addTransition('Comma')
			.addTransition('RightParen'),

    commandParenArgOrExpression: new LexerState()
			.addTransition('EndCommand', 'base', true)
			.addTransition('LeftParen', 'expression')			
			.addTransition('Variable','expression')
			.addTransition('Number','expression')
			.addTransition('String')
			.addTransition('True')
			.addTransition('False')
			.addTransition('Null')
			.addTransition('RightParen'),
			
    assignment: new LexerState()
			.addTransition('Variable')
			.addTransition('EqualToOrAssign', 'expression')
			.addTransition('AddAssign', 'expression')
			.addTransition('MinusAssign', 'expression')
			.addTransition('MultiplyAssign', 'expression')
			.addTransition('DivideAssign', 'expression'),

    expression: new LexerState()
			.addTransition('EndCommand', 'base')
			.addTransition('Number')
			.addTransition('String')
			.addTransition('LeftParen')
			.addTransition('RightParen')
			.addTransition('EqualTo')
			.addTransition('EqualToOrAssign')
			.addTransition('NotEqualTo')
			.addTransition('GreaterThanOrEqualTo')
			.addTransition('GreaterThan')
			.addTransition('LessThanOrEqualTo')
			.addTransition('LessThan')
			.addTransition('Add')
			.addTransition('Minus')
			.addTransition('Exponent')
			.addTransition('Multiply')
			.addTransition('Divide')
			.addTransition('And')
			.addTransition('Or')
			.addTransition('Xor')
			.addTransition('Not')
			.addTransition('Variable')
			.addTransition('Comma')
			.addTransition('True')
			.addTransition('False')
			.addTransition('Null')
			.addTransition('Identifier')
			.addTextRule(),

    option: new LexerState()
			.addTransition('OptionEnd', 'base', true)
			.addTransition('OptionDelimit', 'optionDestination', true)
			.addTextRule('Text'),

    optionDestination: new LexerState()
			.addTransition('Identifier')
			.addTransition('OptionEnd', 'base'),

    inlineExpression: new LexerState()
			.addTransition('EndInlineExp', 'base')
			.addTransition('Number')
			.addTransition('String')
			.addTransition('LeftParen')
			.addTransition('RightParen')
			.addTransition('Variable')
			.addTransition('Add')
			.addTransition('Minus')
			.addTransition('Exponent')
			.addTransition('Multiply')
			.addTransition('Divide')
			.addTextRule('Text', 'base')
  };
}

module.exports = {
  makeStates: makeStates,
};
