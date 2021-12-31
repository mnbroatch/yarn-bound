/* eslint-env jest */

// WIP


import YarnWrapped from './src/yarn-wrapped'
import bondage from 'bondage'

describe('functional test', () => {
  const dialogue = `title:Start
---
I am a line
1 + 1 is {1 + 1}
-> I should not appear <<if false is true>>
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
    expect(yarnWrapped.currentNode.options).toBe(['I am a choice', 'I am another choice'])
    yarnWrapped.advance(1)
    expect(yarnWrapped.currentNode.text).toBe('I am the node after a choice')
  })
})
