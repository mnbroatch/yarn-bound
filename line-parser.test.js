/* eslint-env jest */
/* eslint-disable no-new */

import lineParser from './src/line-parser'
import YarnBound from './src/index'
const TextResult = YarnBound.TextResult

describe('line parser', () => {
  test('should handle a character', () => {
    const node = new TextResult('BillyBob: Yeehaw')
    lineParser(node)
    expect(node.text).toBe('Yeehaw')
    expect(node.markup).toEqual([
      { name: 'character', properties: { name: 'BillyBob' } }
    ])
  })

  test('should not recognize a character name with spaces', () => {
    const node = new TextResult('Billy Bob: Yeehaw')
    lineParser(node)
    expect(node.text).toBe('Billy Bob: Yeehaw')
    expect(node.markup).toEqual([])
  })

  test('should handle a markup tag', () => {
    const node = new TextResult('This is [someTag]the[/someTag] end')
    lineParser(node)
    expect(node.text).toBe('This is the end')
    expect(node.markup).toEqual([{
      name: 'someTag',
      properties: {},
      position: 8,
      length: 3
    }])
  })

  test('should handle nested markup tags', () => {
    const node = new TextResult('This [someTag someProp=true][otherTag]is the[/otherTag][/someTag] end')
    lineParser(node)
    expect(node.text).toBe('This is the end')
    expect(node.markup).toEqual([
      {
        name: 'otherTag',
        position: 5,
        length: 6,
        properties: {}
      },
      {
        name: 'someTag',
        position: 5,
        length: 6,
        properties: {
          someProp: true
        }
      }
    ])
  })

  test('should handle nested markup tags', () => {
    const node = new TextResult('This [someTag someProp=hello][otherTag]is[/otherTag] the[/someTag] end')
    lineParser(node)
    expect(node.text).toBe('This is the end')
    expect(node.markup).toEqual([
      {
        name: 'otherTag',
        properties: {},
        position: 5,
        length: 2
      },
      {
        name: 'someTag',
        position: 5,
        length: 6,
        properties: {
          someProp: 'hello'
        }
      }
    ])
  })

  test('should handle overlapping markup tags', () => {
    const node = new TextResult('This [someTag someProp="hello"][otherTag]is[/someTag] the[/otherTag] end')
    lineParser(node)
    expect(node.text).toBe('This is the end')
    expect(node.markup).toEqual([
      {
        name: 'someTag',
        position: 5,
        length: 2,
        properties: {
          someProp: 'hello'
        }
      },
      {
        name: 'otherTag',
        properties: {},
        position: 5,
        length: 6
      }
    ])
  })

  test('should handle a self closing markup tag', () => {
    const node = new TextResult('This is the [someTag someProp=1 /] end')
    lineParser(node)
    expect(node.text).toBe('This is the end')
    expect(node.markup).toEqual([{
      name: 'someTag',
      position: 12,
      length: 0,
      properties: {
        someProp: 1
      }
    }])
  })

  test('should handle a self closing markup tag with no whitespace', () => {
    const node = new TextResult('This is the [someTag/] end')
    lineParser(node)
    expect(node.text).toBe('This is the end')
    expect(node.markup).toEqual([{
      name: 'someTag',
      position: 12,
      length: 0,
      properties: {}
    }])
  })

  test('should handle a self closing markup tag with trimwhitespace false', () => {
    const node = new TextResult('This is the [someTag someProp=1 trimwhitespace=false /] end')
    lineParser(node)
    expect(node.text).toBe('This is the  end')
    expect(node.markup).toEqual([{
      name: 'someTag',
      position: 12,
      length: 0,
      properties: {
        someProp: 1
      }
    }])
  })

  test('should handle a close all tag', () => {
    const node = new TextResult('This [someTag someProp="hello"][otherTag]is the[/] end')
    lineParser(node)
    expect(node.text).toBe('This is the end')
    expect(node.markup).toEqual([
      {
        name: 'otherTag',
        properties: {},
        position: 5,
        length: 6
      },
      {
        name: 'someTag',
        position: 5,
        length: 6,
        properties: {
          someProp: 'hello'
        }
      }
    ])
  })

  test('should handle a shorthand markup tag', () => {
    const node = new TextResult('This is[stuff=1] the[/stuff] end')
    lineParser(node)
    expect(node.text).toBe('This is the end')
    expect(node.markup).toEqual([{
      name: 'stuff',
      position: 7,
      length: 4,
      properties: {
        stuff: 1
      }
    }])
  })

  test('should handle a nomarkup tag', () => {
    const node = new TextResult('[things /] This [nomarkup]is [stuff=1] the [/stuff] end[/nomarkup]')
    lineParser(node)
    expect(node.text).toBe('This is [stuff=1] the [/stuff] end')
    expect(node.markup).toEqual([{
      name: 'things',
      position: 0,
      length: 0,
      properties: {}
    }])
  })

  test('should handle escaped brackets', () => {
    const node = new TextResult('[realthings /] \\[fakethings/\\] This \\[[realstuff]is \\[fakestuff=1\\] the \\[/fakestuff\\] end[/realstuff]')
    lineParser(node)
    expect(node.text).toBe('[fakethings/] This [is [fakestuff=1] the [/fakestuff] end')
    expect(node.markup).toEqual([
      {
        name: 'realthings',
        position: 0,
        length: 0,
        properties: {}
      },
      {
        name: 'realstuff',
        position: 20,
        length: 37,
        properties: {}
      }
    ])
  })

  test('should handle a select markup tag', () => {
    const node = new TextResult('This is the [select value=morning morning="beginning" evening="end" /]')
    lineParser(node, { get: () => 'morning' })
    expect(node.text).toBe('This is the beginning')
    expect(node.markup).toEqual([])
  })

  test('should handle a plural markup tag', () => {
    const node = new TextResult('[plural value=27 one="This is" many="These are % of"] the [plural value=27 one="end" many="ends" /]')
    lineParser(node, 'ar-EG')
    expect(node.text).toBe('These are 27 of the ends')
    expect(node.markup).toEqual([])
  })

  test('should handle an ordinal markup tag', () => {
    const node = new TextResult('This is the [ordinal value=111 one="%st" two="%nd" few="%rd" other="%th" /] end')
    lineParser(node)
    expect(node.text).toBe('This is the 111th end')
    expect(node.markup).toEqual([])
  })

  test('should throw an error on invalid markup', () => {
    const node1 = new TextResult('BillyBob: [/unmatched]Yeehaw')
    const node2 = new TextResult('BillyBob: [blah=]Yeehaw')
    expect(() => { lineParser(node1) }).toThrow()
    expect(() => { lineParser(node2) }).toThrow()
  })
})
