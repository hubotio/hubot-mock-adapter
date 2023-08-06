# Mock adapter for unit-testing Hubot

![Pipeline Status](https://github.com/hubotio/hubot-mock-adapter/actions/workflows/pipeline.yml/badge.svg)

I've whacked together a couple of Hubot scripts, but then they started getting
more complicated. TDD is really the ONLY way to do any kind of meaningful
development. But even if you're not TDD'ing, you _are_ testing, right?
_Right_?

I couldn't find an existing method for writing unit tests for Hubot scripts.
After digging around under Hubot's hood, I figured out all I really needed was
an `Adapter` implementation I could spy on. That is what you see here.

## Example Usage

Let's assume you've got a really simple script, like this:

```js
module.exports = function (robot) {
  robot.hear(/Computer!/, function (msg) {
    msg.reply("Why hello there! (ticker tape, ticker tape)");
  });
};
```

### Node Test Runner

Create a test file in a folder. e.g. [index.test.mjs](test/index.test.mjs).

You'll need a Node version > 17.

Assuming your tests are in `test/` or have `.test.` before the file extension, just run `node --test`. For less typing, in your `package.json`, add a `test` script:

```json
"scripts": {
  "test": "node --test"
}
```

Then you can use `npm test` to run your tests!

### Mocha

Create a test file in a folder. e.g. [index.js](test/index.js).

You'll need `devDependencies` something like this in your `package.json`:

```js
"devDependencies": {
  "coffeescript": "^2.7.0",
  "chai": "^4.3.7",
  "hubot-mock-adapter": "^1.x.x",
  "mocha": "^10.2.0",
  "hubot": "^7.x.x",
}
```

Assuming your tests are in `test/`, just run `node_modules/.bin/mocha --exit`. For less typing, in your `package.json`, add a `test` script:

```json
"scripts": {
  "test": "mocha --exit"
}
```

Then you can use `npm test` to run your tests!
