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
  test('should set a custom handleCommand function', () => {
  })
  test('should set a custom handleCommand function', () => {
    const runner = new YarnWrapped()
    expect(runner.).toBe(true)
  })
  test('should set a default onDialogueEnd function', () => {
  })
  test('should set a custom onDialogueEnd function', () => {
  })
})

