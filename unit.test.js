/* eslint-env jest */
/* eslint-disable no-new */

import YarnWrapped from './src/yarn-wrapped'
import bondage from 'bondage'

jest.mock('bondage')
bondage.Runner.prototype.run.mockImplementation(function * () {
  while (true) yield new bondage.TextResult()
})
// It's convenient to make actual results objects in test
const actualBondage = jest.requireActual('bondage')
bondage.TextResult = actualBondage.TextResult
bondage.OptionsResult = actualBondage.OptionsResult
bondage.CommandResult = actualBondage.CommandResult

describe('constructor', () => {
  const dialogue = []
  test('should load a dialogue object into the runner', () => {
    new YarnWrapped({ dialogue })
    expect(bondage.Runner.prototype.load)
      .toHaveBeenCalledWith(dialogue)
  })

  test('should set the variable storage if provided', () => {
    const variableStorage = new Map()
    new YarnWrapped({ variableStorage })
    expect(bondage.Runner.prototype.setVariableStorage)
      .toHaveBeenCalledWith(variableStorage)
  })

  test('should register provided functions', () => {
    const functions = {
      functionOne: () => {},
      functionTwo: () => {}
    }
    new YarnWrapped({ functions })
    Object.entries(functions).forEach(([key, func]) => {
      expect(bondage.Runner.prototype.registerFunction)
        .toHaveBeenCalledWith(key, func)
    })
  })

  test('should register provided functions', () => {
    const functions = {
      functionOne: () => {},
      functionTwo: () => {}
    }
    new YarnWrapped({ functions })
    Object.entries(functions).forEach(([key, func]) => {
      expect(bondage.Runner.prototype.registerFunction)
        .toHaveBeenCalledWith(key, func)
    })
  })

  test('should start the generator at the node with the provided "startAt" title', () => {
    const startAt = 'someStartingNode'
    new YarnWrapped({ startAt })
    expect(bondage.Runner.prototype.run).toHaveBeenCalledWith(startAt)
  })

  test('should start the generator at the "Start" node if startAt is undefined', () => {
    new YarnWrapped({})
    expect(bondage.Runner.prototype.run).toHaveBeenCalledWith('Start')
  })

  test('should attach the generator to the instance', () => {
    const runner = new YarnWrapped({})
    expect(runner.generator).toBe(bondage.Runner.prototype.run.mock.results[0].value)
  })

  test('should advance the generator', () => {
    jest.spyOn(YarnWrapped.prototype, 'advance')
    new YarnWrapped({})
    expect(YarnWrapped.prototype.advance).toHaveBeenCalled()
  })
})

describe('advance', () => {
  const mockCommandArgs1 = ['a', 'b']
  const mockCommandArgs2 = ['c', 'd']
  const mockCommandName1 = 'blah'
  const mockCommandName2 = 'bleh'
  const mockCommandResult1 = new bondage.CommandResult(mockCommandName1, mockCommandArgs1)
  const mockCommandResult2 = new bondage.CommandResult(mockCommandName2, mockCommandArgs2)
  const mockTextResult1 = new bondage.TextResult('marge')
  const mockTextResult2 = new bondage.TextResult('maggie')
  const mockTextResult3 = new bondage.TextResult('homer')
  const mockOptionsResult = new bondage.OptionsResult(['bart', 'lisa'])
  describe('where next nodes are a TextResult followed by OptionsResult', () => {
    beforeAll(() => {
      bondage.Runner.prototype.run.mockImplementation(function * () {
        yield mockTextResult1
        yield mockOptionsResult
        yield mockTextResult2
        yield mockTextResult3
      })
    })

    test('should set currentNode to an Options object with the text attached', () => {
      const wrappedRunner = new YarnWrapped({})
      expect(wrappedRunner.currentNode).toEqual({ ...mockOptionsResult, ...mockTextResult1 })
      expect(wrappedRunner.currentNode).toBeInstanceOf(bondage.OptionsResult)
    })

    test('should not set currentNode to an Options object with the text attached if combineTextAndOptionNodes is false', () => {
      const wrappedRunner = new YarnWrapped({ combineTextAndOptionNodes: false })
      expect(wrappedRunner.currentNode).toBe(mockTextResult1)
      wrappedRunner.advance()
      expect(wrappedRunner.currentNode).toBe(mockOptionsResult)
    })

    test('should select the option with the index passed in, if there is one', () => {
      const wrappedRunner = new YarnWrapped({})
      const currentNode = wrappedRunner.currentNode
      jest.spyOn(currentNode, 'select')
      wrappedRunner.advance(1)
      expect(currentNode.select).toHaveBeenCalledWith(1)
      expect(wrappedRunner.currentNode).toBe(mockTextResult2)
    })
  })

  describe('where next nodes are CommandResults followed by TextResults', () => {
    beforeAll(() => {
      bondage.Runner.prototype.run.mockImplementation(function * () {
        yield mockCommandResult1
        yield mockCommandResult2
        yield mockTextResult1
        yield mockTextResult2
      })
    })

    test('should set currentNode to the next non-command result', () => {
      const wrappedRunner = new YarnWrapped({})
      expect(wrappedRunner.currentNode).toBe(mockTextResult1)
    })

    test('should call the command handler with the correct arguments for each command result', () => {
      const handleCommand = jest.fn()
      new YarnWrapped({ handleCommand })
      expect(handleCommand).toHaveBeenNthCalledWith(1, {
        name: mockCommandName1,
        args: mockCommandArgs1
      })
      expect(handleCommand).toHaveBeenNthCalledWith(2, {
        name: mockCommandName2,
        args: mockCommandArgs2
      })
    })
  })

  describe('when dialogue ends', () => {
    beforeAll(() => {
      bondage.Runner.prototype.run.mockImplementation(function * () {
        yield mockTextResult1
      })
    })

    test('should include an "isDialogueEnd" property on the currentNode', () => {
      const wrappedRunner = new YarnWrapped({})
      expect(wrappedRunner.currentNode).toEqual({ ...mockTextResult1, isDialogueEnd: true })
    })

    test('should call the onDialogueEnd handler, if provided', () => {
      const onDialogueEnd = jest.fn()
      new YarnWrapped({ onDialogueEnd })
      expect(onDialogueEnd).toHaveBeenCalled()
    })
  })
})
