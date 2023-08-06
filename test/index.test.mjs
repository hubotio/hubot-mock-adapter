import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import Robot from 'hubot/src/robot.js'
import { TextMessage } from 'hubot/src/message.js'
import MockAdapter from '../index.js'
import Module from 'module'

// Hook into Node's module loading system to return a mock from require
let originalRequire = Module.prototype.require
const hookModuleToReturnMockFromRequire = (module, mock) => {
  Module.prototype.require = function() {
    if (arguments[0] === module) {
      return mock;
    }
    return originalRequire.apply(this, arguments)
  }
}
const restoreModuleRequire = () => {
  Module.prototype.require = originalRequire
}

describe('Eddie the shipboard computer', () => {
  let robot
  let user
  let adapter

  beforeEach((t, done) => {
    // hook into require to return our mock adapter
    hookModuleToReturnMockFromRequire('hubot-mock-adapter', MockAdapter)

    // create new robot, without http, using the mock adapter
    robot = new Robot('hubot-mock-adapter', false, 'Eddie')

    // load adapter the specified adapter during creation
    // Note: you can also specify a file to load an adapter from
    robot.loadAdapter().then(() => {
      robot.adapter.on('connected', () => {
        // create a user
        user = robot.brain.userForId("1", {
          name: 'tester',
          room: '#test-room'
        })
        adapter = robot.adapter
        done()
      })
      robot.run()
    }).catch(console.error)
  })

  afterEach(() => {
    robot.shutdown()
    restoreModuleRequire()
  })

  it('responds when greeted with a Direct Message', (t, done) => {
    robot.respond(/Computer\!/, msg => {
      msg.reply('Why hello there!')
    })

    // here's where the magic happens!
    robot.adapter.on('reply', (envelope, strings) => {
      assert.deepEqual(strings[0], 'Why hello there!')
      done()
    })
    robot.receive(new TextMessage(user, '@Eddie Computer!'))
  })
})
