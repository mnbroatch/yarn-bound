# What is YarnBound?

[Yarn](https://yarnspinner.dev/) is a language for writing dialogue trees.

YarnBound attempts to be the simplest way to use the Yarn language in the context of a javascript application. It is a wrapper around a specific [forked version of bondage.js](https://github.com/mnbroatch/bondage.js), where effort has been made to comply with the [Yarn 2.0 spec](https://github.com/YarnSpinnerTool/YarnSpinner/blob/9275277f50a6acbe8438b29596acc8527cf5581a/Documentation/Yarn-Spec.md).

Quality-of-life features on top of bondage.js:
  - A simpler API 
  - Option to return text and a subsequent options block together as one result
  - Option to run a custom command handler function instead of return command node
  - Option to run an `onDialogueEnd` callback when the dialogue ends
  - include an `isDialogueEnd` property with the last node in a dialogue

A live demo is under development.


# Missing features:

There are features in the Yarn docs that are not present in the [Yarn language spec](https://github.com/YarnSpinnerTool/YarnSpinner/blob/9275277f50a6acbe8438b29596acc8527cf5581a/Documentation/Yarn-Spec.md). These have not yet been implemented. Known examples are:
  - `Character: some text` annotation
  - `[b]Markup[/b]`
  

# Usage

For information on how to write Yarn, visit the [official documentation](https://docs.yarnspinner.dev/).

The examples below illustrate how `YarnBound` in particular works:


### Basic Dialogue

```javascript
import bondage from 'bondage'; // or whatever import method

// bondage.js strips empty lines, but make sure lines have
// no leading whitespace!
const dialogue = ` 
# someFiletag
title: StartingNode
someTag: someTag
---
This is another line of text.#someHashtag
===
`

const runner = new bondage.Runner()
runner.load(dialogue)
const generator = runner.run('StartingNode')
let node = generator.next().value
```

If we log out `node` after the last line above, we will see this object structure:

```javascript
{
  "text": "This is a line of text.",
  "hashtags": [],
  "metadata": {
    "title": "StartingNode",
    "someTag": "someTag",
    "filetags": [
      "someFiletag"
    ]
  }
}
```

to continue, we call

```javascript
node = generator.next().value
```

again, and if we log the new node, we see:

```javascript
{
  "text": "This is another line of text.",
  "hashtags": [
    "someHashtag"
  ],
  "metadata": {
    "title": "StartingNode",
    "someTag": "someTag",
    "filetags": [
      "someFiletag"
    ]
  }
}
```

If we had jumped, we would see the new node's metadata under the `metadata` property.

Notice that hashtags at the end of the line go in a `hashtags` array, and filetags (hashtags at the beginning of the dialogue) are on every node's `metadata` along with node-specific header tags.


### Options

Given this dialogue:

```
# someFiletag
title: StartingNode
someTag: someTag
---
What color do you like?
-> Red
  You picked Red!
-> Blue
  You picked Blue!
===
```

We can start the dialogue runner like above.

```javascript
const runner = new bondage.Runner()
runner.load(dialogue)
const generator = runner.run('StartingNode')
let node = generator.next().value
```

which will give us a text result like the last example. However, the next node we get from calling `generator.next().value` will be:

```javascript
{
  "options": [
    {
      "text": "Red",
      "isAvailable": true,
      "hashtags": []
    },
    {
      "text": "Blue",
      "isAvailable": true,
      "hashtags": []
    }
  ],
  "metadata": {
    "title": "StartingNode",
    "someTag": "someTag",
    "filetags": [
      "someFiletag"
    ]
  }
}
```

In order to continue the dialogue, you will need to call

```javascript
node.select(0);
node = generator.next().value
```

in order to move to the line with text, "You picked Red!"

But how will your view layer know whether you're looking at a text result or an options result? Use `instanceof`:

`node instanceof bondage.TextResult`

`node instanceof bondage.OptionsResult`

`node instanceof bondage.CommandResult`

Speaking of CommandResult...


# Commands

The third and last result type you need to know about is CommandResult. Given this dialogue:

```
# someFiletag
title: StartingNode
someTag: someTag
---
Sending a command...
<<someCommand someArg someOtherArg>>
===
```

You will see a "Sending a command..." TextResult, but the next node will look like this:


```javascript
{
  "name": "someCommand",
  "args": [
    "someArg",
    "someOtherArg"
  ],
  "hashtags": [],
  "metadata": {
    "title": "StartingNode",
    "someTag": "someTag",
    "filetags": [
      "someFiletag"
    ]
  }
}
```

Your program can do what it wants with that, then call `generator.next().value` to get the next node, as usual.


### Custom Variable Storage

Bondage keeps track of variables internally. Optionally, you can supply your own variableStorage. variableStorage is an object with get() and set() methods defined.

```javascript
const customStorage = new Map()
customStorage.set('hello', 1)

const runner = new bondage.Runner()
runner.setVariableStorage(customStorage)
runner.load(dialogue)
```

**Call setVariableStorage BEFORE loading a dialogue with `runner.load`. This is because `declare` commands will resolve when the dialogue loads (as opposed to when `runner.run()` is called)** 

Above, we set an initial value for the `hello` variable, so if a line of dialogue contains `{$hello}`, it will show the number `1`, no need to call `<<set $hello = 1>>`.

Simple dialogues can probably just use the built-in storage.


### Functions

You can also register functions to be used in your dialogue.

```javascript
runner.registerFunction('sayHello', () => 'hello')
```

If a line of dialogue contains `{sayHello()}`, it will show `hello`.


### Object Input Format

In addition to the regular yarn format as a string, bondage also accepts a javascript object. This is an intermediary format exported by some utilities. The text format is nicer to work with, so it should be preferred. For reference,

```
#someFiletag
#someOtherFiletag
title: SomeNode
tags: hello
arbitraryKey: arbitraryValue
---
This is a line of text
<<jump SomeOtherNode>>
===

title: SomeOtherNode
---
This is another line of text.
===
```

is equivalent to:

```javascript
[
  {
    "title": "SomeNode",
    "tags": "hello",
    "arbitraryKey": "arbitraryValue",
    "body": "This is a line of text\n<<jump SomeOtherNode>>\n",
    "filetags": [
      "someFiletag",
      "someOtherFiletag"
    ]
  },
  {
    "title": "SomeOtherNode",
    "body": "This is another line of text.\n",
    "filetags": [
      "someFiletag",
      "someOtherFiletag"
    ]
  }
]
```



