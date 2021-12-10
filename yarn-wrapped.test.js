const YarnWrapped = require('./src/yarn-wrapped')

describe('constructor', () => {
  test('should set combineTextAndOptionNodes true by default', () => {
    const runner = new YarnWrapped()
    expect(runner.combineTextAndOptionNodes).toBe(true)
  })
  test('should set combineTextAndOptionNodes false if specified', () => {
    const runner = new YarnWrapped({
      combineTextAndOptionNodes: false
    })
    expect(runner.combineTextAndOptionNodes).toBe(false)
  })
  test('should set a default handleCommand function', () => {
    const runner = new YarnWrapped()
    expect(runner.handleCommand).toBe(true)
  })
  test('should set a custom handleCommand function', () => {
    const handleCommand = jest.fn()
    const runner = new YarnWrapped({ handleCommand })
    expect(runner.handleCommand).toBe(handleCommand)
  })
})

