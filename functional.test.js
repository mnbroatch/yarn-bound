/* eslint-env jest */

import YarnBound from './src/index'
import bondage from '@mnbroatch/bondage/src/index'
const { OptionsResult } = bondage

describe('functional test', () => {
  test('should load a dialogue object into the runner', () => {
    const dialogue = `
      title:Start
      ---
      Char: \\\\I am a l\\ine
      1 + 1 is {1 + 1}
      -> I should be disabled<<if false is true>>
        X
      -> I am a choice
        I am the line after a choice
      -> I am another choice
        Cool
      I am the line after the choices
      <<stop>>
      I should be ignored
      ===
    `

    const runner = new YarnBound({ dialogue })
    expect(runner.currentResult.text).toBe('\\I am a line')
    runner.advance()
    expect(runner.currentResult.text).toBe('1 + 1 is 2')
    runner.advance()
    expect(runner.currentResult.options).toEqual(
      new OptionsResult([
        { text: 'I should be disabled', isAvailable: false },
        { text: 'I am a choice' },
        { text: 'I am another choice' }
      ]).options.map((option) => ({ ...option, markup: [] }))
    )
    runner.advance(1)
    expect(runner.currentResult.text).toBe('I am the line after a choice')
    runner.advance()
    expect(runner.currentResult.text).toBe('I am the line after the choices')
    expect(runner.currentResult.isDialogueEnd).toBe(true)
  })

  test('Should do its best with a dialogue that ends in a conditional that depends on a variable being set before it', () => {
    const dialogue = `
      title:Start
      ---
      <<set $a = 100>>
      Hello {$a}
      <<command1>>
      <<set $a = 1>>
      <<command2 {$a}>>
      <<if $a == 1>>
        Goodbye {$a}
      <<endif>>
      ===
    `

    const handleCommand = jest.fn()
    const runner = new YarnBound({ dialogue, handleCommand })
    expect(runner.currentResult.text).toBe('Hello 100')
    expect(runner.currentResult.isDialogueEnd).not.toBeDefined()
    expect(handleCommand.mock.calls[0][0].command).toBe('command1')

    // unavoidable bad behavior of handling this command prematurely
    expect(handleCommand.mock.calls[1][0].command).toBe('command2 1')

    runner.advance()
    expect(runner.currentResult.text).toBe('Goodbye 1')
    expect(runner.currentResult.isDialogueEnd).toBe(true)
  })
})
