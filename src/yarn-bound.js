import bondage from '@mnbroatch/bondage/src/index.js'
import parseLine from './line-parser'

export default class YarnBound {
  constructor ({
    dialogue,
    variableStorage,
    functions,
    handleCommand,
    combineTextAndOptionsResults,
    locale,
    pauseCommand = 'pause',
    startAt = 'Start'
  }) {
    this.handleCommand = handleCommand
    this.pauseCommand = pauseCommand
    this.combineTextAndOptionsResults = combineTextAndOptionsResults
    this.bondage = bondage
    this.bufferedNode = null
    this.currentResult = null
    this.history = []
    this.locale = locale
    this.runner = new bondage.Runner()
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
    this.bufferedNode = null
    this.advance()
  }

  advance (optionIndex) {
    this.runner.queuedOperations.forEach(c => { c() })
    this.runner.queuedOperations = []

    if (
      typeof optionIndex !== 'undefined' &&
        this.currentResult &&
        this.currentResult.select
    ) {
      this.currentResult.select(optionIndex)
    }

    let next = this.bufferedNode || this.generator.next().value
    let buffered = null

    if (this.handleCommand) {
      this.runner.shouldQueueAssignments = true
      while (next instanceof bondage.CommandResult && next.command !== this.pauseCommand) {
        this.handleCommand(next)
        const nextIteratorResult = this.generator.next()
        next = nextIteratorResult.value
      }
      this.runner.shouldQueueAssignments = false
    }

    // Lookahead for combining text + options, and for end of dialogue.
    // Can't look ahead of option nodes (what would you look ahead at?)
    // Don't look ahead if on pause node
    if (
      !(next instanceof bondage.OptionsResult) &&
      !(next && next.command === this.pauseCommand)
    ) {
      let upcoming = this.generator.next()
      // If we're not returning command nodes, the last non-command node should have
      // isDialogueEnd. The queue lets us do extra looking ahead for that, without
      // prematurely handling commands.
      if (this.handleCommand) {
        this.runner.shouldQueueAssignments = true
        while (upcoming.value && upcoming.value instanceof bondage.CommandResult && upcoming.value.command !== this.pauseCommand) {
          const upcomingValue = upcoming.value
          this.runner.queuedOperations.push(() => { this.handleCommand(upcomingValue) })
          upcoming = this.generator.next()
          if (upcoming.done) {
            this.runner.queuedOperations.forEach(c => { c() })
            this.runner.queuedOperations = []
            next = Object.assign(next, { isDialogueEnd: true })
          }
        }
        this.runner.shouldQueueAssignments = false
      }

      buffered = upcoming.value

      if (
        next instanceof bondage.TextResult &&
        this.combineTextAndOptionsResults &&
          buffered instanceof bondage.OptionsResult
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

    if (next instanceof bondage.TextResult) {
      parseLine(next, this.locale)
    } else if (next instanceof bondage.OptionsResult) {
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
