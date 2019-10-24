/* global require, suite, setup, teardown, test */
'use strict'
const assert = require('chai').assert
const _merge = require('lodash.merge')
const mozWalker = require('../src/walker')
const parsers = require('./helpers/parsers')
const modulePath = '../src/module'

function equal (actual, expected, digits) {
  return Math.abs(actual - expected) < Math.pow(10, digits * -1)
}

suite('module:', function () {
  test('require does not throw', function () {
    assert.doesNotThrow(function () {
      require(modulePath)
    })
  })
  test('require returns object', function () {
    assert.isObject(require(modulePath))
  })
  suite('require:', function () {
    var escomplex
    setup(function () {
      escomplex = require(modulePath)
    })
    teardown(function () {
      escomplex = undefined
    })
    test('analyse function is exported', function () {
      assert.isFunction(escomplex.analyse)
    })
    test('analyse does not throw with valid arguments', function () {
      assert.doesNotThrow(function () {
        escomplex.analyse({
          body: [],
          loc: {
            end: {
              line: 0
            },
            start: {
              line: 0
            }
          }
        }, mozWalker)
      })
    })
    test('analyse throws when ast has no body', function () {
      assert.throws(function () {
        escomplex.analyse({
          loc: {
            end: {
              line: 0
            },
            start: {
              line: 0
            }
          }
        }, mozWalker)
      })
    })
    test('analyse throws when ast is string', function () {
      assert.throws(function () {
        escomplex.analyse('console.log("foo");', mozWalker)
      })
    })
    test('analyse throws when ast is array', function () {
      assert.throws(function () {
        escomplex.analyse([], mozWalker)
      })
    })
    test('analyse returns object', function () {
      assert.isObject(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker))
    })
    test('analyse returns aggregate object', function () {
      assert.isObject(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).aggregate)
    })
    test('analyse returns aggregate lines of code property', function () {
      assert.isObject(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).aggregate.sloc)
    })
    test('analyse returns aggregate physical lines of code property', function () {
      assert.isNumber(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).aggregate.sloc.physical)
    })
    test('analyse returns aggregate logical lines of code property', function () {
      assert.isNumber(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).aggregate.sloc.logical)
    })
    test('analyse returns aggregate cyclomatic complexity property', function () {
      assert.isNumber(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).aggregate.cyclomatic)
    })
    test('analyse returns aggregate cyclomatic complexity density property', function () {
      assert.isNumber(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).aggregate.cyclomaticDensity)
    })
    test('analyse returns aggregate halstead property', function () {
      assert.isObject(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).aggregate.halstead)
    })
    test('analyse returns aggregate halstead operators property', function () {
      assert.isObject(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).aggregate.halstead.operators)
    })
    test('analyse returns aggregate halstead total operators property', function () {
      assert.isNumber(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).aggregate.halstead.operators.total)
    })
    test('analyse returns aggregate halstead distinct operators property', function () {
      assert.isNumber(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).aggregate.halstead.operators.distinct)
    })
    test('analyse returns aggregate halstead operator identifiers property', function () {
      assert.isArray(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).aggregate.halstead.operators.identifiers)
    })
    test('analyse returns aggregate halstead operands property', function () {
      assert.isObject(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).aggregate.halstead.operands)
    })
    test('analyse returns aggregate halstead total operands property', function () {
      assert.isNumber(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).aggregate.halstead.operands.total)
    })
    test('analyse returns aggregate halstead distinct operands property', function () {
      assert.isNumber(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).aggregate.halstead.operands.distinct)
    })
    test('analyse returns aggregate halstead operand identifiers property', function () {
      assert.isArray(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).aggregate.halstead.operands.identifiers)
    })
    test('analyse returns maintainability property', function () {
      assert.isNumber(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).maintainability)
    })
    test('analyse returns functions property', function () {
      assert.isArray(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).functions)
    })
    test('analyse returns dependencies property', function () {
      assert.isArray(escomplex.analyse({
        body: [],
        loc: {
          end: {
            line: 0
          },
          start: {
            line: 0
          }
        }
      }, mozWalker).dependencies)
    })
    parsers.forEach(function (parserName, parser, options) {
      suite('function call:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('parseInt("10", 10);', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct physical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.physical, 1)
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 1)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('aggregate has correct cyclomatic complexity density', function () {
          assert.strictEqual(report.aggregate.cyclomaticDensity, 100)
        })
        test('functions is empty', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 1)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 1)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
        test('aggregate has correct Halstead operator identifier length', function () {
          assert.lengthOf(report.aggregate.halstead.operators.identifiers, report.aggregate.halstead.operators.distinct)
        })
        test('aggregate has correct Halstead operand identifier length', function () {
          assert.lengthOf(report.aggregate.halstead.operands.identifiers, report.aggregate.halstead.operands.distinct)
        })
        test('aggregate has correct Halstead length', function () {
          assert.strictEqual(report.aggregate.halstead.length, 4)
        })
        test('aggregate has correct Halstead vocabulary', function () {
          assert.strictEqual(report.aggregate.halstead.vocabulary, 4)
        })
        test('aggregate has correct Halstead difficulty', function () {
          assert.strictEqual(report.aggregate.halstead.difficulty, 0.5)
        })
        test('aggregate has correct Halstead volume', function () {
          assert.strictEqual(report.aggregate.halstead.volume, 8)
        })
        test('aggregate has correct Halstead effort', function () {
          assert.strictEqual(report.aggregate.halstead.effort, 4)
        })
        test('aggregate has correct Halstead bugs', function () {
          assert.strictEqual(Math.round(report.aggregate.halstead.bugs), 0)
        })
        test('aggregate has correct Halstead time', function () {
          assert.strictEqual(Math.round(report.aggregate.halstead.time), 0)
        })
        test('maintainability index is correct', function () {
          assert.strictEqual(Math.round(report.maintainability), 166)
        })
        test('aggregate has correct parameter count', function () {
          assert.strictEqual(report.aggregate.params, 0)
        })
        test('mean logical LOC is correct', function () {
          assert.strictEqual(report.loc, 1)
        })
        test('mean cyclomatic complexity is correct', function () {
          assert.strictEqual(report.cyclomatic, 1)
        })
        test('mean Halstead effort is correct', function () {
          assert.strictEqual(report.effort, 4)
        })
        test('mean parameter count is correct', function () {
          assert.strictEqual(report.params, 0)
        })
        test('dependencies is correct', function () {
          assert.lengthOf(report.dependencies, 0)
        })
      })
      suite('function call inside tagged template literal:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse(`tag\`foo \${parseInt("10", 10)} bar\``, options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct physical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.physical, 1)
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 1)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('aggregate has correct cyclomatic complexity density', function () {
          assert.strictEqual(report.aggregate.cyclomaticDensity, 100)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 3)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 3)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
      })
      suite('await function call:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('async function foo() { await parseInt("10", 10); }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct physical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.physical, 1)
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 2)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('aggregate has correct cyclomatic complexity density', function () {
          assert.strictEqual(report.aggregate.cyclomaticDensity, 50)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 4)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 4)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 4)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 4)
        })
      })
      suite('yield function call:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('function *foo() { yield parseInt("10", 10); }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct physical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.physical, 1)
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 2)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('aggregate has correct cyclomatic complexity density', function () {
          assert.strictEqual(report.aggregate.cyclomaticDensity, 50)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 4)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 4)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 4)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 4)
        })
      })
      suite('spread function call:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('[...parseInt("10", 10)]', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct physical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.physical, 1)
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 1)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('aggregate has correct cyclomatic complexity density', function () {
          assert.strictEqual(report.aggregate.cyclomaticDensity, 100)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 3)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 3)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 4)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 4)
        })
      })
      suite('array destructure and rest operator:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('const [a, ...b] = parseInt("10", 10)', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct physical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.physical, 1)
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 1)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('aggregate has correct cyclomatic complexity density', function () {
          assert.strictEqual(report.aggregate.cyclomaticDensity, 100)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 5)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 5)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 5)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 5)
        })
      })
      suite('object destructure:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('const { a } = b', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct physical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.physical, 1)
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 1)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('aggregate has correct cyclomatic complexity density', function () {
          assert.strictEqual(report.aggregate.cyclomaticDensity, 100)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 3)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 3)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 2)
        })
      })
      suite('condition:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('if (true) { "foo"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct physical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.physical, 1)
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 2)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
        test('aggregate has correct cyclomatic complexity density', function () {
          assert.strictEqual(report.aggregate.cyclomaticDensity, 100)
        })
        test('functions is empty', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 1)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 1)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 2)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 2)
        })
        test('aggregate has correct Halstead operator identifier length', function () {
          assert.lengthOf(report.aggregate.halstead.operators.identifiers, report.aggregate.halstead.operators.distinct)
        })
        test('aggregate has correct Halstead operand identifier length', function () {
          assert.lengthOf(report.aggregate.halstead.operands.identifiers, report.aggregate.halstead.operands.distinct)
        })
        test('aggregate has correct Halstead length', function () {
          assert.strictEqual(report.aggregate.halstead.length, 3)
        })
        test('aggregate has correct Halstead vocabulary', function () {
          assert.strictEqual(report.aggregate.halstead.vocabulary, 3)
        })
        test('aggregate has correct Halstead difficulty', function () {
          assert.strictEqual(report.aggregate.halstead.difficulty, 0.5)
        })
        test('aggregate has correct Halstead volume', function () {
          assert.strictEqual(Math.round(report.aggregate.halstead.volume), 5)
        })
        test('aggregate has correct Halstead effort', function () {
          assert.strictEqual(Math.round(report.aggregate.halstead.effort), 2)
        })
        test('aggregate has correct Halstead bugs', function () {
          assert.strictEqual(Math.round(report.aggregate.halstead.bugs), 0)
        })
        test('aggregate has correct Halstead time', function () {
          assert.strictEqual(Math.round(report.aggregate.halstead.time), 0)
        })
        test('maintainability index is correct', function () {
          assert.strictEqual(Math.round(report.maintainability), 157)
        })
        test('mean logical LOC is correct', function () {
          assert.strictEqual(report.loc, 2)
        })
        test('mean cyclomatic complexity is correct', function () {
          assert.strictEqual(report.cyclomatic, 2)
        })
        test('mean Halstead effort is correct', function () {
          assert.ok(equal(report.effort, 2.377443751081734, 15))
        })
        test('mean parameter count is correct', function () {
          assert.strictEqual(report.params, 0)
        })
        test('dependencies is correct', function () {
          assert.lengthOf(report.dependencies, 0)
        })
      })
      suite('condition with alternate:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('if (true) { "foo"; } else { "bar"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct physical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.physical, 1)
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 4)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
        test('functions is empty', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 2)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
        test('aggregate has correct Halstead operator identifier length', function () {
          assert.lengthOf(report.aggregate.halstead.operators.identifiers, report.aggregate.halstead.operators.distinct)
        })
        test('aggregate has correct Halstead operand identifier length', function () {
          assert.lengthOf(report.aggregate.halstead.operands.identifiers, report.aggregate.halstead.operands.distinct)
        })
        test('aggregate has correct Halstead length', function () {
          assert.strictEqual(report.aggregate.halstead.length, 5)
        })
        test('aggregate has correct Halstead vocabulary', function () {
          assert.strictEqual(report.aggregate.halstead.vocabulary, 5)
        })
        test('aggregate has correct Halstead difficulty', function () {
          assert.strictEqual(report.aggregate.halstead.difficulty, 1)
        })
        test('aggregate has correct Halstead volume', function () {
          assert.strictEqual(Math.round(report.aggregate.halstead.volume), 12)
        })
        test('aggregate has correct Halstead effort', function () {
          assert.strictEqual(Math.round(report.aggregate.halstead.effort), 12)
        })
        test('aggregate has correct Halstead bugs', function () {
          assert.strictEqual(Math.round(report.aggregate.halstead.bugs), 0)
        })
        test('aggregate has correct Halstead time', function () {
          assert.strictEqual(Math.round(report.aggregate.halstead.time), 1)
        })
      })
      suite('dual condition:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('if (true) { "foo"; } if (false) { "bar"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 4)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 3)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 2)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 1)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 4)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 4)
        })
        test('aggregate has correct Halstead operator identifier length', function () {
          assert.lengthOf(report.aggregate.halstead.operators.identifiers, report.aggregate.halstead.operators.distinct)
        })
        test('aggregate has correct Halstead operand identifier length', function () {
          assert.lengthOf(report.aggregate.halstead.operands.identifiers, report.aggregate.halstead.operands.distinct)
        })
        test('aggregate has correct Halstead length', function () {
          assert.strictEqual(report.aggregate.halstead.length, 6)
        })
        test('aggregate has correct Halstead vocabulary', function () {
          assert.strictEqual(report.aggregate.halstead.vocabulary, 5)
        })
        test('aggregate has correct Halstead difficulty', function () {
          assert.strictEqual(report.aggregate.halstead.difficulty, 0.5)
        })
      })
      suite('alternate dual condition:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('if (true) { "foo"; } else if (false) { "bar"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 5)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 3)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 3)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 4)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 4)
        })
        test('aggregate has correct Halstead operator identifier length', function () {
          assert.lengthOf(report.aggregate.halstead.operators.identifiers, report.aggregate.halstead.operators.distinct)
        })
        test('aggregate has correct Halstead operand identifier length', function () {
          assert.lengthOf(report.aggregate.halstead.operands.identifiers, report.aggregate.halstead.operands.distinct)
        })
      })
      suite('nested condition:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('if (true) { "foo"; if (false) { "bar"; } }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 4)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 3)
        })
      })
      suite('switch statement:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('switch (Date.now()) { case 1: "foo"; break; case 2: "bar"; break; default: "baz"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 9)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 3)
        })
        test('aggregate has correct cyclomatic complexity density', function () {
          assert.isTrue(report.aggregate.cyclomaticDensity > 33.3)
          assert.isTrue(report.aggregate.cyclomaticDensity < 33.4)
        })
        test('functions is empty', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 8)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 6)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 7)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 7)
        })
      })
      suite('switch statement with fall-through case:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('switch (Date.now()) { case 1: case 2: "foo"; break; default: "bar"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 7)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 3)
        })
        test('functions is empty', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 7)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 6)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 6)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 6)
        })
      })
      suite('switch statement containing condition:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('switch (Date.now()) { case 1: "foo"; break; case 2: "bar"; break; default: if (true) { "baz"; } }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 10)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 4)
        })
        test('functions is empty', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 9)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 7)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 8)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 8)
        })
      })
      suite('for loop:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var i; for (i = 0; i < 10; i += 1) { "foo"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 3)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
        test('functions is empty', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 5)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 5)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 8)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 5)
        })
        test('aggregate has correct Halstead length', function () {
          assert.strictEqual(report.aggregate.halstead.length, 13)
        })
        test('aggregate has correct Halstead vocabulary', function () {
          assert.strictEqual(report.aggregate.halstead.vocabulary, 10)
        })
        test('aggregate has correct Halstead difficulty', function () {
          assert.strictEqual(report.aggregate.halstead.difficulty, 4)
        })
      })
      suite('for loop containing condition:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var i; for (i = 0; i < 10; i += 1) { if (true) { "foo"; } }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 3)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 6)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 6)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 9)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 6)
        })
      })
      suite('for...in loop:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var property; for (property in { foo: "bar", baz: "qux" }) { "wibble"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 5)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('functions is empty', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 5)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 4)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 8)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 7)
        })
        test('aggregate has correct Halstead length', function () {
          assert.strictEqual(report.aggregate.halstead.length, 13)
        })
        test('aggregate has correct Halstead vocabulary', function () {
          assert.strictEqual(report.aggregate.halstead.vocabulary, 11)
        })
        test('aggregate has correct Halstead difficulty', function () {
          assert.strictEqual(Math.round(report.aggregate.halstead.difficulty), 2)
        })
      })
      suite('for...in loop containing condition:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var property, object = { foo: "bar", baz: "qux" }; for (property in object) { if (object.hasOwnProperty(property)) { "wibble"; } }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 9)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 8)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 13)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 9)
        })
      })
      suite('for...of loop:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var item; for (item of [ "foo", "bar", "baz" ]) { "wibble"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 3)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('functions is empty', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 3)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 3)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 7)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 6)
        })
        test('aggregate has correct Halstead length', function () {
          assert.strictEqual(report.aggregate.halstead.length, 10)
        })
        test('aggregate has correct Halstead vocabulary', function () {
          assert.strictEqual(report.aggregate.halstead.vocabulary, 9)
        })
        test('aggregate has correct Halstead difficulty', function () {
          assert.strictEqual(Math.round(report.aggregate.halstead.difficulty), 2)
        })
      })
      suite('while loop:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('while (true) { "foo"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 2)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
        test('functions is empty', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 1)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 1)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 2)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 2)
        })
      })
      suite('while loop containing condition:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('while (true) { if (true) { "foo"; } }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 3)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 2)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 2)
        })
      })
      suite('do...while loop:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('do { "foo"; } while (true)', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 3)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
        test('functions is empty', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 1)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 1)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 2)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 2)
        })
      })
      suite('do...while loop containing condition:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('do { if (true) { "foo"; } } while (true)', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 3)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 2)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 2)
        })
      })
      suite('try...catch:', function () {
        var report
        setup(function () {
          var ast = parser.parse('try { "foo"; } catch (e) { e.message; }', options)
          report = escomplex.analyse(ast, mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 4)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('functions is empty', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 2)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 4)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
      })
      suite('try containing condition', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('try { if (true) { "foo"; } } catch (e) { "bar"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 2)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 4)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 4)
        })
      })
      suite('catch containing condition', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('try { "foo"; } catch (e) { if (true) { "bar"; } }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 2)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 4)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 4)
        })
      })
      suite('function declaration:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('function foo () { "bar"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 2)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 1)
        })
        test('function has correct name', function () {
          assert.strictEqual(report.functions[0].name, 'foo')
        })
        test('function has correct physical lines of code', function () {
          assert.strictEqual(report.functions[0].sloc.physical, 1)
        })
        test('function has correct logical lines of code', function () {
          assert.strictEqual(report.functions[0].sloc.logical, 1)
        })
        test('function has correct cyclomatic complexity', function () {
          assert.strictEqual(report.functions[0].cyclomatic, 1)
        })
        test('function has correct parameter count', function () {
          assert.strictEqual(report.functions[0].params, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 1)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 1)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 2)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 2)
        })
        test('aggregate has correct Halstead length', function () {
          assert.strictEqual(report.aggregate.halstead.length, 3)
        })
        test('aggregate has correct Halstead vocabulary', function () {
          assert.strictEqual(report.aggregate.halstead.vocabulary, 3)
        })
        test('aggregate has correct Halstead difficulty', function () {
          assert.strictEqual(report.aggregate.halstead.difficulty, 0.5)
        })
        test('function has correct Halstead length', function () {
          assert.strictEqual(report.functions[0].halstead.length, 1)
        })
        test('function has correct Halstead vocabulary', function () {
          assert.strictEqual(report.functions[0].halstead.vocabulary, 1)
        })
        test('function has correct Halstead difficulty', function () {
          assert.strictEqual(report.functions[0].halstead.difficulty, 0)
        })
        test('function has correct Halstead volume', function () {
          assert.strictEqual(report.functions[0].halstead.volume, 0)
        })
        test('function has correct Halstead effort', function () {
          assert.strictEqual(report.functions[0].halstead.effort, 0)
        })
        test('function has correct Halstead bugs', function () {
          assert.strictEqual(report.functions[0].halstead.bugs, 0)
        })
        test('function has correct Halstead time', function () {
          assert.strictEqual(report.functions[0].halstead.time, 0)
        })
        test('maintainability index is correct', function () {
          assert.strictEqual(report.maintainability, 171)
        })
        test('aggregate has correct parameter count', function () {
          assert.strictEqual(report.aggregate.params, 0)
        })
      })
      suite('nested function declaration:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('function foo () { bar(); function bar () { "baz"; } }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 4)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 2)
        })
        test('first function has correct logical lines of code', function () {
          assert.strictEqual(report.functions[0].sloc.logical, 2)
        })
        test('second function has correct logical lines of code', function () {
          assert.strictEqual(report.functions[1].sloc.logical, 1)
        })
        test('first function has correct name', function () {
          assert.strictEqual(report.functions[0].name, 'foo')
        })
        test('second function has correct name', function () {
          assert.strictEqual(report.functions[1].name, 'bar')
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 3)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 4)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
      })
      suite('function declaration containing condition:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('function foo () { if (true) { "bar"; } }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
        test('function has correct cyclomatic complexity', function () {
          assert.strictEqual(report.functions[0].cyclomatic, 2)
        })
        test('function has correct cyclomatic complexity', function () {
          assert.strictEqual(report.functions[0].cyclomaticDensity, 100)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 2)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
      })
      suite('class declaration', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('class foo { constructor () { "foo"; } }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 2)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 1)
        })
        test('function has correct name', function () {
          assert.strictEqual(report.functions[0].name, 'constructor')
        })
        test('function has correct physical lines of code', function () {
          assert.strictEqual(report.functions[0].sloc.physical, 1)
        })
        test('function has correct logical lines of code', function () {
          assert.strictEqual(report.functions[0].sloc.logical, 1)
        })
        test('function has correct cyclomatic complexity', function () {
          assert.strictEqual(report.functions[0].cyclomatic, 1)
        })
        test('function has correct parameter count', function () {
          assert.strictEqual(report.functions[0].params, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 2)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
        test('aggregate has correct Halstead length', function () {
          assert.strictEqual(report.aggregate.halstead.length, 5)
        })
        test('aggregate has correct Halstead vocabulary', function () {
          assert.strictEqual(report.aggregate.halstead.vocabulary, 5)
        })
        test('aggregate has correct Halstead difficulty', function () {
          assert.strictEqual(report.aggregate.halstead.difficulty, 1)
        })
        test('function has correct Halstead length', function () {
          assert.strictEqual(report.functions[0].halstead.length, 1)
        })
        test('function has correct Halstead vocabulary', function () {
          assert.strictEqual(report.functions[0].halstead.vocabulary, 1)
        })
        test('function has correct Halstead difficulty', function () {
          assert.strictEqual(report.functions[0].halstead.difficulty, 0)
        })
        test('function has correct Halstead volume', function () {
          assert.strictEqual(report.functions[0].halstead.volume, 0)
        })
        test('function has correct Halstead effort', function () {
          assert.strictEqual(report.functions[0].halstead.effort, 0)
        })
        test('function has correct Halstead bugs', function () {
          assert.strictEqual(report.functions[0].halstead.bugs, 0)
        })
        test('function has correct Halstead time', function () {
          assert.strictEqual(report.functions[0].halstead.time, 0)
        })
        test('maintainability index is correct', function () {
          assert.strictEqual(report.maintainability, 171)
        })
        test('aggregate has correct parameter count', function () {
          assert.strictEqual(report.aggregate.params, 0)
        })
      })
      suite('assignment expression', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = "bar";', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 1)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('functions is empty', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 2)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 2)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 2)
        })
      })
      suite('ternary condtional expression assigned to variable:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = true ? "bar" : "baz";', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 1)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 3)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 3)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 4)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 4)
        })
      })
      suite('nested ternary condtional expression:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = true ? "bar" : (false ? "baz" : "qux");', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 1)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 3)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 4)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 3)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 6)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 6)
        })
      })
      suite('logical or expression assigned to variable:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = true || false;', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 1)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 3)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 3)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
      })
      suite('anonymous function assigned to variable:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = function () { "bar"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 2)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 1)
        })
        test('function has correct name', function () {
          assert.strictEqual(report.functions[0].name, 'foo')
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 3)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 3)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
      })
      suite('named function assigned to variable:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = function bar () { "baz"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 2)
        })
        test('function has correct name', function () {
          assert.strictEqual(report.functions[0].name, 'bar')
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
      })
      suite('arrow function expression assigned to variable:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = () => "bar"', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 1)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 3)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 3)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 2)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 2)
        })
      })
      suite('arrow function block assigned to variable:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = () => { "bar"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 2)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 1)
        })
        test('function has correct name', function () {
          assert.strictEqual(report.functions[0].name, 'foo')
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 3)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 3)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 2)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 2)
        })
      })
      suite('ternary condtional expression returned from function:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('function foo () { return true ? "bar" : "baz"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 2)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
        test('function has correct cyclomatic complexity', function () {
          assert.strictEqual(report.functions[0].cyclomatic, 2)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 3)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 3)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 4)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 4)
        })
      })
      suite('logical or expression returned from function:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('function foo () { return true || false; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 2)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
        test('function has correct cyclomatic complexity', function () {
          assert.strictEqual(report.functions[0].cyclomatic, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
      })
      suite('anonymous function returned from function:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('function foo () { return function () { "bar"; }; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 3)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 2)
        })
        test('first function has correct name', function () {
          assert.strictEqual(report.functions[0].name, 'foo')
        })
        test('second function is anonymous', function () {
          assert.strictEqual(report.functions[1].name, '<anonymous>')
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 3)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
      })
      suite('named function returned from function:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('function foo () { return function bar () { "baz"; }; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('second function has correct name', function () {
          assert.strictEqual(report.functions[1].name, 'bar')
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
      })
      suite('ternary condtional expression passed as argument:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('parseInt("10", true ? 10 : 8);', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 2)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 5)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 5)
        })
      })
      suite('logical or expression passed as argument:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('parseInt("10", 10 || 8);', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
      })
      suite('anonymous function passed as argument:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('setTimeout(function () { "foo"; }, 1000);', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 2)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 1)
        })
        test('function is anonymous', function () {
          assert.strictEqual(report.functions[0].name, '<anonymous>')
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 2)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 4)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 4)
        })
      })
      suite('named function passed as argument:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('setTimeout(function foo () { "bar"; }, 1000);', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('function has correct name', function () {
          assert.strictEqual(report.functions[0].name, 'foo')
        })
      })
      suite('logical AND expression:', function () {
        test('aggregate has correct cyclomatic complexity', function () {
          var report = escomplex.analyse(parser.parse('var foo = true && false;'), mozWalker, {})
          assert.strictEqual(report.cyclomatic, 2)
        })
      })
      suite('logical OR expression with logicalor false:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = true || false;', options), mozWalker, {
            logicalor: false
          })
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
      })
      suite('switch statement with switchcase false:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('switch (Date.now()) { case 1: "foo"; break; case 2: "bar"; break; default: "baz"; }', options), mozWalker, {
            switchcase: false
          })
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
      })
      suite('for...in loop with forin true:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var property; for (property in { foo: "bar", baz: "qux" }) { "wibble"; }', options), mozWalker, {
            forin: true
          })
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
      })
      suite('try...catch with trycatch true:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('try { "foo"; } catch (e) { e.message; }', options), mozWalker, {
            trycatch: true
          })
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
      })
      suite('IIFE:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('(function (foo) { if (foo === "foo") { console.log(foo); return; } "bar"; }("foo"));', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 6)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 1)
        })
        test('function has correct cyclomatic complexity', function () {
          assert.strictEqual(report.functions[0].cyclomatic, 2)
        })
        test('function has correct parameter count', function () {
          assert.strictEqual(report.functions[0].params, 1)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 7)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 6)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 9)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 6)
        })
        test('aggregate has correct parameter count', function () {
          assert.strictEqual(report.aggregate.params, 1)
        })
      })
      suite('logical and condition:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('if ("foo" && "bar") { "baz"; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 2)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 3)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 2)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
      })
      suite('call on function object:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('(function () { "foo"; }).call(this);', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 3)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 1)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 3)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 3)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 4)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 4)
        })
      })
      suite('anonymous function assigned to property:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = {}; foo.bar = function () { "foobar"; };', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 3)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 1)
        })
        test('function has correct name', function () {
          assert.strictEqual(report.functions[0].name, 'foo.bar')
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 6)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 5)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 6)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 4)
        })
      })
      suite('anonymous function assigned to property of literal:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('"".bar = function () { "bar"; };', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 2)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 1)
        })
        test('function has correct name', function () {
          assert.strictEqual(report.functions[0].name, '<anonymous>.bar')
        })
      })
      suite('empty object literal:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = {};', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 1)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 3)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 3)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 2)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 2)
        })
      })
      suite('function property of literal object:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = { bar: "bar", baz: function () { "baz"; } };', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 4)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 1)
        })
        test('function has correct name', function () {
          assert.strictEqual(report.functions[0].name, 'baz')
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 6)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 5)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 7)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 6)
        })
      })
      suite('duplicate function properties of literal object:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = { bar: function () { if (true) { "bar"; } }, bar: function () { "bar"; } };', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 2)
        })
        test('first function has correct name', function () {
          assert.strictEqual(report.functions[0].name, 'bar')
        })
        test('second function has correct name', function () {
          assert.strictEqual(report.functions[1].name, 'bar')
        })
        test('first function has correct cyclomatic complexity', function () {
          assert.strictEqual(report.functions[0].cyclomatic, 2)
        })
        test('second function has correct cyclomatic complexity', function () {
          assert.strictEqual(report.functions[1].cyclomatic, 1)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 2)
        })
      })
      suite('throw exception:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('try { throw new Error("foo"); } catch (e) { alert(error.message); }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 4)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 5)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 5)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 6)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 6)
        })
      })
      suite('prefix and postfix increment:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var a = 0; ++a; a++;', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 3)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 4)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 4)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 4)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 2)
        })
      })
      suite('array literal:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('[ "foo", "bar" ];', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 1)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 1)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 1)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
      })
      suite('multiple physical lines:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('// This is a\n// multi-line\n// comment.\nparseInt(\n\t(function () {\n\t\t// Moar\n\t\t// commentz!\n\t\treturn [\n\t\t\t"1",\n\t\t\t"0"\n\t\t].join("");\n\t}()),\n\t10\n);', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct physical lines of code', function () {
          // The acorn parser treats comment lines differently from
          // Other parsers. Consequently, the starting line value is
          // Different when calculating the aggregate lines.
          if (parserName === 'acorn') {
            assert.strictEqual(report.aggregate.sloc.physical, 14)
          } else {
            assert.strictEqual(report.aggregate.sloc.physical, 11)
          }
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 4)
        })
        test('functions has correct length', function () {
          assert.lengthOf(report.functions, 1)
        })
        test('function has correct physical lines of code', function () {
          assert.strictEqual(report.functions[0].sloc.physical, 8)
        })
        test('function has correct logical lines of code', function () {
          assert.strictEqual(report.functions[0].sloc.logical, 2)
        })
        test('maintainability index is correct', function () {
          assert.strictEqual(Math.round(report.maintainability), 146)
        })
      })
      suite('multiple functions:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('function foo (a, b) { if (a) { b(a); } else { a(b); } } function bar (c, d) { var i; for (i = 0; i < c.length; i += 1) { d += 1; } console.log(d); }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('maintainability index is correct', function () {
          assert.strictEqual(Math.round(report.maintainability), 128)
        })
        test('first function has correct parameter count', function () {
          assert.strictEqual(report.functions[0].params, 2)
        })
        test('second function has correct parameter count', function () {
          assert.strictEqual(report.functions[1].params, 2)
        })
        test('aggregate has correct parameter count', function () {
          assert.strictEqual(report.aggregate.params, 4)
        })
        test('mean logical LOC is correct', function () {
          assert.strictEqual(report.loc, 4)
        })
        test('mean cyclomatic complexity is correct', function () {
          assert.strictEqual(report.cyclomatic, 2)
        })
        test('mean Halstead effort is correct', function () {
          assert.strictEqual(report.effort, 374.7133081440434)
        })
        test('mean parameter count is correct', function () {
          assert.strictEqual(report.params, 2)
        })
      })
      suite('issue 3 / reddit.ISV_Damocles:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var callback = arguments[arguments.length-1] instanceof Function ? arguments[arguments.length-1] : function() {};', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('maintainability index is correct', function () {
          assert.strictEqual(report.maintainability, 171)
        })
      })
      suite('empty return:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('function foo () { return; }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 2)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 2)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 1)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 1)
        })
        test('aggregate has correct Halstead difficulty', function () {
          assert.strictEqual(report.aggregate.halstead.difficulty, 1)
        })
        test('function has correct Halstead difficulty', function () {
          assert.strictEqual(report.functions[0].halstead.difficulty, 0.5)
        })
        test('maintainability index is correct', function () {
          assert.strictEqual(report.maintainability, 171)
        })
      })
      suite('Empty nested functions', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('function foo () { function bar () {} }', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('maintainability index is correct', function () {
          assert.strictEqual(report.maintainability, 171)
        })
      })
      suite('Microsoft variant maintainability index:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('function foo (a, b) { if (a) { b(a); } else { a(b); } } function bar (c, d) { var i; for (i = 0; i < c.length; i += 1) { d += 1; } console.log(d); }', options), mozWalker, {
            newmi: true
          })
        })
        teardown(function () {
          report = undefined
        })
        test('maintainability index is correct', function () {
          assert.strictEqual(Math.round(report.maintainability), 75)
        })
      })
      suite('Functions with consistent parameter counts:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('function foo (a) {} function bar (b) {} function baz (c) {}', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct parameter count', function () {
          assert.strictEqual(report.aggregate.params, 3)
        })
        test('mean parameter count is correct', function () {
          assert.strictEqual(report.params, 1)
        })
      })
      suite('Functions with inconsistent parameter counts:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('function foo (a, b, c, d, e) {} function bar (a, b, c, d, e) {} function baz (a) {}', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct parameter count', function () {
          assert.strictEqual(report.aggregate.params, 11)
        })
        test('mean parameter count is correct', function () {
          assert.strictEqual(report.params, 11 / 3)
        })
      })
      suite('CommonJS require literal:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('require("./foo");', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('dependencies has correct length', function () {
          assert.lengthOf(report.dependencies, 1)
        })
        test('dependencies are correct', function () {
          assert.isObject(report.dependencies[0])
          assert.strictEqual(report.dependencies[0].line, 1)
          assert.strictEqual(report.dependencies[0].path, './foo')
          assert.strictEqual(report.dependencies[0].type, 'CommonJS')
        })
      })
      suite('alternative CommonJS require literal:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('require("./bar");', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('dependencies are correct', function () {
          assert.strictEqual(report.dependencies[0].path, './bar')
        })
      })
      suite('CommonJS require multiple:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('require("./foo");\nrequire("./bar");\n\nrequire("./baz");', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('dependencies has correct length', function () {
          assert.lengthOf(report.dependencies, 3)
        })
        test('dependencies are correct', function () {
          assert.strictEqual(report.dependencies[0].line, 1)
          assert.strictEqual(report.dependencies[0].path, './foo')
          assert.strictEqual(report.dependencies[1].line, 2)
          assert.strictEqual(report.dependencies[1].path, './bar')
          assert.strictEqual(report.dependencies[2].line, 4)
          assert.strictEqual(report.dependencies[2].path, './baz')
        })
      })
      suite('CommonJS require variable:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = "./foo";require(foo);', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('dependencies has correct length', function () {
          assert.lengthOf(report.dependencies, 1)
        })
        test('dependencies are correct', function () {
          assert.isObject(report.dependencies[0])
          assert.strictEqual(report.dependencies[0].line, 1)
          assert.strictEqual(report.dependencies[0].path, '* dynamic dependency *')
          assert.strictEqual(report.dependencies[0].type, 'CommonJS')
        })
      })
      suite('ES2015 module import:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(
            parser.parse(
              'import foo from "./foo";',
              _merge({}, options, {sourceType: 'module'})
            ),
            mozWalker
          )
        })
        teardown(function () {
          report = undefined
        })
        test('dependencies has correct length', function () {
          assert.lengthOf(report.dependencies, 1)
        })
        test('dependencies are correct', function () {
          assert.isObject(report.dependencies[0])
          assert.strictEqual(report.dependencies[0].line, 1)
          assert.strictEqual(report.dependencies[0].path, './foo')
          assert.strictEqual(report.dependencies[0].type, 'Module')
        })
      })
      suite('ES2015 module import and AMD require:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(
            parser.parse(
              'import foo from "./foo"; require([ "./bar" ], function (bar) {});',
              _merge({}, options, {sourceType: 'module'})
            ),
            mozWalker
          )
        })
        teardown(function () {
          report = undefined
        })
        test('dependencies has correct length', function () {
          assert.lengthOf(report.dependencies, 2)
        })
        test('dependencies are correct', function () {
          const esModule = report.dependencies[0]
          assert.isObject(esModule)
          assert.strictEqual(esModule.line, 1)
          assert.strictEqual(esModule.path, './foo')
          assert.strictEqual(esModule.type, 'Module')

          const amdModule = report.dependencies[1]
          assert.isObject(amdModule)
          assert.strictEqual(amdModule.line, 1)
          assert.strictEqual(amdModule.path, './bar')
          assert.strictEqual(amdModule.type, 'AMD')
        })
      })
      suite('AMD require literal:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('require([ "foo" ], function (foo) {});', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('dependencies has correct length', function () {
          assert.lengthOf(report.dependencies, 1)
        })
        test('dependencies are correct', function () {
          assert.isObject(report.dependencies[0])
          assert.strictEqual(report.dependencies[0].line, 1)
          assert.strictEqual(report.dependencies[0].path, 'foo')
          assert.strictEqual(report.dependencies[0].type, 'AMD')
        })
      })
      suite('alternative AMD require literal:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('require([ "bar" ], function (barModule) {});', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('dependencies are correct', function () {
          assert.strictEqual(report.dependencies[0].path, 'bar')
        })
      })
      suite('AMD require multiple:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('require([ "foo", "bar", "baz" ], function (foo, bar, baz) {});', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('dependencies has correct length', function () {
          assert.lengthOf(report.dependencies, 3)
        })
        test('dependencies are correct', function () {
          assert.strictEqual(report.dependencies[0].line, 1)
          assert.strictEqual(report.dependencies[0].path, 'foo')
          assert.strictEqual(report.dependencies[1].line, 1)
          assert.strictEqual(report.dependencies[1].path, 'bar')
          assert.strictEqual(report.dependencies[2].line, 1)
          assert.strictEqual(report.dependencies[2].path, 'baz')
          assert.strictEqual(report.dependencies[2].type, 'AMD')
        })
      })
      suite('AMD require variable:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = "foo";\nrequire([ foo ], function (foo) {});', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('dependencies has correct length', function () {
          assert.lengthOf(report.dependencies, 1)
        })
        test('dependencies are correct', function () {
          assert.strictEqual(report.dependencies[0].line, 2)
          assert.strictEqual(report.dependencies[0].path, '* dynamic dependency *')
          assert.strictEqual(report.dependencies[0].type, 'AMD')
        })
      })
      suite('AMD require variable array:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('var foo = [ "foo" ];\nrequire(foo, function (foo) {});', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('dependencies has correct length', function () {
          assert.lengthOf(report.dependencies, 1)
        })
        test('dependencies are correct', function () {
          assert.strictEqual(report.dependencies[0].line, 2)
          assert.strictEqual(report.dependencies[0].path, '* dynamic dependencies *')
        })
      })
      suite('AMD require.config:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('require.config({\n\tpaths: {\n\t\tfoo: "path/to/foo",\n\t\tbaz: "../wibble"\n\t}\n});\nrequire([ "foo", "bar", "baz" ], function (foo, bar, baz) {});', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('dependencies has correct length', function () {
          assert.lengthOf(report.dependencies, 3)
        })
        test('dependencies are correct', function () {
          assert.strictEqual(report.dependencies[0].line, 7)
          assert.strictEqual(report.dependencies[0].path, 'path/to/foo')
          assert.strictEqual(report.dependencies[0].type, 'AMD')
          assert.strictEqual(report.dependencies[1].line, 7)
          assert.strictEqual(report.dependencies[1].path, 'bar')
          assert.strictEqual(report.dependencies[0].type, 'AMD')
          assert.strictEqual(report.dependencies[2].line, 7)
          assert.strictEqual(report.dependencies[2].path, '../wibble')
          assert.strictEqual(report.dependencies[0].type, 'AMD')
        })
      })
      suite('AMD require literal string:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('require("foo", function (foo) {});', options), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('dependencies has correct length', function () {
          assert.lengthOf(report.dependencies, 1)
        })
        test('dependencies are correct', function () {
          assert.strictEqual(report.dependencies[0].line, 1)
          assert.strictEqual(report.dependencies[0].path, 'foo')
          assert.strictEqual(report.dependencies[0].type, 'AMD')
        })
      })
      suite('Missing loc data:', function () {
        var report
        setup(function () {
          report = escomplex.analyse(parser.parse('parseInt("10", 10);'), mozWalker)
        })
        teardown(function () {
          report = undefined
        })
        test('aggregate has correct no physical lines of code', function () {
          assert.isUndefined(report.aggregate.sloc.physical)
        })
        test('aggregate has correct logical lines of code', function () {
          assert.strictEqual(report.aggregate.sloc.logical, 1)
        })
        test('aggregate has correct cyclomatic complexity', function () {
          assert.strictEqual(report.aggregate.cyclomatic, 1)
        })
        test('functions is empty', function () {
          assert.lengthOf(report.functions, 0)
        })
        test('aggregate has correct Halstead total operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.total, 1)
        })
        test('aggregate has correct Halstead distinct operators', function () {
          assert.strictEqual(report.aggregate.halstead.operators.distinct, 1)
        })
        test('aggregate has correct Halstead total operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.total, 3)
        })
        test('aggregate has correct Halstead distinct operands', function () {
          assert.strictEqual(report.aggregate.halstead.operands.distinct, 3)
        })
        test('aggregate has correct Halstead operator identifier length', function () {
          assert.lengthOf(report.aggregate.halstead.operators.identifiers, report.aggregate.halstead.operators.distinct)
        })
        test('aggregate has correct Halstead operand identifier length', function () {
          assert.lengthOf(report.aggregate.halstead.operands.identifiers, report.aggregate.halstead.operands.distinct)
        })
        test('aggregate has correct Halstead length', function () {
          assert.strictEqual(report.aggregate.halstead.length, 4)
        })
        test('aggregate has correct Halstead vocabulary', function () {
          assert.strictEqual(report.aggregate.halstead.vocabulary, 4)
        })
        test('aggregate has correct Halstead difficulty', function () {
          assert.strictEqual(report.aggregate.halstead.difficulty, 0.5)
        })
        test('aggregate has correct Halstead volume', function () {
          assert.strictEqual(report.aggregate.halstead.volume, 8)
        })
        test('aggregate has correct Halstead effort', function () {
          assert.strictEqual(report.aggregate.halstead.effort, 4)
        })
        test('aggregate has correct Halstead bugs', function () {
          assert.strictEqual(Math.round(report.aggregate.halstead.bugs), 0)
        })
        test('aggregate has correct Halstead time', function () {
          assert.strictEqual(Math.round(report.aggregate.halstead.time), 0)
        })
        test('maintainability index is correct', function () {
          assert.strictEqual(Math.round(report.maintainability), 166)
        })
        test('aggregate has correct parameter count', function () {
          assert.strictEqual(report.aggregate.params, 0)
        })
        test('mean parameter count is correct', function () {
          assert.strictEqual(report.params, 0)
        })
        test('dependencies is correct', function () {
          assert.lengthOf(report.dependencies, 0)
        })
      })
    })
  })
})
