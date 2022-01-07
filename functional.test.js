/* eslint-env jest */

import YarnWrapped from './index'
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
    const yarnWrapped = new YarnWrapped({ dialogue })
    expect(yarnWrapped.currentNode.text).toBe('I am a line')
    yarnWrapped.advance()
    expect(yarnWrapped.currentNode.text).toBe('1 + 1 is 2')
    yarnWrapped.advance()
    expect(yarnWrapped.currentNode.options).toEqual(
      new OptionsResult([
        { text: 'I should be disabled', isAvailable: false },
        { text: 'I am a choice' },
        { text: 'I am another choice' }
      ]).options
    )
    yarnWrapped.advance(2)
    expect(yarnWrapped.currentNode.text).toBe('I am the node after a choice')
  })
})
