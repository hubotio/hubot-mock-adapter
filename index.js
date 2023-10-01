'use strict';

const Adapter = require('hubot/es2015').Adapter;

class MockAdapter extends Adapter {
  async send (envelope/* , ...strings */) {
    const strings = [].slice.call(arguments, 1);
    this.emit('send', envelope, strings);
  }
  async reply (envelope/* , ...strings */) {
    const strings = [].slice.call(arguments, 1);
    this.emit('reply', envelope, strings);
  }
  async topic (envelope/* , ...strings */) {
    const strings = [].slice.call(arguments, 1);
    this.emit('topic', envelope, strings);
  }
  async play (envelope/* , ...strings */) {
    const strings = [].slice.call(arguments, 1);
    this.emit('play', envelope, strings);
  }
  async run () {
    this.emit('connected');
  }
  close () {
    this.emit('closed');
  }
}

module.exports.use = robot => new MockAdapter(robot);
