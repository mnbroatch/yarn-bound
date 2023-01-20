import YarnBound from './yarn-bound.js'
import yarnParser from './yarn-parser/src/index'
const { OptionsResult, TextResult, CommandResult } = yarnParser

YarnBound.OptionsResult = OptionsResult
YarnBound.TextResult = TextResult
YarnBound.CommandResult = CommandResult
export default YarnBound
