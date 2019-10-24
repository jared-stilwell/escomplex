'use strict'
var assert
var mockery
var spooks
var modulePath
assert = require('chai').assert
mockery = require('mockery')
spooks = require('spooks')
modulePath = '../src'
mockery.registerAllowable(modulePath)
mockery.registerAllowable('lodash.assign')
mockery.registerAllowable('lodash.negate')
mockery.registerAllowable('lodash.isstring')
mockery.registerAllowable('lodash.isobject')
mockery.registerAllowable('lodash.isnumber')
mockery.registerAllowable('lodash.isfunction')
mockery.registerAllowable('lodash.isnil')
mockery.registerAllowable('./node.js')
mockery.registerAllowable('./config')
mockery.registerAllowable('debug')
mockery.registerAllowable('./debug')
mockery.registerAllowable('tty')
mockery.registerAllowable('ms')
mockery.registerAllowable('util')
suite('index:', function () {
  var log
  var walker
  setup(function () {
    log = {}
    walker = {}
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    })
    mockery.registerMock('espree', {
      parse: spooks.fn({
        log: log,
        name: 'espree.parse',
        results: [
          'espree.parse result'
        ]
      })
    })
    mockery.registerMock('./walker', walker)
    mockery.registerMock('./core', {
      analyse: spooks.fn({
        log: log,
        name: 'core.analyse',
        results: [
          'core.analyse result'
        ]
      })
    })
  })
  teardown(function () {
    mockery.deregisterMock('espree')
    mockery.deregisterMock('./walker')
    mockery.deregisterMock('./core')
    mockery.disable()
    log = walker = undefined
  })
  test('require does not throw', function () {
    assert.doesNotThrow(function () {
      require(modulePath)
    })
  })
  test('require returns object', function () {
    assert.isObject(require(modulePath))
  })
  suite('require:', function () {
    var index
    setup(function () {
      index = require(modulePath)
    })
    teardown(function () {
      index = undefined
    })
    test('analyse function is exported', function () {
      assert.isFunction(index.analyse)
    })
    test('analyse does not throw', function () {
      assert.doesNotThrow(function () {
        index.analyse()
      })
    })
    test('espree.parse was not called', function () {
      assert.strictEqual(log.counts['espree.parse'], 0)
    })
    test('core.analyse was not called', function () {
      assert.strictEqual(log.counts['core.analyse'], 0)
    })
    suite('array source:', function () {
      var options
      var result
      setup(function () {
        options = {}
        result = index.analyse([
          {
            code: 'console.log("foo");',
            path: '/foo.js'
          },
          {
            code: '"bar";',
            path: '../bar.js'
          }
        ], options)
      })
      teardown(function () {
        options = result = undefined
      })
      test('espree.parse was called twice', function () {
        assert.strictEqual(log.counts['espree.parse'], 2)
      })
      test('espree.parse was passed two arguments first time', function () {
        assert.lengthOf(log.args['espree.parse'][0], 2)
      })
      test('espree.parse was given correct source first time', function () {
        assert.strictEqual(log.args['espree.parse'][0][0], 'console.log("foo");')
      })
      test('espree.parse was given correct options first time', function () {
        assert.isObject(log.args['espree.parse'][0][1])
        assert.isTrue(log.args['espree.parse'][0][1].loc)
        assert.equal(log.args['espree.parse'][0][1].ecmaVersion, 9)
        assert.lengthOf(Object.keys(log.args['espree.parse'][0][1]), 2)
      })
      test('espree.parse was passed two arguments second time', function () {
        assert.lengthOf(log.args['espree.parse'][1], 2)
      })
      test('espree.parse was given correct source second time', function () {
        assert.strictEqual(log.args['espree.parse'][1][0], '"bar";')
      })
      test('espree.parse was given correct options second time', function () {
        assert.isObject(log.args['espree.parse'][1][1])
        assert.isTrue(log.args['espree.parse'][1][1].loc)
        assert.equal(log.args['espree.parse'][1][1].ecmaVersion, 9)
        assert.lengthOf(Object.keys(log.args['espree.parse'][1][1]), 2)
      })
      test('core.analyse was called once', function () {
        assert.strictEqual(log.counts['core.analyse'], 1)
      })
      test('core.analyse was passed three arguments', function () {
        assert.lengthOf(log.args['core.analyse'][0], 3)
      })
      test('core.analyse was given correct asts', function () {
        assert.isArray(log.args['core.analyse'][0][0])
        assert.lengthOf(log.args['core.analyse'][0][0], 2)
        assert.isObject(log.args['core.analyse'][0][0][0])
        assert.strictEqual(log.args['core.analyse'][0][0][0].path, '/foo.js')
        assert.strictEqual(log.args['core.analyse'][0][0][0].ast, 'espree.parse result')
        assert.lengthOf(Object.keys(log.args['core.analyse'][0][0][0]), 2)
        assert.isObject(log.args['core.analyse'][0][0][1])
        assert.strictEqual(log.args['core.analyse'][0][0][1].path, '../bar.js')
        assert.strictEqual(log.args['core.analyse'][0][0][1].ast, 'espree.parse result')
        assert.lengthOf(Object.keys(log.args['core.analyse'][0][0][1]), 2)
      })
      test('core.analyse was given correct walker', function () {
        assert.strictEqual(log.args['core.analyse'][0][1], walker)
      })
      test('core.analyse was given correct options', function () {
        assert.strictEqual(log.args['core.analyse'][0][2], options)
      })
      test('correct result was returned', function () {
        assert.strictEqual(result, 'core.analyse result')
      })
    })
    suite('array source with bad code:', function () {
      var code
      setup(function () {
        mockery.deregisterMock('espree')
        mockery.disable()
        code = [
          {
            code: 'foo foo',
            path: '/foo.js'
          },
          {
            code: '"bar";',
            path: '../bar.js'
          }
        ]
        index = require(modulePath)
      })
      teardown(function () {
        code = undefined
      })
      test('throws an error with default options', function () {
        assert.throws(function () {
          index.analyse(code, {})
        }, '/foo.js: Unexpected token foo')
      })
      test('swallows error with options.ignoreErrors', function () {
        assert.doesNotThrow(function () {
          index.analyse(code, {
            ignoreErrors: true
          })
        })
      })
    })
    suite('string source:', function () {
      var options
      var result
      setup(function () {
        options = {}
        result = index.analyse('foo bar baz', options)
      })
      teardown(function () {
        options = result = undefined
      })
      test('espree.parse was called once', function () {
        assert.strictEqual(log.counts['espree.parse'], 1)
      })
      test('espree.parse was passed two arguments', function () {
        assert.lengthOf(log.args['espree.parse'][0], 2)
      })
      test('espree.parse was given correct source', function () {
        assert.strictEqual(log.args['espree.parse'][0][0], 'foo bar baz')
      })
      test('espree.parse was given correct options', function () {
        assert.isObject(log.args['espree.parse'][0][1])
        assert.isTrue(log.args['espree.parse'][0][1].loc)
        assert.equal(log.args['espree.parse'][0][1].ecmaVersion, 9)
        assert.lengthOf(Object.keys(log.args['espree.parse'][0][1]), 2)
      })
      test('core.analyse was called once', function () {
        assert.strictEqual(log.counts['core.analyse'], 1)
      })
      test('core.analyse was passed three arguments', function () {
        assert.lengthOf(log.args['core.analyse'][0], 3)
      })
      test('core.analyse was given correct ast', function () {
        assert.strictEqual(log.args['core.analyse'][0][0], 'espree.parse result')
      })
      test('core.analyse was given correct walker', function () {
        assert.strictEqual(log.args['core.analyse'][0][1], walker)
      })
      test('core.analyse was given correct options', function () {
        assert.strictEqual(log.args['core.analyse'][0][2], options)
      })
      test('correct result was returned', function () {
        assert.strictEqual(result, 'core.analyse result')
      })
    })
  })
})
