**WIP**

# What is YarnWrapped?

YarnWrapped is a quality-of-life wrapper around bondage.js, a javascript parser for the [Yarn language](https://yarnspinner.dev/).

Yarn is a language for writing dialogue trees.

The added quality-of-life features are:
  - Support yarn format (text string rather than a json)
  - Run a custom command handler function when generic commands are encountered
  - A lookahead which enables:
    - return text and subsequent options block together (optional, on by default)
    - include an `isDialogueEnd` property with the last node in a dialogue


# What version of bondage.js does this use?

YarnWrapped is a wrapper around a specific [forked version of bondage.js](https://github.com/mnbroatch/bondage.js).

This is a fork of [another fork](https://github.com/alforno/bondage.js), which added support for inline expressions. The mnbroatch version fixes some bugs with that implementation and migrates the syntax toward Yarn 2.0 .

Development around the [original project](https://github.com/hylyh/bondage.js) has slowed and issues/PRs have been rotting, hence the parallel development.


# What limitations still remain?

Here is a non-exhaustive list of bugs and unsupported yarn features in the version of bondage.js being used:

- No #hashtags
- No arbitrary:metadata
- No // comments
