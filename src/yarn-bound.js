import yarnParser from './yarn-parser/src/index'
import parseLine from './line-parser'

export default class YarnBound {
  constructor ({
    dialogue,
    variableStorage,
    functions,
    handleCommand,
    combineTextAndOptionsResults,
    locale,
    startAt = 'Start'
  }) {
    this.handleCommand = handleCommand
    this.combineTextAndOptionsResults = combineTextAndOptionsResults
    this.yarnParser = yarnParser
    this.bufferedNode = null
    this.currentResult = null
    this.history = []
    this.locale = locale
    this.runner = new yarnParser.Runner()
    this.runner.noEscape = true

    this.runner.load(dialogue)

    if (variableStorage) {
      variableStorage.display = variableStorage.display || variableStorage.get
      this.runner.setVariableStorage(variableStorage)
    }
    if (functions) {
      Object.entries(functions).forEach((entry) => {
        this.registerFunction(...entry)
      })
    }

    this.jump(startAt)
  }

  jump (startAt) {
    this.generator = this.runner.run(startAt)
    this.advance()
  }

  advance (optionIndex) {
    if (
      typeof optionIndex !== 'undefined' &&
        this.currentResult &&
        this.currentResult.select
    ) {
      this.currentResult.select(optionIndex)
    }

    let next = this.bufferedNode || this.generator.next().value
    let buffered = null

    // We either return the command as normal or, if a handler
    // is supplied, use that and don't bother the consuming app
    if (this.handleCommand) {
      while (next instanceof yarnParser.CommandResult) {
        this.handleCommand(next)
        next = this.generator.next().value
      }
    }

    // Lookahead for combining text + options, and for end of dialogue.
    // Can't look ahead of option nodes (what would you look ahead at?)
    if (!(next instanceof yarnParser.OptionsResult)) {
      const upcoming = this.generator.next()
      buffered = upcoming.value
      if (
        next instanceof yarnParser.TextResult &&
        this.combineTextAndOptionsResults &&
          buffered instanceof yarnParser.OptionsResult
      ) {
        next = Object.assign(buffered, next)
        buffered = null
      } else if (next && upcoming.done) {
        next = Object.assign(next, { isDialogueEnd: true })
      }
    }

    if (this.currentResult) {
      this.history.push(this.currentResult)
    }

    if (next instanceof yarnParser.TextResult) {
      parseLine(next, this.locale)
    } else if (next instanceof yarnParser.OptionsResult) {
      if (next.text) {
        parseLine(next, this.locale)
      }
      next.options.forEach((option) => {
        parseLine(option, this.locale)
      })
    }

    this.currentResult = next
    this.bufferedNode = buffered
  }

  registerFunction (name, func) {
    this.runner.registerFunction(name, func)
  }
}
