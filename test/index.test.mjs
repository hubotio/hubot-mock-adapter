import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import Robot from 'hubot/src/robot.js'
import { TextMessage } from 'hubot/src/message.js'

describe('Eddie the shipboard computer', () => {
  let robot
  let user
  let adapter

  beforeEach(async () => {
    // create new robot, without http, using the mock adapter
    robot = new Robot('hubot-mock-adapter', false, 'Eddie')
    await robot.loadAdapter('./index.js')
    robot.adapter.on('connected', () => {
      // create a user
      user = robot.brain.userForId("1", {
        name: 'tester',
        room: '#test-room'
      })
      adapter = robot.adapter
    })
    await robot.run()
  })

  afterEach(() => {
    robot.shutdown()
  })

  it('responds when greeted with a Direct Message', async () => {
    robot.respond(/Computer\!/, async msg => {
      await msg.reply('Why hello there!')
    })
    let wasCalled = false
    robot.adapter.on('reply', (envelope, strings) => {
      assert.deepEqual(strings[0], 'Why hello there!')
      wasCalled = true
    })
    await robot.receive(new TextMessage(user, '@Eddie Computer!'))
    assert.deepEqual(wasCalled, true)
  })
})
