import bondage from '@mnbroatch/bondage'

export default class YarnWrapped {
  constructor ({
    dialogue,
    variableStorage,
    functions,
    handleCommand,
    onDialogueEnd,
    combineTextAndOptionNodes = true,
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

    while (next instanceof bondage.CommandResult) {
      if (this.handleCommand) this.handleCommand(next)
      next = this.generator.next().value
    }

    // Lookahead for combining text + options, and for end of dialogue.
    // Can't look ahead of option nodes (what would you look ahead at?)
    if (!(next instanceof bondage.OptionsResult)) {
      buffered = this.generator.next().value
      if (
        this.combineTextAndOptionNodes &&
          buffered instanceof bondage.OptionsResult
      ) {
        next = Object.assign(buffered, next)
        buffered = null
      } else if (!buffered) {
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
