/* eslint no-unused-expressions: "off" */
/* eslint-env jest */

'use strict';

// TODO: Make less painful to look at

import bondage from '../src/index';
import linksYarnData from './yarn_files/links.json';
import shortcutsYarnData from './yarn_files/shortcuts.json';
import assignmentYarnData from './yarn_files/assignment.json';
import conditionalYarnData from './yarn_files/conditions.json';
import commandAndFunctionYarnData from './yarn_files/commandsandfunctions.json';
import inlineExpressionYarnData from './yarn_files/inlineexpression.json';

describe('Dialogue', () => {
  let runner;

  beforeEach(() => {
    runner = new bondage.Runner();
  });

  it('Can run through a single line', () => {
    runner.load(linksYarnData);
    const run = runner.run('OneNode');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'OneNode'; }) } };
    delete metadata.body;
    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Can run through two lines', () => {
    runner.load(linksYarnData);
    const run = runner.run('TwoLines');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'TwoLines'; }) } };
    delete metadata.body;
    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is another test line', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Can start at a different node', () => {
    runner.load(linksYarnData);
    const run = runner.run('Option2');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'Option2'; }) } };
    delete metadata.body;

    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is Option2\'s test line', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Can run through a first option to another node', () => {
    runner.load(linksYarnData);
    const run = runner.run('ThreeNodes');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'ThreeNodes'; }) } };
    delete metadata.body;
    const metadata2 = { ...{ ...linksYarnData.find((n) => { return n.title === 'Option1'; }) } };
    delete metadata2.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is another test line', [], metadata));

    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'First choice' },
      { text: 'Second choice' },
    ], metadata));

    value.select(0);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is Option1\'s test line', [], metadata2));

    expect(run.next().done).toBe(true);
  });

  it('Can run through a second option to another node', () => {
    runner.load(linksYarnData);
    const run = runner.run('ThreeNodes');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'ThreeNodes'; }) } };
    delete metadata.body;
    const metadata2 = { ...{ ...linksYarnData.find((n) => { return n.title === 'Option2'; }) } };
    delete metadata2.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is another test line', [], metadata));

    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'First choice' },
      { text: 'Second choice' },
    ], metadata));

    value.select(1);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is Option2\'s test line', [], metadata2));

    expect(run.next().done).toBe(true);
  });

  it('Includes node metadata with result', () => {
    runner.load(linksYarnData);
    const run = runner.run('OneNodeMetadata');
    const value = run.next().value;
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'OneNodeMetadata'; }) } };
    delete metadata.body;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));
    expect(value.metadata.someProp).toEqual('Hello');
    expect(run.next().done).toBe(true);
  });

  it('Includes hashtags with text results', () => {
    runner.load(linksYarnData);
    const run = runner.run('OneNodeHashtag');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'OneNodeHashtag'; }) } };
    delete metadata.body;
    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult(
      'This is a test line',
      ['someHashtag', 'someOtherHashtag', 'lastHashtag'],
      metadata,
    ));
    expect(run.next().done).toBe(true);
  });

  it('Ignores comments on option lines', () => {
    runner.load(shortcutsYarnData);
    const run = runner.run('NonNestedHashtag');
    const metadata = { ...{ ...shortcutsYarnData.find((n) => { return n.title === 'NonNestedHashtag'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'Option 1', hashtags: ['someHashtag', 'someOtherHashtag', 'lastHashtag'] },
      { text: 'Option 2' },
    ], metadata));
    value.select(1);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is the second option', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('includes hashtags on conditional option lines', () => {
    runner.load(shortcutsYarnData);
    const run = runner.run('ConditionalHashtag');
    const metadata = { ...{ ...shortcutsYarnData.find((n) => { return n.title === 'ConditionalHashtag'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));

    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'Option 1' },
      { text: 'Option 2', isAvailable: false, hashtags: ['someHashtag', 'someOtherHashtag'] },
      { text: 'Option 3' },
    ], metadata));

    value.select(2);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is the third option', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is after both options', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('includes hashtags on command lines', () => {
    runner.load(commandAndFunctionYarnData);
    const run = runner.run('BasicCommandsHashtag');
    const metadata = { ...{ ...commandAndFunctionYarnData.find((n) => { return n.title === 'BasicCommandsHashtag'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.CommandResult('command', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('text in between commands', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.CommandResult('command with "space"', ['someHashtag'], metadata));
    expect(run.next().done).toBe(true);
  });

  it('includes hashtags on lines only containing inline expression', () => {
    runner.load(inlineExpressionYarnData);
    const run = runner.run('SimpleInlineExpHashtag');
    const metadata = { ...{ ...inlineExpressionYarnData.find((n) => { return n.title === 'SimpleInlineExpHashtag'; }) } };
    delete metadata.body;

    runner.variables.set('firstvar', 1);

    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('1', ['someHashtag'], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Ignores comments on text lines', () => {
    runner.load(linksYarnData);
    const run = runner.run('OneNodeComment');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'OneNodeComment'; }) } };
    delete metadata.body;
    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Ignores comments on their own line', () => {
    runner.load(linksYarnData);
    const run = runner.run('OneNodeWholeLineComment');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'OneNodeWholeLineComment'; }) } };
    delete metadata.body;
    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Hello', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Ignores comments on option lines', () => {
    runner.load(shortcutsYarnData);
    const run = runner.run('NonNestedComment');
    const metadata = { ...{ ...shortcutsYarnData.find((n) => { return n.title === 'NonNestedComment'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'Option 1' },
      { text: 'Option 2' },
    ], metadata));
    value.select(1);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is the second option', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('ignores comments on conditional option lines', () => {
    runner.load(shortcutsYarnData);
    const run = runner.run('ConditionalComment');
    const metadata = { ...{ ...shortcutsYarnData.find((n) => { return n.title === 'ConditionalComment'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));

    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'Option 1' },
      { text: 'Option 2', isAvailable: false },
      { text: 'Option 3' },
    ], metadata));

    value.select(2);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is the third option', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is after both options', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('ignores comments on command lines', () => {
    runner.load(commandAndFunctionYarnData);
    const run = runner.run('BasicCommandsComment');
    const metadata = { ...{ ...commandAndFunctionYarnData.find((n) => { return n.title === 'BasicCommandsComment'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.CommandResult('command', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('text in between commands', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.CommandResult('command with "space"', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('ignores comments on lines only containing inline expression', () => {
    runner.load(inlineExpressionYarnData);
    const run = runner.run('SimpleInlineExpComment');
    const metadata = { ...{ ...inlineExpressionYarnData.find((n) => { return n.title === 'SimpleInlineExpComment'; }) } };
    delete metadata.body;

    runner.variables.set('firstvar', 1);

    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('1', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Automatically goes to the jump node', () => {
    runner.load(linksYarnData);
    const run = runner.run('OneJumpPassthrough');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'OneJumpPassthrough'; }) } };
    delete metadata.body;
    const metadata2 = { ...linksYarnData.find((n) => { return n.title === 'Option1'; }) };
    delete metadata2.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('First test line', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is Option1\'s test line', [], metadata2));
    expect(run.next().done).toBe(true);
  });

  it('Automatically goes through two jumps', () => {
    runner.load(linksYarnData);
    const run = runner.run('TwoJumpPassthrough');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'TwoJumpPassthrough'; }) } };
    delete metadata.body;
    const metadata2 = { ...linksYarnData.find((n) => { return n.title === 'OneJumpPassthrough'; }) };
    delete metadata2.body;
    const metadata3 = { ...linksYarnData.find((n) => { return n.title === 'Option1'; }) };
    delete metadata3.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Real First test line', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('First test line', [], metadata2));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is Option1\'s test line', [], metadata3));
    expect(run.next().done).toBe(true);
  });

  it('Can run through shortcuts', () => {
    runner.load(shortcutsYarnData);
    const run = runner.run('NonNested');
    const metadata = { ...{ ...shortcutsYarnData.find((n) => { return n.title === 'NonNested'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));

    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'Option 1' },
      { text: 'Option 2' },
    ], metadata));

    value.select(1);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is the second option', [], metadata));

    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is after both options', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Can run through nested shortcuts', () => {
    runner.load(shortcutsYarnData);
    const run = runner.run('Nested');
    const metadata = { ...{ ...shortcutsYarnData.find((n) => { return n.title === 'Nested'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('text', [], metadata));

    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'shortcut1a' },
      { text: 'shortcut2a' },
    ], metadata));

    value.select(0);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Text1', [], metadata));

    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'nestedshortcut1' },
      { text: 'nestedshortcut2' },
    ], metadata));

    value.select(1);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('NestedText2', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('more text', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Can exclude a conditional shortcut', () => {
    runner.load(shortcutsYarnData);
    const run = runner.run('Conditional');
    const metadata = { ...{ ...shortcutsYarnData.find((n) => { return n.title === 'Conditional'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));

    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'Option 1' },
      { text: 'Option 2', isAvailable: false },
      { text: 'Option 3' },
    ], metadata));

    value.select(2);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is the third option', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is after both options', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Can set a custom variable storage', () => {
    runner.load(assignmentYarnData);
    const run = runner.run('Numeric');
    const metadata = { ...{ ...assignmentYarnData.find((n) => { return n.title === 'Numeric'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line', [], metadata));

    runner.setVariableStorage(new Map());
    expect(runner.variables.get('testvar')).toBe(undefined);

    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line After', [], metadata));

    expect(runner.variables.get('testvar')).toEqual(-123.4);

    expect(run.next().done).toBe(true);
  });

  it('Can evaluate a numeric assignment', () => {
    runner.load(assignmentYarnData);
    const run = runner.run('Numeric');
    const metadata = { ...{ ...assignmentYarnData.find((n) => { return n.title === 'Numeric'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line', [], metadata));

    expect(runner.variables.get('testvar')).toBe(undefined);

    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line After', [], metadata));

    expect(runner.variables.get('testvar')).toEqual(-123.4);

    expect(run.next().done).toBe(true);
  });

  it('Can evaluate a numeric assignment with an expression', () => {
    runner.load(assignmentYarnData);
    const run = runner.run('NumericExpression');
    const metadata = { ...{ ...assignmentYarnData.find((n) => { return n.title === 'NumericExpression'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line', [], metadata));

    expect(runner.variables.get('testvar')).toBe(undefined);

    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line After', [], metadata));

    expect(runner.variables.get('testvar')).toEqual(((1 + 2) * -3) + 4.3);

    expect(run.next().done).toBe(true);
  });

  it('Can evaluate a numeric assignment with division expression', () => {
    runner.load(assignmentYarnData);
    const run = runner.run('AssignmentWithDivision');
    const metadata = { ...{ ...assignmentYarnData.find((n) => { return n.title === 'AssignmentWithDivision'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line', [], metadata));

    expect(runner.variables.get('testvar')).toBe(undefined);

    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line2', [], metadata));

    expect(runner.variables.get('testvar')).toEqual(100 / 5);

    expect(run.next().done).toBe(true);
  });

  it('Can evaluate an string assignment', () => {
    runner.load(assignmentYarnData);
    const run = runner.run('String');
    const metadata = { ...{ ...assignmentYarnData.find((n) => { return n.title === 'String'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line', [], metadata));

    expect(runner.variables.get('testvar')).toBe(undefined);

    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line After', [], metadata));

    expect(runner.variables.get('testvar')).toEqual('Variable String');

    expect(run.next().done).toBe(true);
  });

  it('Can evaluate a string assignment with an expression', () => {
    runner.load(assignmentYarnData);
    const run = runner.run('StringExpression');
    const metadata = { ...{ ...assignmentYarnData.find((n) => { return n.title === 'StringExpression'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line', [], metadata));

    expect(runner.variables.get('testvar')).toBe(undefined);

    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line After', [], metadata));

    expect(runner.variables.get('testvar')).toEqual('Variable String Appended');

    expect(run.next().done).toBe(true);
  });

  it('Can evaluate a boolean assignment', () => {
    runner.load(assignmentYarnData);
    const run = runner.run('Boolean');
    const metadata = { ...{ ...assignmentYarnData.find((n) => { return n.title === 'Boolean'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line', [], metadata));

    expect(runner.variables.get('testvar')).toBe(undefined);

    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line After', [], metadata));

    expect(runner.variables.get('testvar')).toEqual(true);

    expect(run.next().done).toBe(true);
  });

  it('Can evaluate a function boolean assignment', () => {
    runner.load(assignmentYarnData);
    const run = runner.run('AssignmentWithFunction');
    runner.registerFunction('identity', (x) => { return x; });
    const metadata = { ...{ ...assignmentYarnData.find((n) => { return n.title === 'AssignmentWithFunction'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line', [], metadata));
    expect(runner.variables.get('testvar')).toBe(undefined);

    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line2', [], metadata));
    expect(runner.variables.get('testvar')).toEqual(false);

    value = run.next().value;
    expect(runner.variables.get('testvar')).toEqual(true);

    expect(run.next().done).toBe(true);
  });

  it('Can evaluate a boolean assignment with expression', () => {
    runner.load(assignmentYarnData);
    const run = runner.run('BooleanExpression');
    const metadata = { ...{ ...assignmentYarnData.find((n) => { return n.title === 'BooleanExpression'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line', [], metadata));

    expect(runner.variables.get('testvar')).toBe(undefined);

    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line After', [], metadata));

    expect(runner.variables.get('testvar')).toEqual(true);

    expect(run.next().done).toBe(true);
  });

  it('Can evaluate an assignment from one variable to another', () => {
    runner.load(assignmentYarnData);
    const run = runner.run('Variable');
    const metadata = { ...{ ...assignmentYarnData.find((n) => { return n.title === 'Variable'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line', [], metadata));

    expect(runner.variables.get('firstvar')).toBe(undefined);
    expect(runner.variables.get('secondvar')).toBe(undefined);

    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line After', [], metadata));

    expect(runner.variables.get('secondvar')).toEqual('First variable string');

    expect(run.next().done).toBe(true);
  });

  it('Can evaluate an assignment from one variable to another via an expression', () => {
    runner.load(assignmentYarnData);
    const run = runner.run('VariableExpression');
    const metadata = { ...{ ...assignmentYarnData.find((n) => { return n.title === 'VariableExpression'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line', [], metadata));

    expect(runner.variables.get('firstvar')).toBe(undefined);
    expect(runner.variables.get('secondvar')).toBe(undefined);

    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line After', [], metadata));

    expect(runner.variables.get('secondvar')).toEqual(-4.3 + 100);

    expect(run.next().done).toBe(true);
  });

  it('Can evaluate an assignment from one variable to another via an expression with self reference', () => {
    runner.load(assignmentYarnData);
    const run = runner.run('VariableExpression2');
    const metadata = { ...{ ...assignmentYarnData.find((n) => { return n.title === 'VariableExpression2'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line', [], metadata));

    expect(runner.variables.get('firstvar')).toBe(undefined);
    expect(runner.variables.get('secondvar')).toBe(undefined);

    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line After', [], metadata));

    expect(runner.variables.get('firstvar')).toEqual(300);

    expect(run.next().done).toBe(true);
  });

  it('Can handle an if conditional', () => {
    runner.load(conditionalYarnData);
    const run = runner.run('BasicIf');
    const metadata = { ...{ ...conditionalYarnData.find((n) => { return n.title === 'BasicIf'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Text before', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Inside if', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Inside if2', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Text after', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Can handle an if else conditional', () => {
    runner.load(conditionalYarnData);
    const run = runner.run('BasicIfElse');
    const metadata = { ...{ ...conditionalYarnData.find((n) => { return n.title === 'BasicIfElse'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Text before', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Inside else', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Text after', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Can handle an if elseif conditional', () => {
    runner.load(conditionalYarnData);
    const run = runner.run('BasicIfElseIf');
    const metadata = { ...{ ...conditionalYarnData.find((n) => { return n.title === 'BasicIfElseIf'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Text before', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Inside elseif', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Text after', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Can handle an if elseif else conditional', () => {
    runner.load(conditionalYarnData);
    const run = runner.run('BasicIfElseIfElse');
    const metadata = { ...{ ...conditionalYarnData.find((n) => { return n.title === 'BasicIfElseIfElse'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Text before', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Inside else', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Text after', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Halts when given the <<stop>> command', () => {
    runner.load(commandAndFunctionYarnData);
    const run = runner.run('StopCommand');
    const metadata = { ...{ ...commandAndFunctionYarnData.find((n) => { return n.title === 'StopCommand'; }) } };
    delete metadata.body;

    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('First line', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Ignores content after jumps when going through multiple options', () => {
    runner.load(commandAndFunctionYarnData);
    const run = runner.run('Option1');
    const metadata = { ...{ ...commandAndFunctionYarnData.find((n) => { return n.title === 'Option1'; }) } };
    delete metadata.body;
    const metadata2 = { ...commandAndFunctionYarnData.find((n) => { return n.title === 'Option2'; }) };
    delete metadata2.body;
    const metadata3 = { ...commandAndFunctionYarnData.find((n) => { return n.title === 'StopCommand'; }) };
    delete metadata3.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Prompt1', [], metadata));
    value = run.next().value;
    value.select(0);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Prompt2', [], metadata2));
    value = run.next().value;
    value.select(0);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('First line', [], metadata3));
    expect(run.next().done).toBe(true);
  });

  it('Returns commands to the user', () => {
    runner.load(commandAndFunctionYarnData);
    const run = runner.run('BasicCommands');
    const metadata = { ...{ ...commandAndFunctionYarnData.find((n) => { return n.title === 'BasicCommands'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.CommandResult('command', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('text in between commands', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.CommandResult('command with "space"', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Returns commands with inline expressions to the user', () => {
    runner.load(commandAndFunctionYarnData);
    const run = runner.run('ExpressionArgumentCommand');
    const metadata = { ...{ ...commandAndFunctionYarnData.find((n) => { return n.title === 'ExpressionArgumentCommand'; }) } };
    delete metadata.body;
    runner.variables.set('testvar1', 1);
    runner.variables.set('testvar2', 5);
    runner.variables.set('testvar3', 10);
    const value = run.next().value;
    expect(value).toEqual(new bondage.CommandResult('command 1 5 apple 10', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('handles a simple function call with numbers', () => {
    runner.registerFunction('addOne', (num) => { return num + 1; });
    runner.load(commandAndFunctionYarnData);
    const run = runner.run('NumberFunction');

    const metadata = { ...{ ...commandAndFunctionYarnData.find((n) => { return n.title === 'NumberFunction'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('4', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('5', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Evaluates a function and uses it in a conditional', () => {
    runner.registerFunction('testfunc', (arg1, arg2) => {
      if (arg1 === 'firstarg') {
        if (arg2 === 'secondarg') {
          // Test returning true
          return true;
        }
        // Test returning false
        return false;
      }

      throw new Error(`Args ${[arg1, arg2]} were not expected in testfunc`);
    });

    runner.load(commandAndFunctionYarnData);
    const run = runner.run('FunctionConditional');
    const metadata = { ...{ ...commandAndFunctionYarnData.find((n) => { return n.title === 'FunctionConditional'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('First line', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This should show', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('After both', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Should ignore text after a jump after an option', () => {
    runner.load(conditionalYarnData);
    const run = runner.run('TextAfterJumpAfterOption');
    const metadata = { ...{ ...conditionalYarnData.find((n) => { return n.title === 'TextAfterJumpAfterOption'; }) } };
    delete metadata.body;
    const metadata2 = { ...conditionalYarnData.find((n) => { return n.title === 'give_key'; }) };
    delete metadata2.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Text before', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Inside if', [], metadata));

    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'Give key' },
    ], metadata));

    value.select(0);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('You give the key to the troll.', [], metadata2));

    expect(run.next().done).toBe(true);
  });

  it('Should ignore text after a jump after a conditional option', () => {
    runner.load(conditionalYarnData);
    const run = runner.run('ConditionalOption');
    const metadata = { ...{ ...conditionalYarnData.find((n) => { return n.title === 'ConditionalOption'; }) } };
    delete metadata.body;
    const metadata2 = { ...conditionalYarnData.find((n) => { return n.title === 'Objective'; }) };
    delete metadata2.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Text before', [], metadata));

    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'Cond Option' },
    ], metadata));

    value.select(0);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('You reach the objective.', [], metadata2));

    expect(run.next().done).toBe(true);
  });

  it('Should ignore text after a jump after an option in a conditional block', () => {
    runner.load(conditionalYarnData);
    const run = runner.run('OptionAfterOptionWithinConditional');
    const metadata = { ...{ ...conditionalYarnData.find((n) => { return n.title === 'OptionAfterOptionWithinConditional'; }) } };
    delete metadata.body;
    const metadata2 = { ...conditionalYarnData.find((n) => { return n.title === 'give_key'; }) };
    delete metadata2.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Text before', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Inside if', [], metadata));

    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'Give key' },
      { text: 'You keep the key.' },
    ], metadata));

    value.select(0);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('You give the key to the troll.', [], metadata2));
    value = run.next().value;

    expect(run.next().done).toBe(true);
  });

  it('Should move on after a first option with no follow-up is selected', () => {
    runner.load(shortcutsYarnData);
    const run = runner.run('EmptyFirstOption');
    const metadata = { ...{ ...shortcutsYarnData.find((n) => { return n.title === 'EmptyFirstOption'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'Option 1' },
      { text: 'Option 2' },
    ], metadata));
    value.select(0);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is after both options', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Should move on after a second option with no follow-up is selected', () => {
    runner.load(shortcutsYarnData);
    const run = runner.run('EmptySecondOption');
    const metadata = { ...{ ...shortcutsYarnData.find((n) => { return n.title === 'EmptySecondOption'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'Option 1' },
      { text: 'Option 2' },
    ], metadata));
    value.select(1);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is after both options', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Should move on after a conditional option with no follow-up is selected', () => {
    runner.load(shortcutsYarnData);
    const run = runner.run('EmptyConditional');
    const metadata = { ...{ ...shortcutsYarnData.find((n) => { return n.title === 'EmptyConditional'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'Option 1' },
      { text: 'Option 2' },
    ], metadata));
    value.select(0);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is after both options', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Can handle a simple inline expression', () => {
    runner.load(inlineExpressionYarnData);
    const run = runner.run('SimpleInlineExp');
    const metadata = { ...{ ...inlineExpressionYarnData.find((n) => { return n.title === 'SimpleInlineExp'; }) } };
    delete metadata.body;

    runner.variables.set('firstvar', 1);

    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('1', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Can handle sequential inline expressions', () => {
    runner.load(inlineExpressionYarnData);
    const run = runner.run('SequentialInlineExpressions');
    const metadata = { ...{ ...inlineExpressionYarnData.find((n) => { return n.title === 'SequentialInlineExpressions'; }) } };
    delete metadata.body;

    runner.variables.set('firstvar', 1);
    runner.variables.set('secondvar', 2);

    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('12', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Can handle non-sequential inline expressions', () => {
    runner.load(inlineExpressionYarnData);
    const run = runner.run('NonSequentialInlineExpressions');
    const metadata = { ...{ ...inlineExpressionYarnData.find((n) => { return n.title === 'NonSequentialInlineExpressions'; }) } };
    delete metadata.body;

    runner.variables.set('firstvar', 1);
    runner.variables.set('secondvar', 2);

    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('1textbetween2', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Can handle a simple inline expression in a sentence', () => {
    runner.load(inlineExpressionYarnData);
    const run = runner.run('InlineExpSentence');
    const metadata = { ...{ ...inlineExpressionYarnData.find((n) => { return n.title === 'InlineExpSentence'; }) } };
    delete metadata.body;

    runner.variables.set('firstvar', 'test');

    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test.', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Can handle an arithmetic inline expression', () => {
    runner.load(inlineExpressionYarnData);
    const run = runner.run('InlineExpArithmetic');
    const metadata = { ...{ ...inlineExpressionYarnData.find((n) => { return n.title === 'InlineExpArithmetic'; }) } };
    delete metadata.body;

    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('The results are 10 and 12 and 1.', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Can handle an inline expression with a variable', () => {
    runner.load(inlineExpressionYarnData);
    const run = runner.run('InlineExpVariable');
    const metadata = { ...{ ...inlineExpressionYarnData.find((n) => { return n.title === 'InlineExpVariable'; }) } };
    delete metadata.body;
    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('The results are -1 and true and true and true and true and true.', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Can handle an inline expression in an option', () => {
    runner.load(inlineExpressionYarnData);
    const run = runner.run('OptionInlineExpression');
    const metadata = { ...{ ...inlineExpressionYarnData.find((n) => { return n.title === 'OptionInlineExpression'; }) } };
    delete metadata.body;
    runner.variables.set('firstvar', 'test');

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));

    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'First test choice' },
      { text: 'Second choice' },
    ], metadata));

    value.select(0);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is Option1\'s test text', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Can handle an inline expression in a conditional option', () => {
    runner.load(inlineExpressionYarnData);
    const run = runner.run('ConditionalOptionInlineExpression');
    const metadata = { ...{ ...inlineExpressionYarnData.find((n) => { return n.title === 'ConditionalOptionInlineExpression'; }) } };
    delete metadata.body;
    runner.variables.set('firstvar', 'test');

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));

    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'First test choice' },
      { text: 'Second choice' },
    ], metadata));

    value.select(0);
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is Option1\'s test text', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Can handle a simple inline expression whitespace in a sentence', () => {
    runner.load(inlineExpressionYarnData);
    const run = runner.run('InlineExpAddSentence');
    const metadata = { ...{ ...inlineExpressionYarnData.find((n) => { return n.title === 'InlineExpAddSentence'; }) } };
    delete metadata.body;

    runner.variables.set('firstvar', 1);

    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a 2 sentence.', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Can handle an if arithmetic expression elseif conditional', () => {
    runner.load(conditionalYarnData);
    const run = runner.run('ArithmeticExpressionConditional');
    const metadata = { ...{ ...conditionalYarnData.find((n) => { return n.title === 'ArithmeticExpressionConditional'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Inside if', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Text after', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Final text', [], metadata));

    expect(run.next().done).toBe(true);
  });

  it('Can evaluate a numeric assignment with exponent expression', () => {
    runner.load(assignmentYarnData);
    const run = runner.run('ExponentExpression');
    const metadata = { ...{ ...assignmentYarnData.find((n) => { return n.title === 'ExponentExpression'; }) } };
    delete metadata.body;

    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line', [], metadata));

    expect(runner.variables.get('testvar')).toBe(undefined);

    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Test Line After', [], metadata));

    expect(runner.variables.get('testvar')).toEqual(2 ** 2);

    expect(run.next().done).toBe(true);
  });

  it('can handle a negated function call in a conditional', () => {
    runner.registerFunction('returnFalse', () => { return false; });

    runner.load(conditionalYarnData);
    const run = runner.run('IfNotFunction');
    const metadata = { ...{ ...conditionalYarnData.find((n) => { return n.title === 'IfNotFunction'; }) } };
    delete metadata.body;
    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Inside if', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Text after', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Can handle inline expression containing function call', () => {
    runner.registerFunction('testfunc', (arg1, arg2) => {
      if (arg1 === 'frank') {
        if (arg2 === 2) {
          // Test returning true
          return true;
        }
        // Test returning false
        return false;
      }

      throw new Error(`Args ${[arg1, arg2]} were not expected in testfunc`);
    });

    runner.load(inlineExpressionYarnData);
    const run = runner.run('InlineExpFunctionResult');
    const metadata = { ...{ ...inlineExpressionYarnData.find((n) => { return n.title === 'InlineExpFunctionResult'; }) } };
    delete metadata.body;
    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('The results are true.', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Can handle inline expression containing equality', () => {
    runner.load(inlineExpressionYarnData);
    const run = runner.run('InlineExpEquality');
    const metadata = { ...{ ...inlineExpressionYarnData.find((n) => { return n.title === 'InlineExpEquality'; }) } };
    delete metadata.body;
    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a true sentence.', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Can handle inline expression containing function call and expression', () => {
    runner.registerFunction('testfunc', () => { return 1; });

    runner.load(inlineExpressionYarnData);
    const run = runner.run('InlineExpFunctionResultExp');
    const metadata = { ...{ ...inlineExpressionYarnData.find((n) => { return n.title === 'InlineExpFunctionResultExp'; }) } };
    delete metadata.body;
    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('The results are 2.', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Can run through a single line with an escaped curly brace', () => {
    runner.load(linksYarnData);
    const run = runner.run('OneNodeEscapeCurlyBrace');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'OneNodeEscapeCurlyBrace'; }) } };
    delete metadata.body;
    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a {test} line', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Does not remove backslashes if noEscape is on', () => {
    runner.load(linksYarnData);
    runner.noEscape = true;
    const run = runner.run('OneNodeEscapeCurlyBrace');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'OneNodeEscapeCurlyBrace'; }) } };
    delete metadata.body;
    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a \\{test\\} line', [], metadata));
    expect(run.next().done).toBe(true);
    runner.noEscape = false;
  });

  it('Can run through a single line with two consecutive escaped curly braces', () => {
    runner.load(linksYarnData);
    const run = runner.run('OneNodeEscapeTwoCurlyBraces');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'OneNodeEscapeTwoCurlyBraces'; }) } };
    delete metadata.body;
    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a {{test} line', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Can run through a single line with an escaped hashtag', () => {
    runner.load(linksYarnData);
    const run = runner.run('OneNodeEscapeHashtag');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'OneNodeEscapeHashtag'; }) } };
    delete metadata.body;
    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a #test line', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Can escape hashtags and comments together', () => {
    runner.load(linksYarnData);
    const run = runner.run('OneNodeEscapeHashtagComment');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'OneNodeEscapeHashtagComment'; }) } };
    delete metadata.body;
    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult(
      'This is a test line#escaped//',
      ['lastHashtag'],
      metadata,
    ));
    expect(run.next().done).toBe(true);
  });

  it('Can run through three lines when the first ends on an escaped character', () => {
    runner.load(linksYarnData);
    const run = runner.run('ThreeLineEscape');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'ThreeLineEscape'; }) } };
    delete metadata.body;
    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is a test line', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('This is another test line', [], metadata));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult('Yet another test line', [], metadata));
    expect(run.next().done).toBe(true);
  });

  it('Throws an error if an out-of-range option is selected', () => {
    runner.load(linksYarnData);
    const run = runner.run('ThreeNodes');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'ThreeNodes'; }) } };
    delete metadata.body;

    let value = run.next().value;
    value = run.next().value;
    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'First choice' },
      { text: 'Second choice' },
    ], metadata));

    expect(() => { value.select(100); }).toThrow();
    expect(() => { value.select(); }).toThrow();
  });

  it('Throws an error if no option is selected before next() is called', () => {
    runner.load(linksYarnData);
    const run = runner.run('ThreeNodes');
    const metadata = { ...{ ...linksYarnData.find((n) => { return n.title === 'ThreeNodes'; }) } };
    delete metadata.body;

    let value = run.next().value;
    value = run.next().value;
    value = run.next().value;
    expect(value).toEqual(new bondage.OptionsResult([
      { text: 'First choice' },
      { text: 'Second choice' },
    ], metadata));

    expect(() => { run.next(); }).toThrow();
  });

  it('Throws an error if a function is called but not registered', () => {
    runner.load(commandAndFunctionYarnData);
    const run = runner.run('FunctionConditional');
    run.next();
    expect(() => { run.next(); }).toThrow();
  });

  it('Throws an error if evaluateExpressionOrLiteral is called with an unknown node type', () => {
    expect(
      runner.evaluateExpressionOrLiteral({ type: 'TextNode', text: 'hello' }),
    ).toEqual('hello');
    expect(() => { runner.evaluateExpressionOrLiteral({ type: 'Blah', text: 'hello' }); }).toThrow();
  });

  it('Throws an error if starting node does not exist', () => {
    runner.load(commandAndFunctionYarnData);
    expect(() => { runner.run('BlahDoesNotExistBlah').next(); }).toThrow();
  });

  it('Throws an error if a node does not have a title', () => {
    expect(() => { runner.load([{ body: 'Hello' }]); }).toThrow();
  });

  it('Throws an error if a node has a dot in the title', () => {
    expect(() => { runner.load([{ title: 'Cool.Node', body: 'Hello' }]); }).toThrow();
  });

  it('Throws an error if two nodes have the same title', () => {
    expect(() => {
      runner.load([
        { title: 'CoolNode', body: 'Hello' },
        { title: 'CoolNode', body: 'Goodbye' },
      ]);
    }).toThrow();
  });

  it('Throws an error if a node does not have a body', () => {
    expect(() => { runner.load([{ title: 'CoolNode', body: '' }]); }).toThrow();
  });

  it('Throws an error if a non-function is registed as a function', () => {
    expect(() => { runner.registerFunction('testfunc', {}); }).toThrow();
  });

  it('Throws an error if custom variableStorage does not have a get or set', () => {
    expect(() => { runner.setVariableStorage({ set: () => {} }); }).toThrow();
    expect(() => { runner.setVariableStorage({ get: () => {} }); }).toThrow();
    expect(() => { runner.setVariableStorage({ get: () => {}, set: () => {} }); }).not.toThrow();
  });

  it('Throws an error if a node has a duplicate tag', () => {
    const dialogue = `
      title: Start
      title: Start
      ---
      This is a test line.
      ===
    `;
    expect(() => { runner.load(dialogue); }).toThrow();
  });

  it('handles a string yarn dialogue', () => {
    const dialogue = `
      #someFiletag

      #someOtherFiletag

      title: Start
      otherkey: someValue
      body: should be ignored
      ---
      This is a test line.
      <<jump End>>
      ===

      title: End

      ---

      This is another test line.
      ===
    `;
    runner.load(dialogue);
    const run = runner.run('Start');
    let value = run.next().value;
    expect(value).toEqual(new bondage.TextResult(
      'This is a test line.',
      [],
      {
        title: 'Start',
        otherkey: 'someValue',
        filetags: ['someFiletag', 'someOtherFiletag'],
      },
    ));
    value = run.next().value;
    expect(value).toEqual(new bondage.TextResult(
      'This is another test line.',
      [],
      {
        title: 'End',
        filetags: ['someFiletag', 'someOtherFiletag'],
      },
    ));
    expect(run.next().done).toBe(true);
  });

  it('handles a string yarn with no tags', () => {
    const dialogue = `
      title: Start
      ignoreme
      ---
      This is a test line.
      ===
    `;
    runner.load(dialogue);
    const run = runner.run('Start');
    const value = run.next().value;
    expect(value).toEqual(new bondage.TextResult(
      'This is a test line.',
      [],
      { title: 'Start' },
    ));
    expect(run.next().done).toBe(true);
  });

  it('handles declaration', () => {
    const dialogue = `
      title: Start
      ---
      <<declare $testvar1 = 1>>
      <<set $testvar2 to 2>>
      <<declare $testvar2 = 023984029384>>
      { $testvar1 }
      { $testvar2 }
      { $testvar3 }
      <<declare $testvar3 = 3>>
      ===
    `;
    runner.load(dialogue);
    const run = runner.run('Start');
    let value = run.next().value;
    expect(value.text).toEqual('1');
    value = run.next().value;
    expect(value.text).toEqual('2');
    value = run.next().value;
    expect(value.text).toEqual('3');
    expect(run.next().done).toBe(true);
  });

  it('does not overwrite existing value with declaration', () => {
    const dialogue = `
      title: Start
      ---
      <<declare $testvar1 = 1>>
      { $testvar1 }
      ===
    `;
    runner.variables.set('testvar1', 99);
    runner.load(dialogue);
    const run = runner.run('Start');
    const value = run.next().value;
    expect(value.text).toEqual('99');
    expect(run.next().done).toBe(true);
  });

  it('throws an error on duplicate declaration', () => {
    const dialogue = `
      title: Start
      ---
      <<declare $testvar1 = 1>>
      <<declare $testvar1 = 2>>
      ===
    `;
    expect(() => { runner.load(dialogue); }).toThrow();
  });

  it('throws an error if declaration value and explicit type do not match', () => {
    const dialogue = `
      title: Start
      ---
      <<declare $testvar1 = 1 as Bool>>
      ===
    `;
    expect(() => { runner.load(dialogue); }).toThrow();
  });

  it('throws an error if a variable value overwrites a different type', () => {
    const dialogue = `
      title: Start
      ---
      <<set $testvar1 = 1>>
      <<set $testvar1 = "bad">>
      ===
    `;
    runner.load(dialogue);
    const run = runner.run('Start');
    expect(() => { run.next(); }).toThrow();
  });
});

