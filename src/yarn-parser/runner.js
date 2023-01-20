import parser from './parser/parser';
import results from './results';
import DefaultVariableStorage from './default-variable-storage';
import convertYarn from './convert-yarn-to-js';
import types from './parser/nodes';

const nodeTypes = types.types;

class Runner {
  constructor() {
    this.noEscape = false;
    this.yarnNodes = {};
    this.variables = new DefaultVariableStorage();
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
      nodes = convertYarn(dialogue);
    } else {
      nodes = dialogue;
    }

    nodes.forEach((node) => {
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

    parser.yy.areDeclarationsHandled = false;
    parser.yy.declarations = {};
    this.handleDeclarations(nodes);
    parser.yy.areDeclarationsHandled = true;
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
      Boolean: false,
    };

    const allLines = nodes.reduce((acc, node) => {
      const nodeLines = node.body.split(/\r?\n+/);
      return [...acc, ...nodeLines];
    }, []);

    const declareLines = allLines.reduce((acc, line) => {
      const match = line.match(/^<<declare .+>>/);
      return match
        ? [...acc, line]
        : acc;
    }, []);
    if (declareLines.length) {
      parser.parse(declareLines.join('\n'));
    }

    Object.entries(parser.yy.declarations)
      .forEach(([variableName, { expression, explicitType }]) => {
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
   * Generator to return each sequential dialog result starting from the given node
   * @param {string} [startNode] - The name of the yarn node to begin at
   */
  * run(startNode) {
    let jumpTo = startNode;
    while (jumpTo) {
      const yarnNode = this.yarnNodes[jumpTo];
      if (yarnNode === undefined) {
        throw new Error(`Node "${startNode}" does not exist`);
      }

      // Parse the entire node
      const parserNodes = Array.from(parser.parse(yarnNode.body));
      const metadata = { ...yarnNode };
      delete metadata.body;
      const result = yield* this.evalNodes(parserNodes, metadata);
      jumpTo = result && result.jump;
    }
  }

  /**
   * Evaluate a list of parser nodes, yielding the ones that need to be seen by
   * the user. Calls itself recursively if that is required by nested nodes
   * @param {Node[]} nodes
   * @param {YarnNode[]} metadata
   */
  * evalNodes(nodes, metadata) {
    let shortcutNodes = [];
    let textRun = '';

    const filteredNodes = nodes.filter(Boolean);

    // Yield the individual user-visible results
    // Need to accumulate all adjacent selectables
    // into one list (hence some of the weirdness here)
    for (let nodeIdx = 0; nodeIdx < filteredNodes.length; nodeIdx += 1) {
      const node = filteredNodes[nodeIdx];
      const nextNode = filteredNodes[nodeIdx + 1];

      // Text and the output of Inline Expressions
      // are combined to deliver a TextNode.
      if (
        node instanceof nodeTypes.Text
        || node instanceof nodeTypes.Expression
      ) {
        textRun += this.evaluateExpressionOrLiteral(node).toString();
        if (
          nextNode
          && node.lineNum === nextNode.lineNum
          && (
            nextNode instanceof nodeTypes.Text
            || nextNode instanceof nodeTypes.Expression
          )
        ) {
          // Same line, with another text equivalent to add to the
          // text run further on in the loop, so don't yield.
        } else {
          yield new results.TextResult(textRun, node.hashtags, metadata);
          textRun = '';
        }
      } else if (node instanceof nodeTypes.Shortcut) {
        shortcutNodes.push(node);
        if (!(nextNode instanceof nodeTypes.Shortcut)) {
          // Last shortcut in the series, so yield the shortcuts.
          const result = yield* this.handleShortcuts(shortcutNodes, metadata);
          if (result && (result.stop || result.jump)) {
            return result;
          }
          shortcutNodes = [];
        }
      } else if (node instanceof nodeTypes.Assignment) {
        this.evaluateAssignment(node);
      } else if (node instanceof nodeTypes.Conditional) {
        // Get the results of the conditional
        const evalResult = this.evaluateConditional(node);
        if (evalResult) {
          // Run the remaining results
          const result = yield* this.evalNodes(evalResult, metadata);
          if (result && (result.stop || result.jump)) {
            return result;
          }
        }
      } else if (node instanceof types.JumpCommandNode) {
        // ignore the rest of this outer loop and
        // tell parent loops to ignore following nodes.
        // Recursive call here would cause stack overflow
        return { jump: node.destination };
      } else if (node instanceof types.StopCommandNode) {
        // ignore the rest of this outer loop and
        // tell parent loops to ignore following nodes
        return { stop: true };
      } else {
        const command = this.evaluateExpressionOrLiteral(node.command);
        yield new results.CommandResult(command, node.hashtags, metadata);
      }
    }

    return undefined;
  }

  /**
   * yield a shortcut result then handle the subsequent selection
   * @param {any[]} selections
   */
  * handleShortcuts(selections, metadata) {
    // Multiple options to choose from (or just a single shortcut)
    // Tag any conditional dialog options that result to false,
    // the consuming app does the actual filtering or whatever
    const transformedSelections = selections.map((s) => {
      let isAvailable = true;

      if (
        s.conditionalExpression
        && !this.evaluateExpressionOrLiteral(s.conditionalExpression)
      ) {
        isAvailable = false;
      }

      const text = this.evaluateExpressionOrLiteral(s.text);
      return Object.assign(s, { isAvailable, text });
    });

    const optionsResult = new results.OptionsResult(transformedSelections, metadata);
    yield optionsResult;
    if (typeof optionsResult.selected === 'number') {
      const selectedOption = transformedSelections[optionsResult.selected];
      if (selectedOption.content) {
        // Recursively go through the nodes nested within
        return yield* this.evalNodes(selectedOption.content, metadata);
      }
    } else {
      throw new Error('No option selected before resuming dialogue');
    }

    return undefined;
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
      return this.functions[node.functionName](
        ...node.args.map(this.evaluateExpressionOrLiteral, this),
      );
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

    const nodeHandlers = {
      UnaryMinusExpressionNode: (a) => { return -a; },
      ArithmeticExpressionAddNode: (a, b) => { return a + b; },
      ArithmeticExpressionMinusNode: (a, b) => { return a - b; },
      ArithmeticExpressionExponentNode: (a, b) => { return a ** b; },
      ArithmeticExpressionMultiplyNode: (a, b) => { return a * b; },
      ArithmeticExpressionDivideNode: (a, b) => { return a / b; },
      ArithmeticExpressionModuloNode: (a, b) => { return a % b; },
      NegatedBooleanExpressionNode: (a) => { return !a; },
      BooleanOrExpressionNode: (a, b) => { return a || b; },
      BooleanAndExpressionNode: (a, b) => { return a && b; },
      BooleanXorExpressionNode: (a, b) => { return !!(a ^ b); }, // eslint-disable-line no-bitwise
      EqualToExpressionNode: (a, b) => { return a === b; },
      NotEqualToExpressionNode: (a, b) => { return a !== b; },
      GreaterThanExpressionNode: (a, b) => { return a > b; },
      GreaterThanOrEqualToExpressionNode: (a, b) => { return a >= b; },
      LessThanExpressionNode: (a, b) => { return a < b; },
      LessThanOrEqualToExpressionNode: (a, b) => { return a <= b; },
      TextNode: (a) => { return a.text; },
      EscapedCharacterNode: (a) => { return this.noEscape ? a.text : a.text.slice(1); },
      NumericLiteralNode: (a) => { return parseFloat(a.numericLiteral); },
      StringLiteralNode: (a) => { return `${a.stringLiteral}`; },
      BooleanLiteralNode: (a) => { return a.booleanLiteral === 'true'; },
      VariableNode: (a) => { return this.variables.get(a.variableName); },
      FunctionCallNode: (a) => { return this.evaluateFunctionCall(a); },
      InlineExpressionNode: (a) => { return a; },
    };

    const handler = nodeHandlers[node.type];
    if (!handler) {
      throw new Error(`node type not recognized: ${node.type}`);
    }

    return handler(
      node instanceof nodeTypes.Expression
        ? this.evaluateExpressionOrLiteral(node.expression || node.expression1)
        : node,
      node.expression2
        ? this.evaluateExpressionOrLiteral(node.expression2)
        : node,
    );
  }
}

export default {
  Runner,
  TextResult: results.TextResult,
  CommandResult: results.CommandResult,
  OptionsResult: results.OptionsResult,
};
