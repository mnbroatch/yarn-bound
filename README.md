**WIP do not use**

# What is YarnWrapped?

YarnWrapped is a quality-of-life wrapper around bondage.js, a javascript parser for the [Yarn language](https://yarnspinner.dev/).

Yarn is a language for writing dialogue trees.

The added quality-of-life features are:
  - Support yarn format (text string rather than a json)
  - Run a custom command handler function when generic commands are encountered
  - A lookahead which enables:
    - return text and subsequent options block together (optional)
    - include an `isDialogueEnd` property with the last node in a dialogue


# What version of bondage.js does this use?

YarnWrapped is a wrapper around a specific [forked version of bondage.js](https://github.com/mnbroatch/bondage.js).

This is a fork of [another fork](https://github.com/alforno/bondage.js), which added support for inline expressions. The mnbroatch version fixes some bugs with that implementation and migrates the syntax to Yarn 2.0

