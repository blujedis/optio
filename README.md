# Replite

Very trivial tool for prompting user for input or creating simple REPL. If you need a real prompting solution for say installs where checkboxes and lists are reqired I would head over to [Inquirer](https://www.npmjs.com/package/inquirer). It's far more complete. You might also check out [Enquirer](https://www.npmjs.com/package/enquirer)

Replite was created as a bare bones prompting tool for just the basics. Simple, largely a single file it works as intended.

## Getting Started

Install the package with your favorite package manager.

```sh
npm install replite
```

```sh
yarn add replite
```

## Usage (Prompt)

Adding prompts or questions.

```ts
import replite from 'replite';

replite.query({
  key: 'some_unique_key',
  text: 'Enter source path',
  next: 'next_event_key_to_run' // if undefined next index is used.
  action: (answer) => {
    // Valid return values:
    // False - will cause a generic validation error to be thrown.
    // True - the next query/prompt is executed.
    // QueryEvent - when question object is returned it is run.
    // throw - if you throw an error it will be caught.
  }
})
.then(answers => {
  // do something with all your responses.
})
```

## Usage (REPL)

This can be use to create your own little utility that accepts command. There are a couple build in commands:

**:clear** - clears the screen.
**:exit** - exits your cli.
**:quit** - alias for above.

```ts
replite.command({
  key: 'some_unique_key',
  next: 'next_event_key_to_run', // optional next command to run.
  action: (...args) => {
    // Same values as above can be returned.
    // The args here are any values AFTER the
    // command name that's detected.
    // Exmaple:
    // replite> install mypkg --force
    // Above args would equal ['mypkg', '--force']
  }
})

replite.repl();
```
