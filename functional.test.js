/* eslint-env jest */

import YarnBound from './src/index'
import { OptionsResult } from '@mnbroatch/bondage'

describe('functional test', () => {
  const dialogue = `
title:Start
---
I am a line
1 + 1 is {1 + 1}
-> I should be disabled<<if false is true>>
  X
-> I am a choice
  oh
-> I am another choice
  I am the node after a choice
===
`

  test('should load a dialogue object into the runner', () => {
    const yarnBound = new YarnBound({ dialogue })
    expect(yarnBound.currentNode.text).toBe('I am a line')
    yarnBound.advance()
    expect(yarnBound.currentNode.text).toBe('1 + 1 is 2')
    yarnBound.advance()
    expect(yarnBound.currentNode.options).toEqual(
      new OptionsResult([
        { text: 'I should be disabled', isAvailable: false },
        { text: 'I am a choice' },
        { text: 'I am another choice' }
      ]).options
    )
    yarnBound.advance(2)
    expect(yarnBound.currentNode.text).toBe('I am the node after a choice')
  })
})
