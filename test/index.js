const expect = require('chai').expect
const MockAdapter = require('../index.js')
const Module = require('module')

const Robot = require('hubot/es2015').Robot
const TextMessage = require('hubot').TextMessage

// Hook into Node's module loading system to return a mock from require
const originalRequire = Module.prototype.require
const hookModuleToReturnMockFromRequire = (module, mock) => {
  Module.prototype.require = function() {
    if (arguments[0] === module) {
      return mock
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
    beforeEach(done => {
        // hook into require to return our mock adapter
        hookModuleToReturnMockFromRequire('hubot-mock-adapter', MockAdapter)

        // create new robot, without http, using the mock adapter
        robot = new Robot('hubot-mock-adapter', false, 'Eddie')

        // start adapter
        robot.loadAdapter().then(() => {
            // Hubot will load scripts from the scripts folder, but since we don't have one
            // let's just define a simple script here
            robot.respond(/Computer\!/, msg => {
                msg.reply('Why hello there!')
            })
            
            // If you want to load the module under test and it's in a directory just aboe this file
            // you can do something like this:
            // require('../index.js')(robot)

            robot.adapter.on('connected', () => {
                // create a user
                user = robot.brain.userForId('1', {
                    name: 'mocha',
                    room: '#mocha',
                })
                adapter = robot.adapter
                done()
            })

            // start the bot
            robot.run()
        }).catch(console.error)
    })

    afterEach(function () {
        robot.shutdown()
        restoreModuleRequire()
    })

    it('responds when greeted', done => {
        // here's where the magic happens!
        adapter.on('reply', (envelope, strings) => {
            expect(strings[0]).match(/Why hello there/)
            done()
        })
        adapter.receive(new TextMessage(user, '@Eddie Computer!'))
    })
})
