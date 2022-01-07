import bondage from '@mnbroatch/bondage'

export default class YarnWrapped {
  constructor ({
    dialogue,
    variableStorage,
    functions,
    handleCommand,
    onDialogueEnd,
    combineTextAndOptionNodes,
    startAt = 'Start'
  }) {
    this.handleCommand = handleCommand
    this.onDialogueEnd = onDialogueEnd
    this.combineTextAndOptionNodes = combineTextAndOptionNodes
    this.bondage = bondage
    this.bufferedNode = null
    this.currentNode = null

    const runner = new bondage.Runner()
    runner.load(dialogue)
    if (variableStorage) {
      variableStorage.display = variableStorage.display || variableStorage.get
      runner.setVariableStorage(variableStorage)
    }
    if (functions) {
      Object.entries(functions).forEach((entry) => {
        runner.registerFunction(...entry)
      })
    }

    this.generator = runner.run(startAt)
    this.advance()
  }

  advance (optionIndex) {
    if (
      typeof optionIndex !== 'undefined' &&
        this.currentNode &&
        this.currentNode.select
    ) {
      this.currentNode.select(optionIndex)
    }

    let next = this.bufferedNode || this.generator.next().value
    let buffered = null

    // We either return the command as normal or, if a handler
    // is supplied, use that and don't bother the consuming app
    if (this.handleCommand) {
      while (next instanceof bondage.CommandResult) {
        this.handleCommand(next)
        next = this.generator.next().value
      }
    }

    // Lookahead for combining text + options, and for end of dialogue.
    // Can't look ahead of option nodes (what would you look ahead at?)
    if (next instanceof bondage.TextResult) {
      const upcoming = this.generator.next()
      buffered = upcoming.value
      if (
        this.combineTextAndOptionNodes &&
          buffered instanceof bondage.OptionsResult
      ) {
        next = Object.assign(buffered, next)
        buffered = null
      } else if (upcoming.done) {
        next = Object.assign(next, { isDialogueEnd: true })
      }
    }

    this.currentNode = next
    this.bufferedNode = buffered
    if (this.currentNode.isDialogueEnd && this.onDialogueEnd) {
      this.onDialogueEnd()
    }
  }
}
