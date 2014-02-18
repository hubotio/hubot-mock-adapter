# mock adapter for unit-testing Hubot

I've whacked together a couple of Hubot scripts, but then they started getting
more complicated.  TDD is really the ONLY way to do any kind of meaningful
development.  But even if you're not TDD'ing, you *are* testing, right?
_Right_?

I couldn't find an existing method for writing unit tests for Hubot scripts.
After digging around under Hubot's hood, I figured out all I really needed was
an `Adapter` implementation I could spy on.  That is what you see here.

## example usage

Let's assume you've got a really simple script, like this:

    module.exports = function(robot) {
        robot.hear(/Computer!/, function(msg) {
            msg.reply("Why hello there! (ticker tape, ticker tape)");
        });
    };

You want to test this, of course.  So create a Jasmine spec file:
    
    var path = require("path");
    
    describe("Eddie the shipboard computer", function() {
        var robot;
        var user;
        var adapter;
        
        beforeEach(function() {
            var ready = false;
            
            runs(function() {
                // create new robot, without http, using the mock adapter
                robot = new Robot(null, "mock-adapter", false, "Eddie");
                
                robot.adapter.on("connected", function() {
                    // only load scripts we absolutely need, like auth.coffee
                    process.env.HUBOT_AUTH_ADMIN = "1";
                    robot.loadFile(
                        path.resolve(
                            path.join("node_modules/hubot/src/scripts")
                        ),
                        "auth.coffee"
                    );
                    
                    // load the module under test and configure it for the
                    // robot.  This is in place of external-scripts
                    require("../index")(robot);
                    
                    // create a user
                    user = robot.brain.userForId("1", {
                        name: "jasmine",
                        room: "#jasmine"
                    });
                    
                    adapter = robot.adapter;
                });
                
                robot.run();
            });
            
            waitsFor(function() {
                return ready;
            });
        });
        
        afterEach(function() {
            robot.shutdown();
        });
        
        it("responds when greeted", function(done) {
            // here's where the magic happens!
            adapter.on("reply", function(envelope, strings) {
                expect(strings[0]).toMatch("Why hello there");
                
                done();
            });
            
            adapter.receive(new TextMessage(user, "Computer!"));
        });
    });

That's (almost) all there is to it!

## firing up Jasmine

Assuming you're using [`jasmine-node`][jasmine-node] to run your tests, and your
tests are in `specs/`, just run `node_modules/.bin/jasmine-node --coffee specs`.
For less typing, in your `package.json`, add a `test` script:

    "scripts": {
        "test": "node_modules/.bin/jasmine-node --coffee --color specs/"
    }

Then you can use `npm test` to run your tests!

[jasmine-node]: https://github.com/mhevery/jasmine-node
