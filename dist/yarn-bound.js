(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["YarnBound"] = factory();
	else
		root["YarnBound"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 897:
/***/ ((module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = convertYarnToJS;
/* eslint-disable */
/*
Yoinked from YarnEditor source and modified to limit size and scope:

https://github.com/YarnSpinnerTool/YarnEditor/blob/master/src/js/classes/data.js

Including as a dependency would be large and subject to breakage, so we adapt it instead.

I guess this counts as a "substantial portion" (?), so:

--------------


Copyright (c) 2015 Infinite Ammo Inc. and Yarn Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/* eslint-enable */

function convertYarnToJS(content) {
  const objects = [];
  const lines = content.split(/\r?\n+/).filter(line => {
    return !line.match(/^\s*$/);
  });
  let obj = null;
  let readingBody = false;
  let filetags;

  // per-node, we will uniformly strip leading space
  // which can result from constructing dialogues
  // using template strings.
  let leadingSpace = '';
  let i = 0;
  while (lines[i].trim()[0] === '#') {
    if (!filetags) filetags = [];
    filetags.push(lines[i].trim().substr(1));
    i += 1;
  }
  for (; i < lines.length; i += 1) {
    if (lines[i].trim() === '===') {
      readingBody = false;
      if (filetags) obj.filetags = filetags;
      objects.push(obj);
      obj = null;
    } else if (readingBody) {
      obj.body += `${lines[i].replace(leadingSpace, '')}\n`;
    } else if (lines[i].trim() === '---') {
      readingBody = true;
      obj.body = '';
      leadingSpace = lines[i].match(/^\s*/)[0];
    } else if (lines[i].indexOf(':') > -1) {
      const [key, value] = lines[i].split(':');
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();
      if (trimmedKey !== 'body') {
        if (obj == null) obj = {};
        if (obj[trimmedKey]) {
          throw new Error(`Duplicate tag on node: ${trimmedKey}`);
        }
        obj[trimmedKey] = trimmedValue;
      }
    }
  }
  return objects;
}
module.exports = exports.default;

/***/ }),

/***/ 163:
/***/ ((module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
class DefaultVariableStorage {
  constructor() {
    this.data = {};
  }
  set(name, value) {
    this.data[name] = value;
  }

  // Called when a variable is being evaluated.
  get(name) {
    return this.data[name];
  }
}
var _default = exports["default"] = DefaultVariableStorage;
module.exports = exports.default;

/***/ }),

/***/ 947:
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _runner = _interopRequireDefault(__webpack_require__(333));
var _results = _interopRequireDefault(__webpack_require__(377));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
_runner.default.OptionsResult = _results.default.OptionsResult;
_runner.default.TextResult = _results.default.TextResult;
_runner.default.CommandResult = _results.default.CommandResult;
var _default = exports["default"] = _runner.default;
module.exports = exports.default;

/***/ }),

/***/ 172:
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _tokens = _interopRequireDefault(__webpack_require__(958));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * A LexState object represents one of the states in which the lexer can be.
 */
class LexerState {
  constructor() {
    /** A list of transition for the given state. */
    this.transitions = [];
    /** A special, unique transition for matching spans of text in any state. */
    this.textRule = null;
    /**
     * Whether or not this state is context-bound by indentation
     * (will make the lexer emit Indent and Dedent tokens).
     */
    this.isTrackingNextIndentation = false;
  }

  /**
   * addTransition - Define a new transition for this state.
   *
   * @param  {type} token - the token to match
   * @param  {string} [state] - the state to which transition; if not provided, will
   *                            remain in the same state.
   * @param  {boolean} [delimitsText] - `true` if the token is a text delimiter. A text delimiters
   *                                    is a token which should be considered as a token, even if it
   *                                    doesn't start the line.
   * @return {Object} - returns the LexState itself for chaining.
   */
  addTransition(token, state, delimitsText) {
    this.transitions.push({
      token: token,
      regex: _tokens.default[token],
      state: state || null,
      delimitsText: delimitsText || false
    });
    return this; // Return this for chaining
  }

  /**
   * addTextRule - Match all the way up to any of the other transitions in this state.
   *               The text rule can only be added once.
   *
   * @param  {type} type  description
   * @param  {type} state description
   * @return {Object} - returns the LexState itself for chaining.
   */
  addTextRule(type, state) {
    if (this.textRule) {
      throw new Error('Cannot add more than one text rule to a state.');
    }

    // Go through the regex of the other transitions in this state, and create a regex that will
    // match all text, up to any of those transitions.
    const rules = [];
    this.transitions.forEach(transition => {
      if (transition.delimitsText) {
        // Surround the rule in parens
        rules.push(`(${transition.regex.source})`);
      }
    });

    // Join the rules that we got above on a |, then put them all into a negative lookahead.
    const textPattern = `((?!${rules.join('|')}).)+`;
    this.addTransition(type, state);

    // Update the regex in the transition we just added to our new one.
    this.textRule = this.transitions[this.transitions.length - 1];
    this.textRule.regex = new RegExp(textPattern);
    return this;
  }

  /**
   * setTrackNextIndentation - tell this state whether to track indentation.
   *
   * @param  {boolean} track - `true` to track, `false` otherwise.
   * @return {Object} - returns the LexState itself for chaining.
   */
  setTrackNextIndentation(track) {
    this.isTrackingNextIndentation = track;
    return this;
  }
}
var _default = exports["default"] = LexerState;
module.exports = exports.default;

/***/ }),

/***/ 160:
/***/ ((module, exports, __webpack_require__) => {



// Syncs with YarnSpinner@e0f6807,
// see https://github.com/thesecretlab/YarnSpinner/blob/master/YarnSpinner/Lexer.cs
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _states = _interopRequireDefault(__webpack_require__(434));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// As opposed to the original C# implemntation which, tokenize the entire input, before emiting
// a list of tokens, this parser will emit a token each time `lex()` is called. This change
// accomodates the Jison parser. Given the lexer is not entirely context-free
// (Off-side rule, lookaheads), context needs to be remembered between each `lex()` calls.
class Lexer {
  constructor() {
    /** All the possible states for the lexer. */
    this.states = _states.default.makeStates();

    /** Current state identifier. */
    this.state = 'base';

    /** Original text to lex. */
    this.originalText = '';

    /** Text to lex, splitted into an array of lines. */
    this.lines = [];

    // Properties used to keep track of the context we're in, while tokenizing each line.
    /**
     * Indentation tracker. Each time we encounter an identation, we push a
     * new array which looks like: [indentationLevel, isBaseIndentation]. Basically,
     * isBaseIndentation will be true only for the first level.
     */
    this.indentation = [[0, false]];

    /**
     * Set to true when a state required indentation tracking. Will be set to false, after a
     * an indentation is found.
     */
    this.shouldTrackNextIndentation = false;

    /**
     * The previous level of identation, basically: this.indentation.last()[0].
     */
    this.previousLevelOfIndentation = 0;

    // Reset the locations.
    this.reset();
  }

  /**
   * reset - Reset the lexer location, text and line number. Nothing fancy.
   */
  reset() {
    // Locations, used by both the lexer and the Jison parser.
    this.yytext = '';
    this.yylloc = {
      first_column: 1,
      first_line: 1,
      last_column: 1,
      last_line: 1
    };
    this.yylineno = 1;
  }

  /**
   * lex - Lex the input and emit the next matched token.
   *
   * @return {string}  Emit the next token found.
   */
  lex() {
    if (this.isAtTheEndOfText()) {
      this.yytext = '';

      // Now that we're at the end of the text, we'll emit as many
      // `Dedent` as necessary, to get back to 0-indentation.
      const indent = this.indentation.pop();
      if (indent && indent[1]) {
        return 'Dedent';
      }
      return 'EndOfInput';
    }
    if (this.isAtTheEndOfLine()) {
      // Get the next token on the current line
      this.advanceLine();
      return 'EndOfLine';
    }
    return this.lexNextTokenOnCurrentLine();
  }
  advanceLine() {
    this.yylineno += 1;
    const currentLine = this.getCurrentLine();
    this.lines[this.yylineno - 1] = currentLine;
    this.previousLevelOfIndentation = this.getLastRecordedIndentation()[0];
    this.yytext = '';
    this.yylloc = {
      first_column: 1,
      first_line: this.yylineno,
      last_column: 1,
      last_line: this.yylineno
    };
  }
  lexNextTokenOnCurrentLine() {
    const thisIndentation = this.getCurrentLineIndentation();
    if (this.shouldTrackNextIndentation && this.yylloc.first_column === this.yylloc.last_column && thisIndentation > this.previousLevelOfIndentation) {
      this.indentation.push([thisIndentation, true]);
      this.shouldTrackNextIndentation = false;
      this.yylloc.first_column = this.yylloc.last_column;
      this.yylloc.last_column += thisIndentation;
      this.yytext = '';
      return 'Indent';
    } else if (thisIndentation < this.getLastRecordedIndentation()[0]) {
      const indent = this.indentation.pop();
      if (indent[1] && this.yylloc.first_column === this.yylloc.last_column) {
        this.yytext = '';
        this.previousLevelOfIndentation = this.getLastRecordedIndentation()[0];
        return 'Dedent';
      }
    }
    if (thisIndentation === this.previousLevelOfIndentation && this.yylloc.last_column === 1) {
      this.yylloc.last_column += thisIndentation;
    }
    let rule = this.getState().transitions.find(rule => {
      const match = this.getCurrentLine().substring(this.yylloc.last_column - 1).match(rule.regex);
      // Only accept valid matches that are at the beginning of the text
      return match !== null && match.index === 0;
    });
    let match = this.getCurrentLine().substring(this.yylloc.last_column - 1).match(rule.regex);
    if (this.yylloc.last_column === 1 && !this.shouldTrackNextIndentation) {
      const spaceMatch = this.getCurrentLine().substring(this.yylloc.last_column - 1).match(/^\s*/);
      this.yylloc.last_column += spaceMatch[0].length;
      rule = this.getState().transitions.find(rule => {
        const match = this.getCurrentLine().substring(this.yylloc.last_column - 1).match(rule.regex);
        // Only accept valid matches that are at the beginning of the text
        return match !== null && match.index === 0;
      });
      match = this.getCurrentLine().substring(this.yylloc.last_column - 1).match(rule.regex);
    }

    // Take the matched text off the front of this.text
    const matchedText = match[0];

    // Tell the parser what the text for this token is
    this.yytext = this.getCurrentLine().substr(this.yylloc.last_column - 1, matchedText.length);
    if (rule.token === 'String') {
      // If that's a String, remove the quotes
      this.yytext = this.yytext.substring(1, this.yytext.length - 1);
    }

    // Update our line and column info
    this.yylloc.first_column = this.yylloc.last_column;
    this.yylloc.last_column += matchedText.length;

    // If the rule points to a new state, change it now
    if (rule.state) {
      this.setState(rule.state);
      if (this.shouldTrackNextIndentation) {
        if (this.getLastRecordedIndentation()[0] < thisIndentation) {
          this.indentation.push([thisIndentation, false]);
        }
      }
    }
    const nextState = this.states[rule.state];
    const nextStateHasText = !rule.state || nextState.transitions.find(transition => {
      return transition.token === 'Text';
    });
    // inline expressions and escaped characters interrupt text
    // but should still preserve surrounding whitespace.
    if (rule.token !== 'EndInlineExp' && rule.token !== 'EscapedCharacter' || !nextStateHasText // we never want leading whitespace if not in text-supporting state
    ) {
      // Remove leading whitespace characters
      const spaceMatch = this.getCurrentLine().substring(this.yylloc.last_column - 1).match(/^\s*/);
      if (spaceMatch[0]) {
        this.yylloc.last_column += spaceMatch[0].length;
      }
    }
    return rule.token;
    throw new Error(`Invalid syntax in: ${this.getCurrentLine()}`);
  }

  // /////////////// Getters & Setters

  /**
   * setState - set the current state of the lexer.
   *
   * @param  {string} state name of the state
   */
  setState(state) {
    if (this.states[state] === undefined) {
      throw new Error(`Cannot set the unknown state [${state}]`);
    }
    this.state = state;
    if (this.getState().isTrackingNextIndentation) {
      this.shouldTrackNextIndentation = true;
    }
  }

  /**
   * setInput - Set the text on which perform lexical analysis.
   *
   * @param  {string} text the text to lex.
   */
  setInput(text) {
    // Delete carriage return while keeping a similar semantic.
    this.originalText = text.replace(/(\r\n)/g, '\n').replace(/\r/g, '\n').replace(/[\n\r]+$/, '');
    // Transform the input into an array of lines.
    this.lines = this.originalText.split('\n').map(line => line.replace(/\t/, '    '));
    this.reset();
  }

  /**
   * getState - Returns the full current state object (LexerState),
   * rather than its identifier.
   *
   * @return {Object}  the state object.
   */
  getState() {
    return this.states[this.state];
  }
  getCurrentLine() {
    return this.lines[this.yylineno - 1];
  }
  getCurrentLineIndentation() {
    const match = this.getCurrentLine().match(/^(\s*)/g);
    return match[0].length;
  }
  getLastRecordedIndentation() {
    if (this.indentation.length === 0) {
      return [0, false];
    }
    return this.indentation[this.indentation.length - 1];
  }

  // /////////////// Booleans tests
  /**
   * @return {boolean}  `true` when yylloc indicates that the end was reached.
   */
  isAtTheEndOfText() {
    return this.isAtTheEndOfLine() && this.yylloc.first_line >= this.lines.length;
  }

  /**
   * @return {boolean}  `true` when yylloc indicates that the end of the line was reached.
   */
  isAtTheEndOfLine() {
    return this.yylloc.last_column > this.getCurrentLine().length;
  }
}
var _default = exports["default"] = Lexer;
module.exports = exports.default;

/***/ }),

/***/ 434:
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _lexerState = _interopRequireDefault(__webpack_require__(172));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @return {Object}  all states in which the lexer can be with their associated transitions.
 */
function makeStates() {
  return {
    base: new _lexerState.default().addTransition('EscapedCharacter', null, true).addTransition('Comment', null, true).addTransition('Hashtag', null, true).addTransition('BeginCommand', 'command', true).addTransition('BeginInlineExp', 'inlineExpression', true).addTransition('ShortcutOption', 'shortcutOption').addTextRule('Text'),
    shortcutOption: new _lexerState.default().setTrackNextIndentation(true).addTransition('EscapedCharacter', null, true).addTransition('Comment', null, true).addTransition('Hashtag', null, true).addTransition('BeginCommand', 'expression', true).addTransition('BeginInlineExp', 'inlineExpressionInShortcut', true).addTextRule('Text', 'base'),
    command: new _lexerState.default().addTransition('If', 'expression').addTransition('Else').addTransition('ElseIf', 'expression').addTransition('EndIf').addTransition('Set', 'assignment').addTransition('Declare', 'declare').addTransition('Jump', 'jump').addTransition('Stop', 'stop').addTransition('BeginInlineExp', 'inlineExpressionInCommand', true).addTransition('EndCommand', 'base', true).addTextRule('Text'),
    commandArg: new _lexerState.default().addTextRule('Text'),
    commandParenArgOrExpression: new _lexerState.default().addTransition('EndCommand', 'base', true).addTransition('LeftParen', 'expression').addTransition('Variable', 'expression').addTransition('Number', 'expression').addTransition('String').addTransition('True').addTransition('False').addTransition('Null').addTransition('RightParen'),
    assignment: new _lexerState.default().addTransition('Variable').addTransition('EqualToOrAssign', 'expression'),
    declare: new _lexerState.default().addTransition('Variable').addTransition('EndCommand', 'base').addTransition('EqualToOrAssign', 'expression'),
    jump: new _lexerState.default().addTransition('Identifier').addTransition('BeginInlineExp', 'inlineExpressionInCommand', true).addTransition('EndCommand', 'base', true),
    stop: new _lexerState.default().addTransition('EndCommand', 'base', true),
    expression: new _lexerState.default().addTransition('As').addTransition('ExplicitType').addTransition('EndCommand', 'base').addTransition('Number').addTransition('String').addTransition('LeftParen').addTransition('RightParen').addTransition('EqualTo').addTransition('EqualToOrAssign').addTransition('NotEqualTo').addTransition('GreaterThanOrEqualTo').addTransition('GreaterThan').addTransition('LessThanOrEqualTo').addTransition('LessThan').addTransition('Add').addTransition('UnaryMinus').addTransition('Minus').addTransition('Exponent').addTransition('Multiply').addTransition('Divide').addTransition('Modulo').addTransition('And').addTransition('Or').addTransition('Xor').addTransition('Not').addTransition('Variable').addTransition('Comma').addTransition('True').addTransition('False').addTransition('Null').addTransition('Identifier').addTextRule(),
    inlineExpression: new _lexerState.default().addTransition('EndInlineExp', 'base').addTransition('Number').addTransition('String').addTransition('LeftParen').addTransition('RightParen').addTransition('EqualTo').addTransition('EqualToOrAssign').addTransition('NotEqualTo').addTransition('GreaterThanOrEqualTo').addTransition('GreaterThan').addTransition('LessThanOrEqualTo').addTransition('LessThan').addTransition('Add').addTransition('UnaryMinus').addTransition('Minus').addTransition('Exponent').addTransition('Multiply').addTransition('Divide').addTransition('Modulo').addTransition('And').addTransition('Or').addTransition('Xor').addTransition('Not').addTransition('Variable').addTransition('Comma').addTransition('True').addTransition('False').addTransition('Null').addTransition('Identifier').addTextRule('Text', 'base'),
    // TODO: Copied from above
    // There has to be a non-stupid way to do this, right?
    // I'm just not familiar enough yet to know how to
    // transition from inline expression back to base OR command
    // states depending on how we got there
    inlineExpressionInCommand: new _lexerState.default().addTransition('EndInlineExp', 'command').addTransition('Number').addTransition('String').addTransition('LeftParen').addTransition('RightParen').addTransition('EqualTo').addTransition('EqualToOrAssign').addTransition('NotEqualTo').addTransition('GreaterThanOrEqualTo').addTransition('GreaterThan').addTransition('LessThanOrEqualTo').addTransition('LessThan').addTransition('Add').addTransition('UnaryMinus').addTransition('Minus').addTransition('Exponent').addTransition('Multiply').addTransition('Divide').addTransition('Modulo').addTransition('And').addTransition('Or').addTransition('Xor').addTransition('Not').addTransition('Variable').addTransition('Comma').addTransition('True').addTransition('False').addTransition('Null').addTransition('Identifier').addTextRule('Text', 'base'),
    inlineExpressionInShortcut: new _lexerState.default().addTransition('EndInlineExp', 'shortcutOption').addTransition('Number').addTransition('String').addTransition('LeftParen').addTransition('RightParen').addTransition('EqualTo').addTransition('EqualToOrAssign').addTransition('NotEqualTo').addTransition('GreaterThanOrEqualTo').addTransition('GreaterThan').addTransition('LessThanOrEqualTo').addTransition('LessThan').addTransition('Add').addTransition('UnaryMinus').addTransition('Minus').addTransition('Exponent').addTransition('Multiply').addTransition('Divide').addTransition('Modulo').addTransition('And').addTransition('Or').addTransition('Xor').addTransition('Not').addTransition('Variable').addTransition('Comma').addTransition('True').addTransition('False').addTransition('Null').addTransition('Identifier').addTextRule('Text', 'base')
  };
}
var _default = exports["default"] = {
  makeStates: makeStates
};
module.exports = exports.default;

/***/ }),

/***/ 958:
/***/ ((module, exports) => {



/**
 * Token identifier -> regular expression to match the lexeme. That's a list of all the token
 * which can be emitted by the lexer. For now, we're slightly bending the style guide,
 * to make sure the debug output of the javascript lexer will (kinda) match the original C# one.
 */
/* eslint-disable key-spacing */
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
const Tokens = {
  // Special tokens
  Whitespace: null,
  // (not used currently)
  Indent: null,
  Dedent: null,
  EndOfLine: /\n/,
  EndOfInput: null,
  // Literals in ("<<commands>>")
  Number: /-?[0-9]+(\.[0-9+])?/,
  String: /"([^"\\]*(?:\\.[^"\\]*)*)"/,
  // Command syntax ("<<foo>>")
  BeginCommand: /<</,
  EndCommand: />>/,
  // Variables ("$foo")
  Variable: /\$([A-Za-z0-9_.])+/,
  // Shortcut syntax ("->")
  ShortcutOption: /->/,
  // Hashtag ("#something")
  Hashtag: /#([^(\s|#|//)]+)/,
  // seems a little hacky to explicitly consider comments here

  // Comment ("// some stuff")
  Comment: /\/\/.*/,
  // Option syntax ("[[Let's go here|Destination]]")
  OptionStart: /\[\[/,
  // [[
  OptionDelimit: /\|/,
  // |
  OptionEnd: /\]\]/,
  // ]]

  // Command types (specially recognized command word)
  If: /if(?!\w)/,
  ElseIf: /elseif(?!\w)/,
  Else: /else(?!\w)/,
  EndIf: /endif(?!\w)/,
  Jump: /jump(?!\w)/,
  Stop: /stop(?!\w)/,
  Set: /set(?!\w)/,
  Declare: /declare(?!\w)/,
  As: /as(?!\w)/,
  ExplicitType: /(String|Number|Bool)(?=>>)/,
  // Boolean values
  True: /true(?!\w)/,
  False: /false(?!\w)/,
  // The null value
  Null: /null(?!\w)/,
  // Parentheses
  LeftParen: /\(/,
  RightParen: /\)/,
  // Parameter delimiters
  Comma: /,/,
  // Operators
  UnaryMinus: /-(?!\s)/,
  EqualTo: /(==|is(?!\w)|eq(?!\w))/,
  // ==, eq, is
  GreaterThan: /(>|gt(?!\w))/,
  // >, gt
  GreaterThanOrEqualTo: /(>=|gte(?!\w))/,
  // >=, gte
  LessThan: /(<|lt(?!\w))/,
  // <, lt
  LessThanOrEqualTo: /(<=|lte(?!\w))/,
  // <=, lte
  NotEqualTo: /(!=|neq(?!\w))/,
  // !=, neq

  // Logical operators
  Or: /(\|\||or(?!\w))/,
  // ||, or
  And: /(&&|and(?!\w))/,
  // &&, and
  Xor: /(\^|xor(?!\w))/,
  // ^, xor
  Not: /(!|not(?!\w))/,
  // !, not

  // this guy's special because '=' can mean either 'equal to'
  // or 'becomes' depending on context
  EqualToOrAssign: /(=|to(?!\w))/,
  // =, to

  Add: /\+/,
  // +
  Minus: /-/,
  // -
  Exponent: /\*\*/,
  // **
  Multiply: /\*/,
  // *
  Divide: /\//,
  // /
  Modulo: /%/,
  // /

  AddAssign: /\+=/,
  // +=
  MinusAssign: /-=/,
  // -=
  MultiplyAssign: /\*=/,
  // *=
  DivideAssign: /\/=/,
  // /=

  Identifier: /[a-zA-Z0-9_:.]+/,
  // a single word (used for functions)

  EscapedCharacter: /\\./,
  // for escaping \# special characters
  Text: /[^\\]/,
  // generic until we hit other syntax

  // Braces are used for inline expressions. Ignore escaped braces
  // TODO: doesn't work ios
  BeginInlineExp: /{/,
  // {
  EndInlineExp: /}/ // }
};
/* eslint-enable key-spacing */
var _default = exports["default"] = Tokens;
module.exports = exports.default;

/***/ }),

/***/ 358:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Parser = Parser;
exports.parser = void 0;
var o = function (k, v, o, l) {
    for (o = o || {}, l = k.length; l--; o[k[l]] = v);
    return o;
  },
  $V0 = [1, 6],
  $V1 = [1, 17],
  $V2 = [1, 18],
  $V3 = [1, 13],
  $V4 = [1, 20],
  $V5 = [1, 19],
  $V6 = [5, 8, 18, 19, 23, 34, 36, 77],
  $V7 = [1, 24],
  $V8 = [5, 18, 19, 23, 34, 36, 77],
  $V9 = [1, 25],
  $Va = [1, 27],
  $Vb = [1, 28],
  $Vc = [5, 8, 9, 18, 19, 21, 23, 34, 36, 77],
  $Vd = [1, 32],
  $Ve = [1, 36],
  $Vf = [1, 37],
  $Vg = [1, 38],
  $Vh = [1, 39],
  $Vi = [5, 8, 9, 18, 19, 21, 23, 26, 34, 36, 77],
  $Vj = [1, 52],
  $Vk = [1, 51],
  $Vl = [1, 46],
  $Vm = [1, 47],
  $Vn = [1, 48],
  $Vo = [1, 53],
  $Vp = [1, 54],
  $Vq = [1, 55],
  $Vr = [1, 56],
  $Vs = [1, 57],
  $Vt = [5, 8, 9, 18, 19, 23, 34, 36, 77],
  $Vu = [1, 73],
  $Vv = [1, 74],
  $Vw = [1, 75],
  $Vx = [1, 76],
  $Vy = [1, 77],
  $Vz = [1, 78],
  $VA = [1, 79],
  $VB = [1, 80],
  $VC = [1, 81],
  $VD = [1, 82],
  $VE = [1, 83],
  $VF = [1, 84],
  $VG = [1, 85],
  $VH = [1, 86],
  $VI = [1, 87],
  $VJ = [26, 46, 51, 53, 54, 55, 56, 57, 58, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 78],
  $VK = [26, 46, 51, 53, 54, 55, 56, 57, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 78],
  $VL = [26, 46, 51, 70, 78],
  $VM = [1, 124],
  $VN = [1, 125],
  $VO = [26, 46, 51, 53, 54, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 78],
  $VP = [26, 46, 51, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 78],
  $VQ = [51, 70],
  $VR = [8, 9, 18, 19, 23, 34, 77];
var parser = exports.parser = {
  trace: function trace() {},
  yy: {},
  symbols_: {
    "error": 2,
    "node": 3,
    "statements": 4,
    "EndOfInput": 5,
    "conditionalBlock": 6,
    "statement": 7,
    "Comment": 8,
    "EndOfLine": 9,
    "text": 10,
    "shortcut": 11,
    "genericCommand": 12,
    "assignmentCommand": 13,
    "jumpCommand": 14,
    "stopCommand": 15,
    "hashtags": 16,
    "textNode": 17,
    "Text": 18,
    "EscapedCharacter": 19,
    "inlineExpression": 20,
    "Hashtag": 21,
    "conditional": 22,
    "BeginCommand": 23,
    "If": 24,
    "expression": 25,
    "EndCommand": 26,
    "EndIf": 27,
    "additionalConditionalBlocks": 28,
    "else": 29,
    "Else": 30,
    "elseif": 31,
    "ElseIf": 32,
    "shortcutOption": 33,
    "ShortcutOption": 34,
    "Indent": 35,
    "Dedent": 36,
    "Jump": 37,
    "Identifier": 38,
    "Stop": 39,
    "setCommandInner": 40,
    "declareCommandInner": 41,
    "Set": 42,
    "Variable": 43,
    "EqualToOrAssign": 44,
    "Declare": 45,
    "As": 46,
    "ExplicitType": 47,
    "functionArgument": 48,
    "functionCall": 49,
    "LeftParen": 50,
    "RightParen": 51,
    "UnaryMinus": 52,
    "Add": 53,
    "Minus": 54,
    "Exponent": 55,
    "Multiply": 56,
    "Divide": 57,
    "Modulo": 58,
    "Not": 59,
    "Or": 60,
    "And": 61,
    "Xor": 62,
    "EqualTo": 63,
    "NotEqualTo": 64,
    "GreaterThan": 65,
    "GreaterThanOrEqualTo": 66,
    "LessThan": 67,
    "LessThanOrEqualTo": 68,
    "parenExpressionArgs": 69,
    "Comma": 70,
    "literal": 71,
    "True": 72,
    "False": 73,
    "Number": 74,
    "String": 75,
    "Null": 76,
    "BeginInlineExp": 77,
    "EndInlineExp": 78,
    "$accept": 0,
    "$end": 1
  },
  terminals_: {
    2: "error",
    5: "EndOfInput",
    8: "Comment",
    9: "EndOfLine",
    18: "Text",
    19: "EscapedCharacter",
    21: "Hashtag",
    23: "BeginCommand",
    24: "If",
    26: "EndCommand",
    27: "EndIf",
    30: "Else",
    32: "ElseIf",
    34: "ShortcutOption",
    35: "Indent",
    36: "Dedent",
    37: "Jump",
    38: "Identifier",
    39: "Stop",
    42: "Set",
    43: "Variable",
    44: "EqualToOrAssign",
    45: "Declare",
    46: "As",
    47: "ExplicitType",
    50: "LeftParen",
    51: "RightParen",
    52: "UnaryMinus",
    53: "Add",
    54: "Minus",
    55: "Exponent",
    56: "Multiply",
    57: "Divide",
    58: "Modulo",
    59: "Not",
    60: "Or",
    61: "And",
    62: "Xor",
    63: "EqualTo",
    64: "NotEqualTo",
    65: "GreaterThan",
    66: "GreaterThanOrEqualTo",
    67: "LessThan",
    68: "LessThanOrEqualTo",
    70: "Comma",
    72: "True",
    73: "False",
    74: "Number",
    75: "String",
    76: "Null",
    77: "BeginInlineExp",
    78: "EndInlineExp"
  },
  productions_: [0, [3, 2], [4, 1], [4, 2], [4, 1], [4, 2], [7, 2], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 2], [7, 2], [7, 2], [17, 1], [17, 1], [10, 1], [10, 1], [10, 2], [16, 1], [16, 2], [22, 4], [6, 6], [6, 4], [6, 2], [29, 3], [29, 2], [31, 4], [31, 2], [28, 5], [28, 5], [28, 3], [33, 2], [33, 3], [33, 2], [33, 2], [33, 3], [33, 2], [11, 1], [11, 5], [12, 3], [14, 4], [14, 4], [15, 3], [13, 3], [13, 3], [40, 4], [41, 4], [41, 6], [25, 1], [25, 1], [25, 3], [25, 2], [25, 3], [25, 3], [25, 3], [25, 3], [25, 3], [25, 3], [25, 2], [25, 3], [25, 3], [25, 3], [25, 3], [25, 3], [25, 3], [25, 3], [25, 3], [25, 3], [49, 3], [49, 4], [69, 3], [69, 1], [48, 1], [48, 1], [48, 1], [71, 1], [71, 1], [71, 1], [71, 1], [71, 1], [20, 3]],
  performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
    /* this == yyval */

    var $0 = $$.length - 1;
    switch (yystate) {
      case 1:
        return $$[$0 - 1].flat();
        break;
      case 2:
      case 4:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 18:
      case 19:
      case 74:
        this.$ = [$$[$0]];
        break;
      case 3:
      case 20:
        this.$ = $$[$0 - 1].concat($$[$0]);
        break;
      case 5:
        this.$ = $$[$0 - 1].concat([$$[$0]]);
        break;
      case 6:
      case 27:
      case 28:
        this.$ = undefined;
        break;
      case 7:
      case 52:
        this.$ = $$[$0];
        break;
      case 13:
      case 15:
      case 26:
      case 29:
      case 30:
      case 46:
      case 53:
        this.$ = $$[$0 - 1];
        break;
      case 14:
        this.$ = $$[$0 - 1].map(s => Object.assign(s, {
          hashtags: $$[$0]
        }));
        break;
      case 16:
        this.$ = new yy.TextNode($$[$0], this._$);
        break;
      case 17:
        this.$ = new yy.EscapedCharacterNode($$[$0], this._$);
        break;
      case 21:
        this.$ = [$$[$0].substring(1)];
        break;
      case 22:
        this.$ = [$$[$0 - 1].substring(1)].concat($$[$0]);
        break;
      case 23:
      case 37:
      case 39:
        this.$ = $$[$0 - 1];
        break;
      case 24:
        this.$ = new yy.IfNode($$[$0 - 5], $$[$0 - 3].flat());
        break;
      case 25:
        this.$ = new yy.IfElseNode($$[$0 - 3], $$[$0 - 1].flat(), $$[$0]);
        break;
      case 31:
        this.$ = new yy.ElseNode($$[$0 - 3].flat());
        break;
      case 32:
        this.$ = new yy.ElseIfNode($$[$0 - 4], $$[$0 - 3].flat());
        break;
      case 33:
        this.$ = new yy.ElseIfNode($$[$0 - 2], $$[$0 - 1].flat(), $$[$0]);
        break;
      case 34:
        this.$ = {
          text: $$[$0]
        };
        break;
      case 35:
        this.$ = {
          text: $$[$0 - 1],
          conditional: $$[$0]
        };
        break;
      case 36:
        this.$ = {
          ...$$[$0 - 1],
          hashtags: $$[$0]
        };
        break;
      case 38:
        this.$ = {
          ...$$[$0 - 2],
          hashtags: $$[$0 - 1]
        };
        break;
      case 40:
        this.$ = new yy.DialogShortcutNode($$[$0].text, undefined, this._$, $$[$0].hashtags, $$[$0].conditional);
        break;
      case 41:
        this.$ = new yy.DialogShortcutNode($$[$0 - 4].text, $$[$0 - 1].flat(), this._$, $$[$0 - 4].hashtags, $$[$0 - 4].conditional);
        break;
      case 42:
        this.$ = new yy.GenericCommandNode($$[$0 - 1], this._$);
        break;
      case 43:
      case 44:
        this.$ = new yy.JumpCommandNode($$[$0 - 1]);
        break;
      case 45:
        this.$ = new yy.StopCommandNode();
        break;
      case 47:
        this.$ = null;
        break;
      case 48:
        this.$ = new yy.SetVariableEqualToNode($$[$0 - 2].substring(1), $$[$0]);
        break;
      case 49:
        this.$ = null;
        yy.registerDeclaration($$[$0 - 2].substring(1), $$[$0]);
        break;
      case 50:
        this.$ = null;
        yy.registerDeclaration($$[$0 - 4].substring(1), $$[$0 - 2], $$[$0]);
        break;
      case 51:
      case 75:
      case 76:
        this.$ = $$[$0];
        break;
      case 54:
        this.$ = new yy.UnaryMinusExpressionNode($$[$0]);
        break;
      case 55:
        this.$ = new yy.ArithmeticExpressionAddNode($$[$0 - 2], $$[$0]);
        break;
      case 56:
        this.$ = new yy.ArithmeticExpressionMinusNode($$[$0 - 2], $$[$0]);
        break;
      case 57:
        this.$ = new yy.ArithmeticExpressionExponentNode($$[$0 - 2], $$[$0]);
        break;
      case 58:
        this.$ = new yy.ArithmeticExpressionMultiplyNode($$[$0 - 2], $$[$0]);
        break;
      case 59:
        this.$ = new yy.ArithmeticExpressionDivideNode($$[$0 - 2], $$[$0]);
        break;
      case 60:
        this.$ = new yy.ArithmeticExpressionModuloNode($$[$0 - 2], $$[$0]);
        break;
      case 61:
        this.$ = new yy.NegatedBooleanExpressionNode($$[$0]);
        break;
      case 62:
        this.$ = new yy.BooleanOrExpressionNode($$[$0 - 2], $$[$0]);
        break;
      case 63:
        this.$ = new yy.BooleanAndExpressionNode($$[$0 - 2], $$[$0]);
        break;
      case 64:
        this.$ = new yy.BooleanXorExpressionNode($$[$0 - 2], $$[$0]);
        break;
      case 65:
        this.$ = new yy.EqualToExpressionNode($$[$0 - 2], $$[$0]);
        break;
      case 66:
        this.$ = new yy.NotEqualToExpressionNode($$[$0 - 2], $$[$0]);
        break;
      case 67:
        this.$ = new yy.GreaterThanExpressionNode($$[$0 - 2], $$[$0]);
        break;
      case 68:
        this.$ = new yy.GreaterThanOrEqualToExpressionNode($$[$0 - 2], $$[$0]);
        break;
      case 69:
        this.$ = new yy.LessThanExpressionNode($$[$0 - 2], $$[$0]);
        break;
      case 70:
        this.$ = new yy.LessThanOrEqualToExpressionNode($$[$0 - 2], $$[$0]);
        break;
      case 71:
        this.$ = new yy.FunctionCallNode($$[$0 - 2], [], this._$);
        break;
      case 72:
        this.$ = new yy.FunctionCallNode($$[$0 - 3], $$[$0 - 1], this._$);
        break;
      case 73:
        this.$ = $$[$0 - 2].concat([$$[$0]]);
        break;
      case 77:
        this.$ = new yy.VariableNode($$[$0].substring(1));
        break;
      case 78:
      case 79:
        this.$ = new yy.BooleanLiteralNode($$[$0]);
        break;
      case 80:
        this.$ = new yy.NumericLiteralNode($$[$0]);
        break;
      case 81:
        this.$ = new yy.StringLiteralNode($$[$0]);
        break;
      case 82:
        this.$ = new yy.NullLiteralNode($$[$0]);
        break;
      case 83:
        this.$ = new yy.InlineExpressionNode($$[$0 - 1], this._$);
        break;
    }
  },
  table: [{
    3: 1,
    4: 2,
    6: 3,
    7: 4,
    8: $V0,
    10: 7,
    11: 8,
    12: 9,
    13: 10,
    14: 11,
    15: 12,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    22: 5,
    23: $V3,
    33: 16,
    34: $V4,
    77: $V5
  }, {
    1: [3]
  }, {
    5: [1, 21],
    6: 22,
    7: 23,
    8: $V0,
    10: 7,
    11: 8,
    12: 9,
    13: 10,
    14: 11,
    15: 12,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    22: 5,
    23: $V3,
    33: 16,
    34: $V4,
    77: $V5
  }, o($V6, [2, 2], {
    9: $V7
  }), o($V8, [2, 4], {
    16: 26,
    8: $V9,
    9: $Va,
    21: $Vb
  }), {
    9: [1, 29]
  }, {
    9: [1, 30]
  }, o([5, 8, 9, 21, 23, 34, 36], [2, 7], {
    17: 14,
    20: 15,
    10: 31,
    18: $V1,
    19: $V2,
    77: $V5
  }), o($Vc, [2, 8]), o($Vc, [2, 9]), o($Vc, [2, 10]), o($Vc, [2, 11]), o($Vc, [2, 12]), {
    10: 33,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    24: $Vd,
    37: $Ve,
    39: $Vf,
    40: 34,
    41: 35,
    42: $Vg,
    45: $Vh,
    77: $V5
  }, o($Vi, [2, 18]), o($Vi, [2, 19]), o($V8, [2, 40], {
    16: 41,
    8: [1, 42],
    9: [1, 40],
    21: $Vb
  }), o($Vi, [2, 16]), o($Vi, [2, 17]), {
    20: 49,
    25: 43,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    10: 58,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    77: $V5
  }, {
    1: [2, 1]
  }, o($V6, [2, 3], {
    9: $V7
  }), o($V8, [2, 5], {
    16: 26,
    8: $V9,
    9: $Va,
    21: $Vb
  }), o($Vt, [2, 26]), o($Vc, [2, 13]), o($Vc, [2, 14]), o($Vc, [2, 15]), o($Vt, [2, 21], {
    16: 59,
    21: $Vb
  }), {
    4: 60,
    6: 3,
    7: 4,
    8: $V0,
    10: 7,
    11: 8,
    12: 9,
    13: 10,
    14: 11,
    15: 12,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    22: 5,
    23: $V3,
    33: 16,
    34: $V4,
    77: $V5
  }, o($Vc, [2, 6]), o([5, 8, 9, 21, 23, 26, 34, 36], [2, 20], {
    17: 14,
    20: 15,
    10: 31,
    18: $V1,
    19: $V2,
    77: $V5
  }), {
    20: 49,
    25: 61,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    10: 31,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    26: [1, 62],
    77: $V5
  }, {
    26: [1, 63]
  }, {
    26: [1, 64]
  }, {
    20: 66,
    38: [1, 65],
    77: $V5
  }, {
    26: [1, 67]
  }, {
    43: [1, 68]
  }, {
    43: [1, 69]
  }, o($Vc, [2, 39], {
    35: [1, 70]
  }), o([5, 9, 18, 19, 21, 23, 34, 36, 77], [2, 36], {
    8: [1, 71]
  }), o($Vc, [2, 37]), {
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz,
    60: $VA,
    61: $VB,
    62: $VC,
    63: $VD,
    64: $VE,
    65: $VF,
    66: $VG,
    67: $VH,
    68: $VI,
    78: [1, 72]
  }, o($VJ, [2, 51]), o($VJ, [2, 52]), {
    20: 49,
    25: 88,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 89,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 90,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, o($VJ, [2, 75]), o($VJ, [2, 76]), o($VJ, [2, 77]), {
    50: [1, 91]
  }, o($VJ, [2, 78]), o($VJ, [2, 79]), o($VJ, [2, 80]), o($VJ, [2, 81]), o($VJ, [2, 82]), o([5, 8, 9, 21, 34, 36], [2, 34], {
    17: 14,
    20: 15,
    10: 31,
    22: 92,
    18: $V1,
    19: $V2,
    23: [1, 93],
    77: $V5
  }), o($Vc, [2, 22]), {
    6: 22,
    7: 23,
    8: $V0,
    10: 7,
    11: 8,
    12: 9,
    13: 10,
    14: 11,
    15: 12,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    22: 5,
    23: [1, 94],
    28: 95,
    29: 96,
    31: 97,
    33: 16,
    34: $V4,
    77: $V5
  }, {
    26: [1, 98],
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz,
    60: $VA,
    61: $VB,
    62: $VC,
    63: $VD,
    64: $VE,
    65: $VF,
    66: $VG,
    67: $VH,
    68: $VI
  }, o($Vc, [2, 42]), o($Vc, [2, 46]), o($Vc, [2, 47]), {
    26: [1, 99]
  }, {
    26: [1, 100]
  }, o($Vc, [2, 45]), {
    44: [1, 101]
  }, {
    44: [1, 102]
  }, {
    4: 103,
    6: 3,
    7: 4,
    8: $V0,
    10: 7,
    11: 8,
    12: 9,
    13: 10,
    14: 11,
    15: 12,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    22: 5,
    23: $V3,
    33: 16,
    34: $V4,
    77: $V5
  }, o($Vc, [2, 38]), o([5, 8, 9, 18, 19, 21, 23, 26, 34, 36, 46, 51, 53, 54, 55, 56, 57, 58, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 77, 78], [2, 83]), {
    20: 49,
    25: 104,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 105,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 106,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 107,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 108,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 109,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 110,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 111,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 112,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 113,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 114,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 115,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 116,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 117,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 118,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    51: [1, 119],
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz,
    60: $VA,
    61: $VB,
    62: $VC,
    63: $VD,
    64: $VE,
    65: $VF,
    66: $VG,
    67: $VH,
    68: $VI
  }, o($VK, [2, 54], {
    58: $Vz
  }), o($VL, [2, 61], {
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz,
    60: $VA,
    61: $VB,
    62: $VC,
    63: $VD,
    64: $VE,
    65: $VF,
    66: $VG,
    67: $VH,
    68: $VI
  }), {
    20: 49,
    25: 122,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    51: [1, 120],
    52: $Vm,
    59: $Vn,
    69: 121,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, o($Vc, [2, 35]), {
    24: $Vd
  }, {
    10: 33,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    24: $Vd,
    27: [1, 123],
    30: $VM,
    32: $VN,
    37: $Ve,
    39: $Vf,
    40: 34,
    41: 35,
    42: $Vg,
    45: $Vh,
    77: $V5
  }, o($Vt, [2, 25]), {
    4: 126,
    6: 3,
    7: 4,
    8: $V0,
    9: [1, 127],
    10: 7,
    11: 8,
    12: 9,
    13: 10,
    14: 11,
    15: 12,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    22: 5,
    23: $V3,
    33: 16,
    34: $V4,
    77: $V5
  }, {
    4: 128,
    6: 3,
    7: 4,
    8: $V0,
    9: [1, 129],
    10: 7,
    11: 8,
    12: 9,
    13: 10,
    14: 11,
    15: 12,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    22: 5,
    23: $V3,
    33: 16,
    34: $V4,
    77: $V5
  }, o($Vc, [2, 23]), o($Vc, [2, 43]), o($Vc, [2, 44]), {
    20: 49,
    25: 130,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    20: 49,
    25: 131,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    6: 22,
    7: 23,
    8: $V0,
    10: 7,
    11: 8,
    12: 9,
    13: 10,
    14: 11,
    15: 12,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    22: 5,
    23: $V3,
    33: 16,
    34: $V4,
    36: [1, 132],
    77: $V5
  }, o($VO, [2, 55], {
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz
  }), o($VO, [2, 56], {
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz
  }), o($VK, [2, 57], {
    58: $Vz
  }), o($VK, [2, 58], {
    58: $Vz
  }), o($VK, [2, 59], {
    58: $Vz
  }), o($VL, [2, 60], {
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz,
    60: $VA,
    61: $VB,
    62: $VC,
    63: $VD,
    64: $VE,
    65: $VF,
    66: $VG,
    67: $VH,
    68: $VI
  }), o([26, 46, 51, 60, 70, 78], [2, 62], {
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz,
    61: $VB,
    62: $VC,
    63: $VD,
    64: $VE,
    65: $VF,
    66: $VG,
    67: $VH,
    68: $VI
  }), o([26, 46, 51, 60, 61, 70, 78], [2, 63], {
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz,
    62: $VC,
    63: $VD,
    64: $VE,
    65: $VF,
    66: $VG,
    67: $VH,
    68: $VI
  }), o([26, 46, 51, 60, 61, 62, 70, 78], [2, 64], {
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz,
    63: $VD,
    64: $VE,
    65: $VF,
    66: $VG,
    67: $VH,
    68: $VI
  }), o($VP, [2, 65], {
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz
  }), o($VP, [2, 66], {
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz
  }), o($VP, [2, 67], {
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz
  }), o($VP, [2, 68], {
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz
  }), o($VP, [2, 69], {
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz
  }), o($VP, [2, 70], {
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz
  }), o($VJ, [2, 53]), o($VJ, [2, 71]), {
    51: [1, 133],
    70: [1, 134]
  }, o($VQ, [2, 74], {
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz,
    60: $VA,
    61: $VB,
    62: $VC,
    63: $VD,
    64: $VE,
    65: $VF,
    66: $VG,
    67: $VH,
    68: $VI
  }), {
    26: [1, 135]
  }, {
    26: [1, 136]
  }, {
    20: 49,
    25: 137,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, {
    6: 22,
    7: 23,
    8: $V0,
    10: 7,
    11: 8,
    12: 9,
    13: 10,
    14: 11,
    15: 12,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    22: 5,
    23: [1, 138],
    33: 16,
    34: $V4,
    77: $V5
  }, o($VR, [2, 28]), {
    6: 22,
    7: 23,
    8: $V0,
    10: 7,
    11: 8,
    12: 9,
    13: 10,
    14: 11,
    15: 12,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    22: 5,
    23: [1, 139],
    28: 140,
    29: 96,
    31: 97,
    33: 16,
    34: $V4,
    77: $V5
  }, o($VR, [2, 30]), {
    26: [2, 48],
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz,
    60: $VA,
    61: $VB,
    62: $VC,
    63: $VD,
    64: $VE,
    65: $VF,
    66: $VG,
    67: $VH,
    68: $VI
  }, {
    26: [2, 49],
    46: [1, 141],
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz,
    60: $VA,
    61: $VB,
    62: $VC,
    63: $VD,
    64: $VE,
    65: $VF,
    66: $VG,
    67: $VH,
    68: $VI
  }, o($Vc, [2, 41]), o($VJ, [2, 72]), {
    20: 49,
    25: 142,
    38: $Vj,
    43: $Vk,
    48: 44,
    49: 45,
    50: $Vl,
    52: $Vm,
    59: $Vn,
    71: 50,
    72: $Vo,
    73: $Vp,
    74: $Vq,
    75: $Vr,
    76: $Vs,
    77: $V5
  }, o($Vt, [2, 24]), o($VR, [2, 27]), {
    26: [1, 143],
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz,
    60: $VA,
    61: $VB,
    62: $VC,
    63: $VD,
    64: $VE,
    65: $VF,
    66: $VG,
    67: $VH,
    68: $VI
  }, {
    10: 33,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    24: $Vd,
    27: [1, 144],
    37: $Ve,
    39: $Vf,
    40: 34,
    41: 35,
    42: $Vg,
    45: $Vh,
    77: $V5
  }, {
    10: 33,
    17: 14,
    18: $V1,
    19: $V2,
    20: 15,
    24: $Vd,
    27: [1, 145],
    30: $VM,
    32: $VN,
    37: $Ve,
    39: $Vf,
    40: 34,
    41: 35,
    42: $Vg,
    45: $Vh,
    77: $V5
  }, o($Vt, [2, 33]), {
    47: [1, 146]
  }, o($VQ, [2, 73], {
    53: $Vu,
    54: $Vv,
    55: $Vw,
    56: $Vx,
    57: $Vy,
    58: $Vz,
    60: $VA,
    61: $VB,
    62: $VC,
    63: $VD,
    64: $VE,
    65: $VF,
    66: $VG,
    67: $VH,
    68: $VI
  }), o($VR, [2, 29]), {
    26: [1, 147]
  }, {
    26: [1, 148]
  }, {
    26: [2, 50]
  }, o($Vt, [2, 31]), o($Vt, [2, 32])],
  defaultActions: {
    21: [2, 1],
    146: [2, 50]
  },
  parseError: function parseError(str, hash) {
    if (hash.recoverable) {
      this.trace(str);
    } else {
      var error = new Error(str);
      error.hash = hash;
      throw error;
    }
  },
  parse: function parse(input) {
    var self = this,
      stack = [0],
      tstack = [],
      vstack = [null],
      lstack = [],
      table = this.table,
      yytext = '',
      yylineno = 0,
      yyleng = 0,
      recovering = 0,
      TERROR = 2,
      EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = {
      yy: {}
    };
    for (var k in this.yy) {
      if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
        sharedState.yy[k] = this.yy[k];
      }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
      lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
      this.parseError = sharedState.yy.parseError;
    } else {
      this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
      stack.length = stack.length - 2 * n;
      vstack.length = vstack.length - n;
      lstack.length = lstack.length - n;
    }
    _token_stack: var lex = function () {
      var token;
      token = lexer.lex() || EOF;
      if (typeof token !== 'number') {
        token = self.symbols_[token] || token;
      }
      return token;
    };
    var symbol,
      preErrorSymbol,
      state,
      action,
      a,
      r,
      yyval = {},
      p,
      len,
      newState,
      expected;
    while (true) {
      state = stack[stack.length - 1];
      if (this.defaultActions[state]) {
        action = this.defaultActions[state];
      } else {
        if (symbol === null || typeof symbol == 'undefined') {
          symbol = lex();
        }
        action = table[state] && table[state][symbol];
      }
      if (typeof action === 'undefined' || !action.length || !action[0]) {
        var errStr = '';
        expected = [];
        for (p in table[state]) {
          if (this.terminals_[p] && p > TERROR) {
            expected.push('\'' + this.terminals_[p] + '\'');
          }
        }
        if (lexer.showPosition) {
          errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
        } else {
          errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
        }
        this.parseError(errStr, {
          text: lexer.match,
          token: this.terminals_[symbol] || symbol,
          line: lexer.yylineno,
          loc: yyloc,
          expected: expected
        });
      }
      if (action[0] instanceof Array && action.length > 1) {
        throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
      }
      switch (action[0]) {
        case 1:
          stack.push(symbol);
          vstack.push(lexer.yytext);
          lstack.push(lexer.yylloc);
          stack.push(action[1]);
          symbol = null;
          if (!preErrorSymbol) {
            yyleng = lexer.yyleng;
            yytext = lexer.yytext;
            yylineno = lexer.yylineno;
            yyloc = lexer.yylloc;
            if (recovering > 0) {
              recovering--;
            }
          } else {
            symbol = preErrorSymbol;
            preErrorSymbol = null;
          }
          break;
        case 2:
          len = this.productions_[action[1]][1];
          yyval.$ = vstack[vstack.length - len];
          yyval._$ = {
            first_line: lstack[lstack.length - (len || 1)].first_line,
            last_line: lstack[lstack.length - 1].last_line,
            first_column: lstack[lstack.length - (len || 1)].first_column,
            last_column: lstack[lstack.length - 1].last_column
          };
          if (ranges) {
            yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
          }
          r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));
          if (typeof r !== 'undefined') {
            return r;
          }
          if (len) {
            stack = stack.slice(0, -1 * len * 2);
            vstack = vstack.slice(0, -1 * len);
            lstack = lstack.slice(0, -1 * len);
          }
          stack.push(this.productions_[action[1]][0]);
          vstack.push(yyval.$);
          lstack.push(yyval._$);
          newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
          stack.push(newState);
          break;
        case 3:
          return true;
      }
    }
    return true;
  }
};
function Parser() {
  this.yy = {};
}
;
Parser.prototype = parser;
parser.Parser = Parser;

/***/ }),

/***/ 950:
/***/ ((module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
class Text {}
class Shortcut {}
class Conditional {}
class Assignment {}
class Literal {}
class Expression {}
class FunctionCall {}
class Command {}
var _default = exports["default"] = {
  types: {
    Text,
    Shortcut,
    Conditional,
    Assignment,
    Literal,
    Expression,
    FunctionCall,
    Command
  },
  // /////////////// Dialog Nodes

  DialogShortcutNode: class extends Shortcut {
    constructor(text, content, lineNo) {
      let hashtags = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
      let conditionalExpression = arguments.length > 4 ? arguments[4] : undefined;
      super();
      this.type = 'DialogShortcutNode';
      this.text = text;
      this.content = content;
      this.lineNum = lineNo.first_line;
      this.hashtags = hashtags;
      this.conditionalExpression = conditionalExpression;
    }
  },
  // /////////////// Conditional Nodes
  IfNode: class extends Conditional {
    constructor(expression, statement) {
      super();
      this.type = 'IfNode';
      this.expression = expression;
      this.statement = statement;
    }
  },
  IfElseNode: class extends Conditional {
    constructor(expression, statement, elseStatement) {
      super();
      this.type = 'IfElseNode';
      this.expression = expression;
      this.statement = statement;
      this.elseStatement = elseStatement;
    }
  },
  ElseNode: class extends Conditional {
    constructor(statement) {
      super();
      this.type = 'ElseNode';
      this.statement = statement;
    }
  },
  ElseIfNode: class extends Conditional {
    constructor(expression, statement, elseStatement) {
      super();
      this.type = 'ElseIfNode';
      this.expression = expression;
      this.statement = statement;
      this.elseStatement = elseStatement;
    }
  },
  // /////////////// Command Nodes
  GenericCommandNode: class extends Command {
    constructor(command, lineNo) {
      let hashtags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      super();
      this.type = 'GenericCommandNode';
      this.command = command;
      this.hashtags = hashtags;
      this.lineNum = lineNo.first_line;
    }
  },
  JumpCommandNode: class extends Command {
    constructor(destination) {
      super();
      this.type = 'JumpCommandNode';
      this.destination = destination;
    }
  },
  StopCommandNode: class extends Command {
    constructor() {
      super();
      this.type = 'StopCommandNode';
    }
  },
  // /////////////// Contents Nodes
  TextNode: class extends Text {
    constructor(text, lineNo) {
      let hashtags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      super();
      this.type = 'TextNode';
      this.text = text;
      this.lineNum = lineNo.first_line;
      this.hashtags = hashtags;
    }
  },
  EscapedCharacterNode: class extends Text {
    constructor(text, lineNo) {
      let hashtags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      super();
      this.type = 'EscapedCharacterNode';
      this.text = text;
      this.lineNum = lineNo.first_line;
      this.hashtags = hashtags;
    }
  },
  // /////////////// Literal Nodes
  NumericLiteralNode: class extends Literal {
    constructor(numericLiteral) {
      super();
      this.type = 'NumericLiteralNode';
      this.numericLiteral = numericLiteral;
    }
  },
  StringLiteralNode: class extends Literal {
    constructor(stringLiteral) {
      super();
      this.type = 'StringLiteralNode';
      this.stringLiteral = stringLiteral;
    }
  },
  BooleanLiteralNode: class extends Literal {
    constructor(booleanLiteral) {
      super();
      this.type = 'BooleanLiteralNode';
      this.booleanLiteral = booleanLiteral;
    }
  },
  VariableNode: class extends Literal {
    constructor(variableName) {
      super();
      this.type = 'VariableNode';
      this.variableName = variableName;
    }
  },
  // /////////////// Arithmetic Expression Nodes
  UnaryMinusExpressionNode: class extends Expression {
    constructor(expression) {
      super();
      this.type = 'UnaryMinusExpressionNode';
      this.expression = expression;
    }
  },
  ArithmeticExpressionAddNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'ArithmeticExpressionAddNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },
  ArithmeticExpressionMinusNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'ArithmeticExpressionMinusNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },
  ArithmeticExpressionMultiplyNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'ArithmeticExpressionMultiplyNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },
  ArithmeticExpressionExponentNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'ArithmeticExpressionExponentNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },
  ArithmeticExpressionDivideNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'ArithmeticExpressionDivideNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },
  ArithmeticExpressionModuloNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'ArithmeticExpressionModuloNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },
  // /////////////// Boolean Expression Nodes

  NegatedBooleanExpressionNode: class extends Expression {
    constructor(expression) {
      super();
      this.type = 'NegatedBooleanExpressionNode';
      this.expression = expression;
    }
  },
  BooleanOrExpressionNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'BooleanOrExpressionNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },
  BooleanAndExpressionNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'BooleanAndExpressionNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },
  BooleanXorExpressionNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'BooleanXorExpressionNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },
  EqualToExpressionNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'EqualToExpressionNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },
  NotEqualToExpressionNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'NotEqualToExpressionNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },
  GreaterThanExpressionNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'GreaterThanExpressionNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },
  GreaterThanOrEqualToExpressionNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'GreaterThanOrEqualToExpressionNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },
  LessThanExpressionNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'LessThanExpressionNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },
  LessThanOrEqualToExpressionNode: class extends Expression {
    constructor(expression1, expression2) {
      super();
      this.type = 'LessThanOrEqualToExpressionNode';
      this.expression1 = expression1;
      this.expression2 = expression2;
    }
  },
  // /////////////// Assignment Expression Nodes

  SetVariableEqualToNode: class extends Assignment {
    constructor(variableName, expression) {
      super();
      this.type = 'SetVariableEqualToNode';
      this.variableName = variableName;
      this.expression = expression;
    }
  },
  // /////////////// Function Nodes

  FunctionCallNode: class extends FunctionCall {
    constructor(functionName, args, lineNo) {
      let hashtags = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
      super();
      this.type = 'FunctionCallNode';
      this.functionName = functionName;
      this.args = args;
      this.lineNum = lineNo.first_line;
      this.hashtags = hashtags;
    }
  },
  // /////////////// Inline Expression
  InlineExpressionNode: class extends Expression {
    constructor(expression, lineNo) {
      let hashtags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      super();
      this.type = 'InlineExpressionNode';
      this.expression = expression;
      this.lineNum = lineNo.first_line;
      this.hashtags = hashtags;
    }
  }
};
module.exports = exports.default;

/***/ }),

/***/ 476:
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _nodes = _interopRequireDefault(__webpack_require__(950));
var _lexer = _interopRequireDefault(__webpack_require__(160));
var _compiledParser = __webpack_require__(358);
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
_compiledParser.parser.lexer = new _lexer.default();
_compiledParser.parser.yy = _nodes.default;
_compiledParser.parser.yy.declarations = {};
_compiledParser.parser.yy.parseError = function parseError(e) {
  throw e;
};
_compiledParser.parser.yy.registerDeclaration = function registerDeclaration(variableName, expression, explicitType) {
  if (!this.areDeclarationsHandled) {
    if (this.declarations[variableName]) {
      throw new Error(`Duplicate declaration found for variable: ${variableName}`);
    }
    this.declarations[variableName] = {
      variableName,
      expression,
      explicitType
    };
  }
};
var _default = exports["default"] = _compiledParser.parser;
module.exports = exports.default;

/***/ }),

/***/ 377:
/***/ ((module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
class Result {}
class TextResult extends Result {
  /**
   * Create a text display result
   * @param {string} [text] text to be displayed
   * @param {string[]} [hashtags] the hashtags for the line
   * @param {object} [metadata] the parent yarn data
   */
  constructor(text, hashtags, metadata) {
    super();
    this.text = text;
    this.hashtags = hashtags;
    this.metadata = metadata;
  }
}
class CommandResult extends Result {
  /**
   * Return a command string
   * @param {string} [command] the command text
   * @param {string[]} [hashtags] the hashtags for the line
   * @param {object} [metadata] the parent yarn data
   */
  constructor(command, hashtags, metadata) {
    super();
    this.command = command;
    this.hashtags = hashtags;
    this.metadata = metadata;
  }
}
class OptionResult extends Result {
  /**
   * Strip down Conditional option for presentation
   * @param {string} [text] option text to display
   * @param {boolean} [isAvailable] whether option is available
   * @param {string[]} [hashtags] the hashtags for the line
   * @param {object} [metadata] the parent yarn data
   */
  constructor(text) {
    let isAvailable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let hashtags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    let metadata = arguments.length > 3 ? arguments[3] : undefined;
    super();
    this.text = text;
    this.isAvailable = isAvailable;
    this.hashtags = hashtags;
    this.metadata = metadata;
  }
}
class OptionsResult extends Result {
  /**
   * Create a selectable list of options from the given list of text
   * @param {Node[]} [options] list of the text of options to be shown
   * @param {object} [metadata] the parent yarn data
   */
  constructor(options, metadata) {
    super();
    this.options = options.map(s => {
      return new OptionResult(s.text, s.isAvailable, s.hashtags);
    });
    this.metadata = metadata;
  }
  select() {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
    if (index < 0 || index >= this.options.length) {
      throw new Error(`Cannot select option #${index}, there are ${this.options.length} options`);
    }
    this.selected = index;
  }
}
var _default = exports["default"] = {
  Result,
  TextResult,
  CommandResult,
  OptionsResult
};
module.exports = exports.default;

/***/ }),

/***/ 333:
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _parser = _interopRequireDefault(__webpack_require__(476));
var _results = _interopRequireDefault(__webpack_require__(377));
var _defaultVariableStorage = _interopRequireDefault(__webpack_require__(163));
var _convertYarnToJs = _interopRequireDefault(__webpack_require__(897));
var _nodes2 = _interopRequireDefault(__webpack_require__(950));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const nodeTypes = _nodes2.default.types;
class Runner {
  constructor() {
    this.noEscape = false;
    this.lookahead = false;
    this.yarnNodes = {};
    this.variables = new _defaultVariableStorage.default();
    this.functions = {};
  }

  /**
   * Loads the yarn node data into this.nodes
   * @param dialogue {any[]} yarn dialogue as string or array
   */
  load(dialogue) {
    if (!dialogue) {
      throw new Error('No dialogue supplied');
    }
    let nodes;
    if (typeof dialogue === 'string') {
      nodes = (0, _convertYarnToJs.default)(dialogue);
    } else {
      nodes = dialogue;
    }
    nodes.forEach(node => {
      if (!node.title) {
        throw new Error(`Node needs a title: ${JSON.stringify(node)}`);
      } else if (node.title.split('.').length > 1) {
        throw new Error(`Node title cannot contain a dot: ${node.title}`);
      }
      if (!node.body) {
        throw new Error(`Node needs a body: ${JSON.stringify(node)}`);
      }
      if (this.yarnNodes[node.title]) {
        throw new Error(`Duplicate node title: ${node.title}`);
      }
      this.yarnNodes[node.title] = node;
    });
    _parser.default.yy.areDeclarationsHandled = false;
    _parser.default.yy.declarations = {};
    this.handleDeclarations(nodes);
    _parser.default.yy.areDeclarationsHandled = true;
  }

  /**
   * Set a new variable storage object
   * This must simply contain a 'get(name)' and 'set(name, value)' function
   *
   * Calling this function will clear any existing variable's values
   */
  setVariableStorage(storage) {
    if (typeof storage.set !== 'function' || typeof storage.get !== 'function') {
      throw new Error('Variable Storage object must contain both a "set" and "get" function');
    }
    this.variables = storage;
  }

  /**
   * Scans for <<declare>> commands and sets initial variable values
   * @param {any[]} yarn dialogue as string or array
   */
  handleDeclarations(nodes) {
    const exampleValues = {
      Number: 0,
      String: '',
      Boolean: false
    };
    const allLines = nodes.reduce((acc, node) => {
      const nodeLines = node.body.split(/\r?\n+/);
      return [...acc, ...nodeLines];
    }, []);
    const declareLines = allLines.reduce((acc, line) => {
      const match = line.match(/^<<declare .+>>/);
      return match ? [...acc, line] : acc;
    }, []);
    if (declareLines.length) {
      _parser.default.parse(declareLines.join('\n'));
    }
    Object.entries(_parser.default.yy.declarations).forEach(_ref => {
      let [variableName, {
        expression,
        explicitType
      }] = _ref;
      const value = this.evaluateExpressionOrLiteral(expression);
      if (explicitType && typeof value !== typeof exampleValues[explicitType]) {
        throw new Error(`Cannot declare value ${value} as type ${explicitType} for variable ${variableName}`);
      }
      if (!this.variables.get(variableName)) {
        this.variables.set(variableName, value);
      }
    });
  }
  registerFunction(name, func) {
    if (typeof func !== 'function') {
      throw new Error('Registered function must be...well...a function');
    }
    this.functions[name] = func;
  }

  /**
   * Generator to run a dialogue, starting at a specified node.
   * @param {string} [nodeName] - The name of the yarn node to begin at
   */
  *run(nodeName) {
    const {
      parserNodes,
      metadata
    } = this.getParserNodes(nodeName);
    return yield* this.evalNodes(parserNodes, metadata);
  }
  getParserNodes(nodeName) {
    const yarnNode = this.yarnNodes[nodeName];
    if (yarnNode === undefined) {
      throw new Error(`Node "${nodeName}" does not exist`);
    }
    // Parse the entire node
    const parserNodes = Array.from(_parser.default.parse(yarnNode.body));
    const metadata = {
      ...yarnNode
    };
    delete metadata.body;
    return {
      parserNodes,
      metadata
    };
  }

  /**
   * Evaluate a list of parser nodes, yielding the ones that need to be seen by
   * the user. Calls itself recursively if that is required by nested nodes
   * @param {Node[]} nodes
   * @param {YarnNode[]} metadata
   */
  evalNodes(nodes, metadata) {
    var _this = this;
    let shortcutNodes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    let textRunNodes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    return function* () {
      const filteredNodes = nodes.filter(Boolean);

      // Yield the individual user-visible results
      let result;
      // Need unique copies to make a special duplicate generator
      // for lookahead, rewind, or other funky stuff
      const _textRunNodes = [...textRunNodes];
      const _shortcutNodes = [...shortcutNodes];
      const _nodes = [...nodes];
      const getGeneratorHere = () => {
        return _this.evalNodes(_nodes, metadata, _shortcutNodes, _textRunNodes);
      };
      const node = filteredNodes[0];
      const nextNode = filteredNodes[1];

      // Text and the output of Inline Expressions
      // are combined to deliver a TextNode.
      if (node instanceof nodeTypes.Text || node instanceof nodeTypes.Expression) {
        textRunNodes.push(node);
        if (nextNode && node.lineNum === nextNode.lineNum && (nextNode instanceof nodeTypes.Text || nextNode instanceof nodeTypes.Expression)) {
          // Same line, with another text equivalent to add to the
          // text run further on in the loop, so don't yield.
        } else {
          const text = textRunNodes.reduce((acc, node) => acc + _this.evaluateExpressionOrLiteral(node).toString(), '');
          textRunNodes = [];
          const textResult = Object.assign(new _results.default.TextResult(text, node.hashtags, metadata), {
            getGeneratorHere
          });
          if (filteredNodes.length === 1) {
            return textResult;
          } else {
            yield textResult;
          }
        }
      } else if (node instanceof nodeTypes.Shortcut) {
        // Need to accumulate all adjacent selectables into one list
        shortcutNodes.push(node);
        if (!(nextNode instanceof nodeTypes.Shortcut)) {
          // Last shortcut in the series, so yield the shortcuts.
          return yield* _this.handleShortcuts(shortcutNodes, metadata, filteredNodes.slice(1), getGeneratorHere);
        }
      } else if (node instanceof nodeTypes.Assignment) {
        if (!_this.lookahead) {
          _this.evaluateAssignment(node);
        }
      } else if (node instanceof nodeTypes.Conditional) {
        // Get the results of the conditional
        const evalResult = _this.evaluateConditional(node);
        if (evalResult) {
          // Run the results if applicable
          return yield* _this.evalNodes([...evalResult, ...filteredNodes.slice(1)], metadata, shortcutNodes, textRunNodes);
        }
      } else if (node instanceof _nodes2.default.JumpCommandNode) {
        const destination = node.destination instanceof _nodes2.default.InlineExpressionNode ? _this.evaluateExpressionOrLiteral(node.destination) : node.destination;
        const {
          parserNodes,
          metadata
        } = _this.getParserNodes(destination);
        return yield* _this.evalNodes(parserNodes, metadata);
      } else if (node instanceof _nodes2.default.StopCommandNode) {
        return;
      } else {
        const command = _this.evaluateExpressionOrLiteral(node.command);
        const commandResult = Object.assign(new _results.default.CommandResult(command, node.hashtags, metadata), {
          getGeneratorHere
        });
        if (filteredNodes.length === 1) {
          return commandResult;
        } else {
          yield commandResult;
        }
      }
      if (filteredNodes.length > 1) {
        return yield* _this.evalNodes(filteredNodes.slice(1), metadata, shortcutNodes, textRunNodes);
      }
    }();
  }

  /**
   * yield a shortcut result then handle the subsequent selection
   * @param {any[]} selections
   */
  *handleShortcuts(selections, metadata, restNodes, getGeneratorHere) {
    // Multiple options to choose from (or just a single shortcut)
    // Tag any conditional dialog options that result to false,
    // the consuming app does the actual filtering or whatever
    const transformedSelections = selections.map(s => {
      let isAvailable = true;
      if (s.conditionalExpression && !this.evaluateExpressionOrLiteral(s.conditionalExpression)) {
        isAvailable = false;
      }
      const text = this.evaluateExpressionOrLiteral(s.text);
      return Object.assign(s, {
        isAvailable,
        text
      });
    });
    const optionsResult = Object.assign(new _results.default.OptionsResult(transformedSelections, metadata), {
      getGeneratorHere
    });
    yield optionsResult;
    if (typeof optionsResult.selected !== 'number') {
      throw new Error('No option selected before resuming dialogue');
    }
    const selectedOption = transformedSelections[optionsResult.selected];
    if (selectedOption.content) {
      // Recursively go through the nodes nested within
      return yield* this.evalNodes([...selectedOption.content, ...restNodes], metadata);
    } else {
      if (restNodes.length) {
        return yield* this.evalNodes(restNodes, metadata);
      }
    }
  }

  /**
   * Evaluates the given assignment node
   */
  evaluateAssignment(node) {
    const result = this.evaluateExpressionOrLiteral(node.expression);
    const oldValue = this.variables.get(node.variableName);
    if (oldValue && typeof oldValue !== typeof result) {
      throw new Error(`Variable ${node.variableName} is already type ${typeof oldValue}; cannot set equal to ${result} of type ${typeof result}`);
    }
    this.variables.set(node.variableName, result);
  }

  /**
   * Evaluates the given conditional node
   * Returns the statements to be run as a result of it (if any)
   */
  evaluateConditional(node) {
    if (node.type === 'IfNode') {
      if (this.evaluateExpressionOrLiteral(node.expression)) {
        return node.statement;
      }
    } else if (node.type === 'IfElseNode' || node.type === 'ElseIfNode') {
      if (this.evaluateExpressionOrLiteral(node.expression)) {
        return node.statement;
      }
      if (node.elseStatement) {
        return this.evaluateConditional(node.elseStatement);
      }
    } else {
      // ElseNode
      return node.statement;
    }
    return null;
  }
  evaluateFunctionCall(node) {
    if (this.functions[node.functionName]) {
      return this.functions[node.functionName](...node.args.map(this.evaluateExpressionOrLiteral, this));
    }
    throw new Error(`Function "${node.functionName}" not found`);
  }

  /**
   * Evaluates an expression or literal down to its final value
   */
  evaluateExpressionOrLiteral(node) {
    // A combined array of text and inline expressions to be treated as one.
    // Could probably be cleaned up by introducing a new node type.
    if (Array.isArray(node)) {
      return node.reduce((acc, n) => {
        return acc + this.evaluateExpressionOrLiteral(n).toString();
      }, '');
    }
    if (typeof node !== 'object') {
      return node;
    }
    const nodeHandlers = {
      UnaryMinusExpressionNode: a => {
        return -a;
      },
      ArithmeticExpressionAddNode: (a, b) => {
        return a + b;
      },
      ArithmeticExpressionMinusNode: (a, b) => {
        return a - b;
      },
      ArithmeticExpressionExponentNode: (a, b) => {
        return a ** b;
      },
      ArithmeticExpressionMultiplyNode: (a, b) => {
        return a * b;
      },
      ArithmeticExpressionDivideNode: (a, b) => {
        return a / b;
      },
      ArithmeticExpressionModuloNode: (a, b) => {
        return a % b;
      },
      NegatedBooleanExpressionNode: a => {
        return !a;
      },
      BooleanOrExpressionNode: (a, b) => {
        return a || b;
      },
      BooleanAndExpressionNode: (a, b) => {
        return a && b;
      },
      BooleanXorExpressionNode: (a, b) => {
        return !!(a ^ b);
      },
      // eslint-disable-line no-bitwise
      EqualToExpressionNode: (a, b) => {
        return a === b;
      },
      NotEqualToExpressionNode: (a, b) => {
        return a !== b;
      },
      GreaterThanExpressionNode: (a, b) => {
        return a > b;
      },
      GreaterThanOrEqualToExpressionNode: (a, b) => {
        return a >= b;
      },
      LessThanExpressionNode: (a, b) => {
        return a < b;
      },
      LessThanOrEqualToExpressionNode: (a, b) => {
        return a <= b;
      },
      TextNode: a => {
        return a.text;
      },
      EscapedCharacterNode: a => {
        return this.noEscape ? a.text : a.text.slice(1);
      },
      NumericLiteralNode: a => {
        return parseFloat(a.numericLiteral);
      },
      StringLiteralNode: a => {
        return `${a.stringLiteral}`;
      },
      BooleanLiteralNode: a => {
        return a.booleanLiteral === 'true';
      },
      VariableNode: a => {
        const value = this.variables.get(a.variableName);
        if (value === undefined && !this.lookahead) {
          throw new Error(`Attempted to access undefined variable "${a.variableName}"`);
        }
        return value;
      },
      FunctionCallNode: a => {
        return this.evaluateFunctionCall(a);
      },
      InlineExpressionNode: a => {
        return a;
      }
    };
    const handler = nodeHandlers[node.type];
    if (!handler) {
      throw new Error(`node type not recognized: ${node.type}`);
    }
    return handler(node instanceof nodeTypes.Expression ? this.evaluateExpressionOrLiteral(node.expression || node.expression1) : node, node.expression2 ? this.evaluateExpressionOrLiteral(node.expression2) : node);
  }
}
var _default = exports["default"] = {
  Runner,
  TextResult: _results.default.TextResult,
  CommandResult: _results.default.CommandResult,
  OptionsResult: _results.default.OptionsResult
};
module.exports = exports.default;

/***/ }),

/***/ 954:
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _yarnBound = _interopRequireDefault(__webpack_require__(523));
var _index = _interopRequireDefault(__webpack_require__(947));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const {
  OptionsResult,
  TextResult,
  CommandResult
} = _index.default;
_yarnBound.default.OptionsResult = OptionsResult;
_yarnBound.default.TextResult = TextResult;
_yarnBound.default.CommandResult = CommandResult;
var _default = exports["default"] = _yarnBound.default;
module.exports = exports.default;

/***/ }),

/***/ 384:
/***/ ((module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = parseLine;
// mutates node, processing [markup /] and `character:`
function parseLine(node, locale) {
  node.markup = [];
  parseCharacterLabel(node);
  parseMarkup(node, locale);
  node.text = node.text.replace(/(?:\\(.))/g, '$1');
}
function parseCharacterLabel(node) {
  const match = node.text.match(/^(\S+):\s+/);
  if (match) {
    node.text = node.text.replace(match[0], '');
    node.markup.push({
      name: 'character',
      properties: {
        name: match[1]
      }
    });
  }
}
function parseMarkup(node, locale) {
  const attributes = [];
  let noMarkup = false;
  const attributeRegex = /(^|[^\\])\[(.*?[^\\])\](.|$)/;
  let textRemaining = node.text;
  let resultText = '';
  let match = textRemaining.match(attributeRegex);
  while (match) {
    const {
      index
    } = match;
    const [wholeMatch, charBefore, contents, charAfter] = match;
    const hasLeadingSpace = /\s/.test(charBefore);
    const hasTrailingSpace = /\s/.test(charAfter);
    const attribute = {
      ...parseAttributeContents(contents, locale),
      position: resultText.length + index + charBefore.length
    };
    if (!noMarkup || attribute.name === 'nomarkup') {
      const isReplacementTag = attribute.name === 'select' || attribute.name === 'plural' || attribute.name === 'ordinal';
      const shouldTrim = !isReplacementTag && attribute.isSelfClosing && attribute.properties && attribute.properties.trimwhitespace !== false && (index === 0 && hasTrailingSpace || hasLeadingSpace && hasTrailingSpace);
      if (attribute.properties) {
        delete attribute.properties.trimwhitespace;
      }
      const replacement = charBefore + (attribute.replacement || '') + (shouldTrim ? charAfter.slice(1) : charAfter);
      textRemaining = textRemaining.replace(attributeRegex, replacement);
      // inner slices are because charAfter could be an opening square bracket
      resultText += textRemaining.slice(0, index + replacement.slice(1).length);
      textRemaining = textRemaining.slice(index + replacement.slice(1).length);
      if (!isReplacementTag && attribute.name !== 'nomarkup') {
        attributes.push(attribute);
      }
    } else {
      // -1s are because charAfter could be an opening square bracket
      resultText += textRemaining.slice(0, index + wholeMatch.length - 1);
      textRemaining = textRemaining.slice(index + wholeMatch.length - 1);
    }
    if (attribute.name === 'nomarkup') {
      noMarkup = !attribute.isClosing;
    }
    match = textRemaining.match(attributeRegex);
  }
  node.text = resultText + textRemaining;

  // Escaped bracket support might need some TLC.
  const escapedCharacterRegex = /\\(\[|\])/;
  match = node.text.match(escapedCharacterRegex);
  textRemaining = node.text;
  resultText = '';
  while (match) {
    const char = match[1];
    attributes.forEach(attr => {
      if (attr.position > resultText.length + match.index) {
        attr.position -= 1;
      }
    });
    textRemaining = textRemaining.replace(escapedCharacterRegex, char);
    resultText += textRemaining.slice(0, match.index + 1);
    textRemaining = textRemaining.slice(match.index + 1);
    match = textRemaining.match(escapedCharacterRegex);
  }
  node.text = resultText + textRemaining;
  const openTagStacks = {};
  attributes.forEach(attr => {
    if (!openTagStacks[attr.name]) {
      openTagStacks[attr.name] = [];
    }
    if (attr.isClosing && !openTagStacks[attr.name].length) {
      throw new Error(`Encountered closing ${attr.name} tag before opening tag`);
    } else if (attr.isClosing) {
      const openTag = openTagStacks[attr.name].pop();
      node.markup.push({
        name: openTag.name,
        position: openTag.position,
        properties: openTag.properties,
        length: attr.position - openTag.position
      });
    } else if (attr.isSelfClosing) {
      node.markup.push({
        name: attr.name,
        position: attr.position,
        properties: attr.properties,
        length: 0
      });
    } else if (attr.isCloseAll) {
      const openTags = Object.values(openTagStacks).flat();
      while (openTags.length) {
        const openTag = openTags.pop();
        node.markup.push({
          name: openTag.name,
          position: openTag.position,
          properties: openTag.properties,
          length: attr.position - openTag.position
        });
      }
    } else {
      openTagStacks[attr.name].push({
        name: attr.name,
        position: attr.position,
        properties: attr.properties
      });
    }
  });
}
function parseAttributeContents(contents, locale) {
  const nameMatch = contents.match(/^\/?([^\s=/]+)(\/|\s|$)/);
  const isClosing = contents[0] === '/';
  const isSelfClosing = contents[contents.length - 1] === '/';
  const isCloseAll = contents === '/';
  if (isCloseAll) {
    return {
      name: 'closeall',
      isCloseAll: true
    };
  } else if (isClosing) {
    return {
      name: nameMatch[1],
      isClosing: true
    };
  } else {
    const propertyAssignmentsText = nameMatch ? contents.replace(nameMatch[0], '') : contents;
    const propertyAssignments = propertyAssignmentsText.match(/(\S+?".*?"|[^\s/]+)/g);
    let properties = {};
    if (propertyAssignments) {
      properties = propertyAssignments.reduce((acc, propAss) => {
        return {
          ...acc,
          ...parsePropertyAssignment(propAss)
        };
      }, {});
    }
    const name = nameMatch && nameMatch[1] || Object.keys(properties)[0];
    let replacement;
    if (name === 'select') {
      replacement = processSelectAttribute(properties);
    } else if (name === 'plural') {
      replacement = processPluralAttribute(properties, locale);
    } else if (name === 'ordinal') {
      replacement = processOrdinalAttribute(properties, locale);
    }
    return {
      name,
      properties,
      isSelfClosing,
      replacement
    };
  }
}
function parsePropertyAssignment(propAss) {
  const [propName, ...rest] = propAss.split('=');
  const stringValue = rest.join('='); // just in case string value had a = in it
  if (!propName || !stringValue) {
    throw new Error(`Invalid markup property assignment: ${propAss}`);
  }
  let value;
  if (stringValue === 'true' || stringValue === 'false') {
    value = stringValue === 'true';
  } else if (/^-?\d*\.?\d+$/.test(stringValue)) {
    value = +stringValue;
  } else if (stringValue[0] === '"' && stringValue[stringValue.length - 1] === '"') {
    value = stringValue.slice(1, -1);
  } else {
    value = stringValue;
  }
  return {
    [propName]: value
  };
}
function processSelectAttribute(properties) {
  return properties[properties.value];
}
function processPluralAttribute(properties, locale) {
  return properties[new Intl.PluralRules(locale).select(properties.value)].replace(/%/g, properties.value);
}
function processOrdinalAttribute(properties, locale) {
  return properties[new Intl.PluralRules(locale, {
    type: 'ordinal'
  }).select(properties.value)].replace(/%/g, properties.value);
}
module.exports = exports.default;

/***/ }),

/***/ 523:
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _index = _interopRequireDefault(__webpack_require__(947));
var _lineParser = _interopRequireDefault(__webpack_require__(384));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class YarnBound {
  constructor(_ref) {
    let {
      dialogue,
      variableStorage,
      functions,
      handleCommand,
      combineTextAndOptionsResults,
      locale,
      pauseCommand = 'pause',
      startAt = 'Start'
    } = _ref;
    this.handleCommand = handleCommand;
    this.pauseCommand = pauseCommand;
    this.combineTextAndOptionsResults = combineTextAndOptionsResults;
    this.bondage = _index.default;
    this.currentResult = null;
    this.history = [];
    this.locale = locale;
    this.runner = new _index.default.Runner();
    this.runner.noEscape = true;
    this.runner.load(dialogue);
    if (variableStorage) {
      variableStorage.display = variableStorage.display || variableStorage.get;
      this.runner.setVariableStorage(variableStorage);
    }
    if (functions) {
      Object.entries(functions).forEach(entry => {
        this.registerFunction(...entry);
      });
    }
    this.jump(startAt);
  }
  jump(startAt) {
    this.generator = this.runner.run(startAt);
    this.advance();
  }
  handleConsecutiveOptionsNodes(shouldHandleCommand) {
    let next = this.generator.next();
    while (next.value instanceof _index.default.CommandResult && next.value.command !== this.pauseCommand) {
      if (shouldHandleCommand) {
        this.handleCommand(next.value);
      }
      next = this.generator.next();
    }
    return next;
  }

  // for combining text + options, and detecting dialogue end
  lookahead() {
    let next = this.generator.next();
    if (next.done) {
      next.value = Object.assign(next.value || {}, {
        isDialogueEnd: true
      });
      return next;
    }

    // Can't look ahead of options before we select one
    if (next.done || next.value && next.value.command === this.pauseCommand || next.value instanceof _index.default.OptionsResult) {
      return next;
    }
    if (this.handleCommand && next.value instanceof _index.default.CommandResult && next.value.command !== this.pauseCommand) {
      this.handleCommand(next.value);
      next = this.handleConsecutiveOptionsNodes(true);
    }
    this.runner.lookahead = true;
    let upcoming = this.generator.next();
    if (this.handleCommand && upcoming.value instanceof _index.default.CommandResult && upcoming.value.command !== this.pauseCommand) {
      upcoming = this.handleConsecutiveOptionsNodes();
      this.generator = next.value.getGeneratorHere();
      this.runner.lookahead = false;

      // Only possible if dialogue starts/resumes on a CommandResult.
      const rewoundNext = next.value instanceof _index.default.CommandResult ? this.handleConsecutiveOptionsNodes(true) : this.generator.next();
      if (!upcoming.value) {
        // Handle trailing commands at end of dialogue
        upcoming = this.handleConsecutiveOptionsNodes(true);
        if (upcoming.value) {
          // upcoming will only have a value if a conditional check's outcome changes
          // due to handling a series of commands directly before the conditional.
          // This edge case does cause commands to be handled prematurely
          this.generator = upcoming.value.getGeneratorHere();
        } else {
          Object.assign(rewoundNext.value, {
            isDialogueEnd: true
          });
        }
      }
      return rewoundNext;
    } else if (next.value instanceof _index.default.TextResult && this.combineTextAndOptionsResults && upcoming.value instanceof _index.default.OptionsResult) {
      this.generator = next.value.getGeneratorHere();
      this.runner.lookahead = false;
      const rewoundNext = this.generator.next();
      const rewoundUpcoming = this.generator.next();
      Object.assign(rewoundUpcoming.value, rewoundNext.value);
      return rewoundUpcoming;
    } else {
      this.generator = next.value.getGeneratorHere();
      this.runner.lookahead = false;
      const rewoundNext = this.generator.next();
      if (!upcoming.value) {
        Object.assign(rewoundNext.value, {
          isDialogueEnd: true
        });
      }
      return rewoundNext;
    }
  }
  advance(optionIndex) {
    if (typeof optionIndex !== 'undefined' && this.currentResult && this.currentResult.select) {
      this.currentResult.select(optionIndex);
    }
    const next = this.lookahead();
    [next.value.text && next.value, ...(next.value.options || [])].filter(Boolean).forEach(node => (0, _lineParser.default)(node, this.locale));
    if (this.currentResult && !(this.handleCommand && this.currentResult instanceof _index.default.CommandResult)) {
      this.history.push(this.currentResult);
    }
    this.currentResult = next.value;
  }
  registerFunction(name, func) {
    this.runner.registerFunction(name, func);
  }
}
exports["default"] = YarnBound;
module.exports = exports.default;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(954);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});