'use strict'

const _merge = require('lodash.merge')
const _get = require('lodash.get')
const assert = require('chai').assert
const sinon = require('sinon')
const parsers = require('./helpers/parsers')
const walker = require('../src/walker')

function testExample (example, assertions) {
  return function () {
    this.walk(example)
    var statement = this.callbacks.processNode.firstCall.args[0]
    assertions.forEach(assertion => {
      assert.strictEqual(_get(statement, assertion[0]), assertion[1])
    })
  }
}

// List of test cases taken directly from the ESTree
// Spec (https://github.com/estree/estree)
parsers.forEach(function (parserName, parser, options) {
  suite('AST Walker', function () {
    setup(function () {
      this.callbacks = {
        createScope: sinon.stub(),
        popScope: sinon.stub(),
        processNode: sinon.stub()
      }
      this.walk = function parse (code) {
        var tree = parser.parse(code, options)
        walker.walk(tree, {}, this.callbacks)
      }
    })
    suite('ES5', function () {
      suite('Statements', function () {
        test('debugger statement', function () {
          this.walk('debugger;')
          assert.strictEqual(this.callbacks.processNode.callCount, 1)
        })
        test('empty statement', function () {
          this.walk(';')
          assert.strictEqual(this.callbacks.processNode.callCount, 1)
        })
        test('empty block statement', function () {
          this.walk('{}')
          var blockNode = this.callbacks.processNode.firstCall.args[0]
          assert.strictEqual(blockNode.type, 'BlockStatement')
          assert.strictEqual(blockNode.body.length, 0)
          assert.strictEqual(this.callbacks.createScope.callCount, 0)
          assert.strictEqual(this.callbacks.popScope.callCount, 0)
        })
        test('expression statement', function () {
          this.walk('a')
          var statement = this.callbacks.processNode.firstCall.args[0]
          var expression = this.callbacks.processNode.secondCall.args[0]
          assert.strictEqual(statement.type, 'ExpressionStatement')
          assert.strictEqual(statement.expression, expression)
          assert.strictEqual(this.callbacks.createScope.callCount, 0)
          assert.strictEqual(this.callbacks.popScope.callCount, 0)
        })
        test('if statement', function () {
          this.walk('if (true) { true; } else { false; }')
          var statement = this.callbacks.processNode.firstCall.args[0]
          assert.strictEqual(statement.type, 'IfStatement')
          assert.strictEqual(statement.test.type, 'Literal')
          assert.strictEqual(statement.test.value, true)
          assert.strictEqual(statement.consequent.body[0].expression.value, true)
          assert.strictEqual(statement.alternate.body[0].expression.value, false)
        })
        test('labeled statement', function () {
          this.walk('foo: a;')
          assert.strictEqual(this.callbacks.processNode.callCount, 1)
        })
        test('break statement (with label)', function () {
          this.walk('foo: break foo')
          var statement = this.callbacks.processNode.firstCall.args[0].body
          assert.strictEqual(statement.type, 'BreakStatement')
          assert.strictEqual(statement.label.type, 'Identifier')
        })
        test('continue statement', function () {
          this.walk('while (true) { continue }')
          var statement = this.callbacks.processNode.firstCall.args[0].body.body[0]
          assert.strictEqual(statement.type, 'ContinueStatement')
          assert.strictEqual(statement.label, null)
        })
        test('with statement', function () {
          this.walk('with (foo) {}')
          var statement = this.callbacks.processNode.firstCall.args[0]
          assert.strictEqual(statement.type, 'WithStatement')
          assert.strictEqual(statement.object.type, 'Identifier')
          assert.strictEqual(statement.body.type, 'BlockStatement')
        })
        test('switch statement', function () {
          this.walk('switch (foo) {}')
          var statement = this.callbacks.processNode.firstCall.args[0]
          assert.strictEqual(statement.type, 'SwitchStatement')
          assert.strictEqual(statement.discriminant.type, 'Identifier')
          assert.strictEqual(statement.cases.length, 0)
        })
        test('return statement', function () {
          this.walk('function foo() { return 1 }')
          var statement = this.callbacks.processNode.firstCall.args[0].body.body[0]
          assert.strictEqual(statement.type, 'ReturnStatement')
          assert.strictEqual(statement.argument.type, 'Literal')
          assert.strictEqual(statement.argument.value, 1)
        })
        test('throw statement', function () {
          this.walk('function foo() { throw "foo" }')
          var statement = this.callbacks.processNode.firstCall.args[0].body.body[0]
          assert.strictEqual(statement.type, 'ThrowStatement')
          assert.strictEqual(statement.argument.type, 'Literal')
        })
        test('try statement', function () {
          this.walk('try {} finally {}')
          var statement = this.callbacks.processNode.firstCall.args[0]
          assert.strictEqual(statement.type, 'TryStatement')
          assert.strictEqual(statement.block.type, 'BlockStatement')
          assert.strictEqual(statement.handler, null)
          assert.strictEqual(statement.finalizer.type, 'BlockStatement')
        })
        test('while statement', function () {
          this.walk('while (true) {}')
          var statement = this.callbacks.processNode.firstCall.args[0]
          assert.strictEqual(statement.type, 'WhileStatement')
          assert.strictEqual(statement.test.type, 'Literal')
          assert.strictEqual(statement.body.type, 'BlockStatement')
        })
        test('do-while statement', function () {
          this.walk('do {} while (true)')
          var statement = this.callbacks.processNode.firstCall.args[0]
          assert.strictEqual(statement.type, 'DoWhileStatement')
          assert.strictEqual(statement.body.type, 'BlockStatement')
          assert.strictEqual(statement.test.type, 'Literal')
        })
        test('for statement', function () {
          this.walk('for (var i = 0; i < 10; i++) {}')
          var statement = this.callbacks.processNode.firstCall.args[0]
          assert.strictEqual(statement.type, 'ForStatement')
          assert.strictEqual(statement.init.type, 'VariableDeclaration')
          assert.strictEqual(statement.test.type, 'BinaryExpression')
          assert.strictEqual(statement.update.type, 'UpdateExpression')
          assert.strictEqual(statement.body.type, 'BlockStatement')
        })
        test('for-in statement', function () {
          this.walk('for (var o in foo) {}')
          var statement = this.callbacks.processNode.firstCall.args[0]
          assert.strictEqual(statement.type, 'ForInStatement')
          assert.strictEqual(statement.left.type, 'VariableDeclaration')
          assert.strictEqual(statement.right.type, 'Identifier')
          assert.strictEqual(statement.body.type, 'BlockStatement')
        })
      })
      suite('Declarations', function () {
        test('function declaration', function () {
          this.walk('function foo() {}')
          var declaration = this.callbacks.processNode.firstCall.args[0]
          assert.strictEqual(declaration.type, 'FunctionDeclaration')
          assert.strictEqual(declaration.id.name, 'foo')
          assert.strictEqual(declaration.id.type, 'Identifier')
          assert.strictEqual(declaration.params.length, 0)
          assert.strictEqual(declaration.body.type, 'BlockStatement')
          assert.strictEqual(declaration.body.body.length, 0)
        })
        test('var declaration', function () {
          this.walk('var a = 1')
          var statement = this.callbacks.processNode.firstCall.args[0]
          assert.strictEqual(statement.type, 'VariableDeclaration')
          assert.strictEqual(statement.kind, 'var')
          assert.strictEqual(statement.declarations.length, 1)
        })
        test('let declaration', function () {
          this.walk('let a = 1')
          var statement = this.callbacks.processNode.firstCall.args[0]
          assert.strictEqual(statement.type, 'VariableDeclaration')
          assert.strictEqual(statement.kind, 'let')
          assert.strictEqual(statement.declarations.length, 1)
        })
        test('const declaration', function () {
          this.walk('const a = 1')
          var statement = this.callbacks.processNode.firstCall.args[0]
          assert.strictEqual(statement.type, 'VariableDeclaration')
          assert.strictEqual(statement.kind, 'const')
          assert.strictEqual(statement.declarations.length, 1)
        })
        test('var declarator', function () {
          this.walk('var a = 1')
          var statement = this.callbacks.processNode.firstCall.args[0]
          var declarator = this.callbacks.processNode.secondCall.args[0]
          assert.strictEqual(statement.declarations[0], declarator)
          assert.strictEqual(declarator.id.type, 'Identifier')
          assert.strictEqual(declarator.id.name, 'a')
        })
        test('let declarator', function () {
          this.walk('let a = 1')
          var statement = this.callbacks.processNode.firstCall.args[0]
          var declarator = this.callbacks.processNode.secondCall.args[0]
          assert.strictEqual(statement.declarations[0], declarator)
          assert.strictEqual(declarator.id.type, 'Identifier')
          assert.strictEqual(declarator.id.name, 'a')
        })
        test('const declarator', function () {
          this.walk('const a = 1')
          var statement = this.callbacks.processNode.firstCall.args[0]
          var declarator = this.callbacks.processNode.secondCall.args[0]
          assert.strictEqual(statement.declarations[0], declarator)
          assert.strictEqual(declarator.id.type, 'Identifier')
          assert.strictEqual(declarator.id.name, 'a')
        })
      })

      suite('Expressions', function () {
        test('this expression', function () {
          this.walk('this')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'ThisExpression')
        })
        test('empty array expression', function () {
          this.walk('[]')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'ArrayExpression')
          assert.strictEqual(expression.elements.length, 0)
        })
        test('array expression', function () {
          this.walk('[ 1, 2 ]')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'ArrayExpression')
          assert.strictEqual(expression.elements.length, 2)
          assert.strictEqual(expression.elements[0].value, 1)
          assert.strictEqual(expression.elements[1].value, 2)
        })
        test('object expression', function () {
          this.walk('({})')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'ObjectExpression')
          assert.strictEqual(expression.properties.length, 0)
        })
        test('object expression with properties', function () {
          this.walk('({ a: "foo", "bar": "baz" })')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'ObjectExpression')
          assert.strictEqual(expression.properties.length, 2)
          assert.strictEqual(expression.properties[0].type, 'Property')
          assert.strictEqual(expression.properties[0].key.type, 'Identifier')
          assert.strictEqual(expression.properties[0].key.name, 'a')
          assert.strictEqual(expression.properties[0].value.type, 'Literal')
          assert.strictEqual(expression.properties[0].value.value, 'foo')
          assert.strictEqual(expression.properties[1].type, 'Property')
          assert.strictEqual(expression.properties[1].key.type, 'Literal')
          assert.strictEqual(expression.properties[1].key.value, 'bar')
          assert.strictEqual(expression.properties[1].value.type, 'Literal')
          assert.strictEqual(expression.properties[1].value.value, 'baz')
        })
        test('function expression', function () {
          this.walk('(function foo() {})')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'FunctionExpression')
          assert.strictEqual(expression.id.name, 'foo')
          assert.strictEqual(expression.generator, false)
        })
        test('sequence expression', function () {
          this.walk('"a","b"')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'SequenceExpression')
          assert.strictEqual(expression.expressions.length, 2)
        })
        test('unary expression', function () {
          this.walk('!true')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'UnaryExpression')
          assert.strictEqual(expression.operator, '!')
          assert.strictEqual(expression.prefix, true)
          assert.strictEqual(expression.argument.type, 'Literal')
        })
        test('binary expression', function () {
          this.walk('1 + 1')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'BinaryExpression')
          assert.strictEqual(expression.operator, '+')
          assert.strictEqual(expression.left.type, 'Literal')
          assert.strictEqual(expression.right.type, 'Literal')
        })
        test('assignment expression', function () {
          this.walk('a = 1')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'AssignmentExpression')
          assert.strictEqual(expression.operator, '=')
          assert.strictEqual(expression.left.type, 'Identifier')
          assert.strictEqual(expression.right.type, 'Literal')
        })
        test('update expression', function () {
          this.walk('a++')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'UpdateExpression')
          assert.strictEqual(expression.operator, '++')
          assert.strictEqual(expression.argument.type, 'Identifier')
          assert.strictEqual(expression.prefix, false)
        })
        test('logical expression: &&', function () {
          this.walk('1 && 1')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'LogicalExpression')
          assert.strictEqual(expression.operator, '&&')
        })
        test('logical expression: ||', function () {
          this.walk('1 || 1')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'LogicalExpression')
          assert.strictEqual(expression.operator, '||')
        })
        test('conditional expression', function () {
          this.walk('true ? 1 : 0')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'ConditionalExpression')
          assert.strictEqual(expression.test.type, 'Literal')
          assert.strictEqual(expression.test.value, true)
          assert.strictEqual(expression.alternate.type, 'Literal')
          assert.strictEqual(expression.alternate.value, 0)
          assert.strictEqual(expression.consequent.type, 'Literal')
          assert.strictEqual(expression.consequent.value, 1)
        })
        test('call expression', function () {
          this.walk('foo("bar")')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'CallExpression')
          assert.strictEqual(expression.callee.type, 'Identifier')
          assert.strictEqual(expression.arguments.length, 1)
          assert.strictEqual(expression.arguments[0].type, 'Literal')
        })
        test('new expression', function () {
          this.walk('new Foo("bar")')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'NewExpression')
          assert.strictEqual(expression.callee.type, 'Identifier')
          assert.strictEqual(expression.arguments.length, 1)
          assert.strictEqual(expression.arguments[0].type, 'Literal')
        })
        test('member expression (computed)', function () {
          this.walk('foo["bar"]')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'MemberExpression')
          assert.strictEqual(expression.object.type, 'Identifier')
          assert.strictEqual(expression.property.type, 'Literal')
          assert.strictEqual(expression.computed, true)
        })
        test('member expression (non-computed)', function () {
          this.walk('foo.bar')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'MemberExpression')
          assert.strictEqual(expression.object.type, 'Identifier')
          assert.strictEqual(expression.property.type, 'Identifier')
          assert.strictEqual(expression.computed, false)
        })
      })
      suite('Clauses', function () {
        test('switchcase', function () {
          this.walk('switch (1) { case foo: "bar"; default: "baz" }')
          var cases = this.callbacks.processNode.firstCall.args[0].cases
          assert.strictEqual(cases.length, 2)
          assert.strictEqual(cases[0].type, 'SwitchCase')
          assert.strictEqual(cases[0].test.type, 'Identifier')
          assert.strictEqual(cases[1].type, 'SwitchCase')
          assert.strictEqual(cases[1].test, null)
        })
        test('catch clause', function () {
          this.walk('try {} catch (foo) {}')
          var clause = this.callbacks.processNode.firstCall.args[0].handler
          assert.strictEqual(clause.type, 'CatchClause')
          assert.strictEqual(clause.param.type, 'Identifier')
          assert.strictEqual(clause.body.type, 'BlockStatement')
          assert.strictEqual(clause.body.body.length, 0)
        })
      })
      suite('Miscellaneous', function () {
        test('identifier', function () {
          this.walk('foo')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'Identifier')
          assert.strictEqual(expression.name, 'foo')
        })
        test('literal', function () {
          this.walk('1')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'Literal')
          assert.strictEqual(expression.value, 1)
        })
        test('regexp literal', function () {
          this.walk('/foo/i')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'Literal')
          assert.strictEqual(expression.regex.pattern, 'foo')
          assert.strictEqual(expression.regex.flags, 'i')
        })
      })
    })
    suite('ES2015', function () {
      test('for-of statement', function () {
        this.walk('for (var o of foo) {}')
        var statement = this.callbacks.processNode.firstCall.args[0]
        assert.strictEqual(statement.type, 'ForOfStatement')
        assert.strictEqual(statement.left.type, 'VariableDeclaration')
        assert.strictEqual(statement.right.type, 'Identifier')
        assert.strictEqual(statement.body.type, 'BlockStatement')
      })
      test('let variable declaration', function () {
        this.walk('let a')
        var declaration = this.callbacks.processNode.firstCall.args[0]
        assert.strictEqual(declaration.type, 'VariableDeclaration')
        assert.strictEqual(declaration.kind, 'let')
      })
      test('const variable declaration', function () {
        this.walk('const a = 1')
        var declaration = this.callbacks.processNode.firstCall.args[0]
        assert.strictEqual(declaration.type, 'VariableDeclaration')
        assert.strictEqual(declaration.kind, 'const')
      })
      test('arrow function statement', function () {
        this.walk('() => {}')
        var expression = this.callbacks.processNode.firstCall.args[0].expression
        assert.strictEqual(expression.type, 'ArrowFunctionExpression')
        assert.strictEqual(expression.body.type, 'BlockStatement')
        assert.strictEqual(expression.expression, false)
      })
      test('arrow function expression', function () {
        this.walk('(a) => a')
        var expression = this.callbacks.processNode.firstCall.args[0].expression
        assert.strictEqual(expression.type, 'ArrowFunctionExpression')
        assert.strictEqual(expression.body.type, 'Identifier')
        assert.strictEqual(expression.expression, true)
      })
      test('generator with yield expression', function () {
        this.walk('function* foo() { yield "bar" }')
        var declaration = this.callbacks.processNode.firstCall.args[0]
        var body = declaration.body
        var statement = body.body[0]
        var expression = statement.expression
        assert.strictEqual(declaration.type, 'FunctionDeclaration')
        assert.strictEqual(declaration.id.type, 'Identifier')
        assert.strictEqual(declaration.id.name, 'foo')
        assert.strictEqual(declaration.generator, true)
        assert.strictEqual(body.type, 'BlockStatement')
        assert.strictEqual(statement.type, 'ExpressionStatement')
        assert.strictEqual(expression.type, 'YieldExpression')
      })
      test('template literal (no expressions)', function () {
        this.walk('`foo`')
        var expression = this.callbacks.processNode.firstCall.args[0].expression
        assert.strictEqual(expression.type, 'TemplateLiteral')
        assert.strictEqual(expression.quasis.length, 1)
        assert.strictEqual(expression.quasis[0].type, 'TemplateElement')
        assert.strictEqual(expression.quasis[0].value.raw, 'foo')
        assert.strictEqual(expression.quasis[0].value.cooked, 'foo')
        assert.strictEqual(expression.quasis[0].tail, true)
        assert.strictEqual(expression.expressions.length, 0)
      })
      test('template literal', function () {
        this.walk("`foo ${bar}`") // eslint-disable-line
        var literal = this.callbacks.processNode.firstCall.args[0].expression
        assert.strictEqual(literal.type, 'TemplateLiteral')
        assert.strictEqual(literal.quasis.length, 2)
        assert.strictEqual(literal.quasis[0].type, 'TemplateElement')
        assert.strictEqual(literal.quasis[0].value.raw, 'foo ')
        assert.strictEqual(literal.quasis[0].value.cooked, 'foo ')
        assert.strictEqual(literal.quasis[0].tail, false)
        assert.strictEqual(literal.quasis[1].type, 'TemplateElement')
        assert.strictEqual(literal.quasis[1].value.raw, '')
        assert.strictEqual(literal.quasis[1].value.cooked, '')
        assert.strictEqual(literal.expressions.length, 1)
        assert.strictEqual(literal.expressions[0].type, 'Identifier')
        assert.strictEqual(literal.expressions[0].name, 'bar')
      })
      test('tagged template literal', function () {
        this.walk('foo`bar ${baz}`') // eslint-disable-line
        var expression = this.callbacks.processNode.firstCall.args[0].expression
        assert.strictEqual(expression.type, 'TaggedTemplateExpression')
        assert.strictEqual(expression.tag.type, 'Identifier')
        assert.strictEqual(expression.tag.name, 'foo')
        assert.strictEqual(expression.quasi.type, 'TemplateLiteral')
        assert.strictEqual(expression.quasi.quasis.length, 2)
        assert.strictEqual(expression.quasi.expressions.length, 1)
      })
      test('object pattern', function () {
        this.walk('({foo}) => {}')
        var pattern = this.callbacks.processNode.firstCall.args[0].expression.params[0]
        assert.strictEqual(pattern.type, 'ObjectPattern')
        assert.strictEqual(pattern.properties.length, 1)
        assert.strictEqual(pattern.properties[0].type, 'Property')
        assert.strictEqual(pattern.properties[0].value.type, 'Identifier')
        assert.strictEqual(pattern.properties[0].kind, 'init')
        assert.strictEqual(pattern.properties[0].method, false)
        assert.strictEqual(pattern.properties[0].shorthand, true)
      })
      test('array pattern', function () {
        this.walk('([foo]) => {}')
        var pattern = this.callbacks.processNode.firstCall.args[0].expression.params[0]
        assert.strictEqual(pattern.type, 'ArrayPattern')
        assert.strictEqual(pattern.elements.length, 1)
        assert.strictEqual(pattern.elements[0].type, 'Identifier')
      })
      test('assignment pattern', function () {
        this.walk('(foo = "bar") => {}')
        var pattern = this.callbacks.processNode.firstCall.args[0].expression.params[0]
        assert.strictEqual(pattern.type, 'AssignmentPattern')
        assert.strictEqual(pattern.left.type, 'Identifier')
        assert.strictEqual(pattern.right.type, 'Literal')
      })
      test('rest element', function () {
        this.walk('(...foo) => {}')
        var pattern = this.callbacks.processNode.firstCall.args[0].expression.params[0]
        assert.strictEqual(pattern.type, 'RestElement')
        assert.strictEqual(pattern.argument.type, 'Identifier')
      })
      test('array with spread element', function () {
        this.walk('[...foo]')
        var expression = this.callbacks.processNode.firstCall.args[0].expression
        assert.strictEqual(expression.elements.length, 1)
        assert.strictEqual(expression.elements[0].type, 'SpreadElement')
        assert.strictEqual(expression.elements[0].argument.type, 'Identifier')
        assert.strictEqual(expression.elements[0].argument.name, 'foo')
      })
      test('call with spread element', function () {
        this.walk('foo(...bar)')
        var expression = this.callbacks.processNode.firstCall.args[0].expression
        assert.strictEqual(expression.arguments.length, 1)
        assert.strictEqual(expression.arguments[0].type, 'SpreadElement')
        assert.strictEqual(expression.arguments[0].argument.type, 'Identifier')
        assert.strictEqual(expression.arguments[0].argument.name, 'bar')
      })
      suite('classes', function () {
        test('class declaration', function () {
          this.walk('class foo extends Object {}')
          var declaration = this.callbacks.processNode.firstCall.args[0]
          assert.strictEqual(declaration.type, 'ClassDeclaration')
          assert.strictEqual(declaration.superClass.type, 'Identifier')
          assert.strictEqual(declaration.superClass.name, 'Object')
          assert.strictEqual(declaration.body.type, 'ClassBody')
          assert.strictEqual(declaration.body.body.length, 0)
        })
        test('class expression', function () {
          this.walk('(class foo {})')
          var expression = this.callbacks.processNode.firstCall.args[0].expression
          assert.strictEqual(expression.type, 'ClassExpression')
          assert.strictEqual(expression.superClass, null)
          assert.strictEqual(expression.body.type, 'ClassBody')
          assert.strictEqual(expression.body.body.length, 0)
        })
        test('method definition', function () {
          this.walk('class foo { constructor() {} ["bar"]() {} static baz() {} }')
          var constructor = this.callbacks.processNode.firstCall.args[0].body.body[0]
          assert.strictEqual(constructor.type, 'MethodDefinition')
          assert.strictEqual(constructor.key.type, 'Identifier')
          assert.strictEqual(constructor.key.name, 'constructor')
          assert.strictEqual(constructor.value.type, 'FunctionExpression')
          assert.strictEqual(constructor.kind, 'constructor')
          assert.strictEqual(constructor.computed, false)
          assert.strictEqual(constructor.static, false)

          var bar = this.callbacks.processNode.firstCall.args[0].body.body[1]
          assert.strictEqual(bar.type, 'MethodDefinition')
          assert.strictEqual(bar.key.type, 'Literal')
          assert.strictEqual(bar.key.value, 'bar')
          assert.strictEqual(bar.value.type, 'FunctionExpression')
          assert.strictEqual(bar.kind, 'method')
          assert.strictEqual(bar.computed, true)
          assert.strictEqual(bar.static, false)

          var baz = this.callbacks.processNode.firstCall.args[0].body.body[2]
          assert.strictEqual(baz.type, 'MethodDefinition')
          assert.strictEqual(baz.key.type, 'Identifier')
          assert.strictEqual(baz.key.name, 'baz')
          assert.strictEqual(baz.value.type, 'FunctionExpression')
          assert.strictEqual(baz.kind, 'method')
          assert.strictEqual(baz.computed, false)
          assert.strictEqual(baz.static, true)
        })
        test('super call', function () {
          this.walk('class foo extends bar { constructor() { super() } }')
          var constructor = this.callbacks.processNode.firstCall.args[0].body.body[0]
          var callee = constructor.value.body.body[0].expression.callee
          assert.strictEqual(callee.type, 'Super')
        })
        test('super member', function () {
          this.walk('class foo extends bar { constructor() { super.bar } }')
          var constructor = this.callbacks.processNode.firstCall.args[0].body.body[0]
          var member = constructor.value.body.body[0].expression
          assert.strictEqual(member.type, 'MemberExpression')
          assert.strictEqual(member.object.type, 'Super')
          assert.strictEqual(member.property.type, 'Identifier')
          assert.strictEqual(member.property.name, 'bar')
        })
        test('meta property', function () {
          this.walk('function foo() { new.target }')
          var fn = this.callbacks.processNode.firstCall.args[0]
          var expression = fn.body.body[0].expression
          assert.strictEqual(expression.type, 'MetaProperty')
          assert.strictEqual(expression.meta.type, 'Identifier')
          assert.strictEqual(expression.meta.name, 'new')
          assert.strictEqual(expression.property.type, 'Identifier')
          assert.strictEqual(expression.property.name, 'target')
        })
      })
      suite('modules', function () {
        setup(function () {
          this.walk = function parse (code) {
            var tree = parser.parse(
              code,
              _merge({}, options, {
                sourceType: 'module'
              })
            )
            walker.walk(tree, {}, this.callbacks)
          }
        })
        suite('import', function () {
          test('import with no specifiers', testExample(
            'import "module-name";',
            [
              ['type', 'ImportDeclaration'],
              ['specifiers.length', 0],
              ['source.type', 'Literal'],
              ['source.value', 'module-name']
            ]
          ))

          test('import specifier with defaultMember', testExample(
            'import defaultMember from "module-name";',
            [
              ['type', 'ImportDeclaration'],
              ['specifiers[0].type', 'ImportDefaultSpecifier'],
              ['source.type', 'Literal'],
              ['source.value', 'module-name']
            ]
          ))

          test('import namespace specifier', testExample(
            'import * as name from "module-name";',
            [
              ['type', 'ImportDeclaration'],
              ['specifiers[0].type', 'ImportNamespaceSpecifier'],
              ['source.type', 'Literal'],
              ['source.value', 'module-name']
            ]
          ))

          test('import specifier', testExample(
            'import { member } from "module-name";',
            [
              ['type', 'ImportDeclaration'],
              ['specifiers[0].type', 'ImportSpecifier'],
              ['specifiers[0].imported.type', 'Identifier'],
              ['specifiers[0].imported.name', 'member'],
              ['specifiers[0].local.type', 'Identifier'],
              ['specifiers[0].local.name', 'member'],
              ['source.type', 'Literal'],
              ['source.value', 'module-name']
            ]
          ))

          test('import specifier with alias', testExample(
            'import { member as alias } from "module-name";',
            [
              ['type', 'ImportDeclaration'],
              ['specifiers[0].type', 'ImportSpecifier'],
              ['specifiers[0].imported.type', 'Identifier'],
              ['specifiers[0].imported.name', 'member'],
              ['specifiers[0].local.type', 'Identifier'],
              ['specifiers[0].local.name', 'alias'],
              ['source.type', 'Literal'],
              ['source.value', 'module-name']
            ]
          ))

          test('import with multiple specifiers', testExample(
            'import { member1, member2 } from "module-name";',
            [
              ['type', 'ImportDeclaration'],
              ['specifiers[0].type', 'ImportSpecifier'],
              ['specifiers[0].imported.type', 'Identifier'],
              ['specifiers[0].imported.name', 'member1'],
              ['specifiers[0].local.type', 'Identifier'],
              ['specifiers[0].local.name', 'member1'],
              ['specifiers[1].type', 'ImportSpecifier'],
              ['specifiers[1].imported.type', 'Identifier'],
              ['specifiers[1].imported.name', 'member2'],
              ['specifiers[1].local.type', 'Identifier'],
              ['specifiers[1].local.name', 'member2'],
              ['source.type', 'Literal'],
              ['source.value', 'module-name']
            ]
          ))
        })
        suite('export', function () {
          test('export default identifier', testExample(
            'export default foo;',
            [
              ['type', 'ExportDefaultDeclaration'],
              ['declaration.type', 'Identifier'],
              ['declaration.name', 'foo']
            ]
          ))
          test('export default function', testExample(
            'export default () => {}',
            [
              ['type', 'ExportDefaultDeclaration'],
              ['declaration.type', 'ArrowFunctionExpression']
            ]
          ))
          test('export all declaration', testExample(
            'export * from "module";',
            [
              ['type', 'ExportAllDeclaration'],
              ['source.type', 'Literal'],
              ['source.value', 'module']
            ]
          ))
          test('export specifiers', testExample(
            'export { member }; const member = {};',
            [
              ['type', 'ExportNamedDeclaration'],
              ['declaration', null],
              ['source', null],
              ['specifiers[0].type', 'ExportSpecifier'],
              ['specifiers[0].exported.type', 'Identifier'],
              ['specifiers[0].exported.name', 'member']
            ]
          ))
          test('export specifier with alias', testExample(
            'export { member as alias }; const member = {};',
            [
              ['type', 'ExportNamedDeclaration'],
              ['declaration', null],
              ['source', null],
              ['specifiers[0].type', 'ExportSpecifier'],
              ['specifiers[0].exported.type', 'Identifier'],
              ['specifiers[0].exported.name', 'alias'],
              ['specifiers[0].local.type', 'Identifier'],
              ['specifiers[0].local.name', 'member']
            ]
          ))
          test('export specifier with declaration', testExample(
            'export var foo = 1;',
            [
              ['type', 'ExportNamedDeclaration'],
              ['declaration.type', 'VariableDeclaration'],
              ['source', null],
              ['specifiers.length', 0]
            ]
          ))
          test('export specifier with source', testExample(
            'export { member } from "module";',
            [
              ['type', 'ExportNamedDeclaration'],
              ['declaration', null],
              ['source.type', 'Literal'],
              ['source.value', 'module'],
              ['specifiers[0].type', 'ExportSpecifier'],
              ['specifiers[0].exported.type', 'Identifier'],
              ['specifiers[0].exported.name', 'member'],
              ['specifiers[0].local.type', 'Identifier'],
              ['specifiers[0].local.name', 'member']
            ]
          ))
        })
      })
    })
    suite('ES2017', function () {
      test('async function with await expression', function () {
        this.walk('async function foo() { await "bar" }')
        var declaration = this.callbacks.processNode.firstCall.args[0]
        var body = declaration.body
        var statement = body.body[0]
        var expression = statement.expression
        assert.strictEqual(declaration.type, 'FunctionDeclaration')
        assert.strictEqual(declaration.id.type, 'Identifier')
        assert.strictEqual(declaration.id.name, 'foo')
        assert.strictEqual(declaration.async, true)
        assert.strictEqual(body.type, 'BlockStatement')
        assert.strictEqual(statement.type, 'ExpressionStatement')
        assert.strictEqual(expression.type, 'AwaitExpression')
      })
    })
  })
})
