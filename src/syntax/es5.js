'use strict'

const _isString = require('lodash.isstring')
const safeName = require('../safeName')
const defineSyntax = require('./define-syntax')

const ArrayExpression = settings => defineSyntax({
  operators: '[]',
  operands: safeName,
  children: 'elements'
})

const AssignmentExpression = settings => defineSyntax({
  operators: node => node.operator,
  children: [ 'left', 'right' ],
  assignableName: node => {
    if (node.left.type === 'MemberExpression') {
      return safeName(node.left.object) +
        '.' +
        node.left.property.name
    }
    return safeName(node.left.id)
  }
})

const BinaryExpression = settings => defineSyntax({
  operators: node => node.operator,
  children: [ 'left', 'right' ]
})

const BlockStatement = settings => defineSyntax({
  children: 'body'
})

const BreakStatement = settings => defineSyntax({
  lloc: 1,
  operators: 'break',
  children: [ 'label' ]
})

let amdPathAliases = {}

function dependencyPath (item, fallback) {
  if (item.type === 'Literal') {
    return amdPathAliases[item.value] || item.value
  }
  return fallback
}

function processRequire (node) {
  let line = node.loc.start.line
  let path = '* dynamic dependency *'
  let args = node.arguments

  if (args.length === 1) {
    return {
      line,
      type: 'CommonJS',
      path: dependencyPath(args[0], path)
    }
  }

  if (args.length === 2) {
    let type = 'AMD'

    if (args[0].type === 'ArrayExpression') {
      return args[0].elements.map(
        item => ({
          type,
          line,
          path: dependencyPath(item, path)
        })
      )
    }

    return {
      type,
      line,
      path: dependencyPath(args[0], '* dynamic dependencies *')
    }
  }
}

const CallExpression = settings => defineSyntax({
  lloc: node => node.callee.type === 'FunctionExpression' ? 1 : 0,
  operators: '()',
  children: [ 'arguments', 'callee' ],
  dependencies: (node, clearAliases) => {
    if (clearAliases) {
      // TODO: This prohibits async running. Refine by passing in module id as key for amdPathAliases.
      amdPathAliases = {}
    }

    if (node.callee.type === 'Identifier' && node.callee.name === 'require') {
      return processRequire(node)
    }

    if (
      node.callee.type === 'MemberExpression' &&
      node.callee.object.type === 'Identifier' &&
      node.callee.object.name === 'require' &&
      node.callee.property.type === 'Identifier' &&
      node.callee.property.name === 'config'
    ) {
      let args = node.arguments
      if (args.length === 1 && args[0].type === 'ObjectExpression') {
        args[0].properties.forEach(property => {
          if (
            property.key.type === 'Identifier' &&
            property.key.name === 'paths' &&
            property.value.type === 'ObjectExpression'
          ) {
            property.value.properties.forEach(alias => {
              if (
                alias.key.type === 'Identifier' &&
                alias.value.type === 'Literal'
              ) {
                amdPathAliases[alias.key.name] = alias.value.value
              }
            })
          }
        })
      }
    }
  }
})

const CatchClause = settings => defineSyntax({
  lloc: 1,
  cyclomatic: settings.trycatch ? 1 : 0,
  operators: 'catch',
  children: [ 'param', 'body' ]
})

const ConditionalExpression = settings => defineSyntax({
  cyclomatic: 1,
  operators: ':?',
  children: [
    'test',
    'consequent',
    'alternate'
  ]
})

const ContinueStatement = settings => defineSyntax({
  lloc: 1,
  operators: 'continue',
  children: [ 'label' ]
})

const DebuggerStatement = settings => defineSyntax({})

const DoWhileStatement = settings => defineSyntax({
  lloc: 2,
  cyclomatic: node => node.test ? 1 : 0,
  operators: 'dowhile',
  children: [
    'test',
    'body'
  ]
})

const EmptyStatement = settings => defineSyntax({})

const ExpressionStatement = settings => defineSyntax({
  lloc: 1,
  children: [ 'expression' ]
})

const ForInStatement = settings => defineSyntax({
  lloc: 1,
  cyclomatic: settings.forin ? 1 : 0,
  operators: 'forin',
  children: [
    'left',
    'right',
    'body'
  ]
})

const ForStatement = settings => defineSyntax({
  lloc: 1,
  cyclomatic: node => node.test ? 1 : 0,
  operators: 'for',
  children: [
    'init',
    'test',
    'update',
    'body'
  ]
})

const FunctionDeclaration = settings => defineSyntax({
  lloc: 1,
  operators: 'function',
  operands: node => safeName(node.id),
  children: [ 'params', 'body' ],
  newScope: true
})

const FunctionExpression = settings => defineSyntax({
  operators: 'function',
  operands: node => safeName({name: node.id}),
  children: [ 'params', 'body' ],
  newScope: true
})

const Identifier = settings => defineSyntax({
  operands: node => node.name
})

const IfStatement = settings => defineSyntax({
  lloc: node => node.alternate ? 2 : 1,
  cyclomatic: 1,
  operators: [
    'if',
    {
      filter: node => !!node.alternate,
      identifier: 'else'
    }
  ],
  children: [
    'test',
    'consequent',
    'alternate'
  ]
})

const LabeledStatement = settings => defineSyntax({})

const Literal = settings => defineSyntax({
  operands: node => {
    if (_isString(node.value)) {
      return `"${node.value}"`
    }
    return node.value
  }
})

const LogicalExpression = settings => defineSyntax({
  cyclomatic: node => {
    var isAnd = node.operator === '&&'
    var isOr = node.operator === '||'
    return (isAnd || (settings.logicalor && isOr)) ? 1 : 0
  },
  operators: node => node.operator,
  children: [ 'left', 'right' ]
})

const MemberExpression = settings => defineSyntax({
  lloc: node => {
    let type = node.object.type
    if (
      type === 'ObjectExpression' ||
      type === 'ArrayExpression' ||
      type === 'FunctionExpression'
    ) {
      return 1
    }
    return 0
  },
  operators: '.',
  children: [ 'object', 'property' ]
})

const NewExpression = settings => defineSyntax({
  lloc: node => node.callee.type === 'FunctionExpression' ? 1 : 0,
  operators: 'new',
  children: [ 'arguments', 'callee' ]
})

const ObjectExpression = settings => defineSyntax({
  operators: '{}',
  operands: safeName,
  children: 'properties'
})

const Property = settings => defineSyntax({
  lloc: 1,
  operators: ':',
  children: [ 'key', 'value' ],
  assignableName: node => safeName(node.key)
})

const ReturnStatement = settings => defineSyntax({
  lloc: 1,
  operators: 'return',
  children: 'argument'
})

const SequenceExpression = settings => defineSyntax({ children: 'expressions' })

const SwitchCase = settings => defineSyntax({
  lloc: 1,
  cyclomatic: node => {
    return settings.switchcase && node.test ? 1 : 0
  },
  operators: node => node.test ? 'case' : 'default',
  children: [
    'test',
    'consequent'
  ]
})

const SwitchStatement = settings => defineSyntax({
  lloc: 1,
  operators: 'switch',
  children: [
    'discriminant',
    'cases'
  ]
})

const ThisExpression = settings => defineSyntax({ operands: 'this' })
const ThrowStatement = settings => defineSyntax({
  lloc: 1,
  operators: 'throw',
  children: 'argument'
})

const TryStatement = settings => defineSyntax({
  lloc: 1,
  children: [
    'block',
    'handler'
  ]
})

const UnaryExpression = settings => defineSyntax({
  operators: node => `${node.operator} (${node.prefix ? 'pre' : 'post'}fix)`,
  children: 'argument'
})

const UpdateExpression = settings => defineSyntax({
  operators: node => `${node.operator} (${node.prefix ? 'pre' : 'post'}fix)`,
  children: 'argument'
})

const VariableDeclaration = settings => defineSyntax({
  operators: node => node.kind,
  children: 'declarations'
})

const VariableDeclarator = settings => defineSyntax({
  lloc: 1,
  operators: {
    filter: node => !!node.init,
    identifier: '='
  },
  children: [ 'id', 'init' ],
  assignableName: node => safeName(node.id)
})

const WhileStatement = settings => defineSyntax({
  lloc: 1,
  cyclomatic: node => node.test ? 1 : 0,
  operators: 'while',
  children: [
    'test',
    'body'
  ]
})

const WithStatement = settings => defineSyntax({
  lloc: 1,
  operators: 'with',
  children: [
    'object',
    'body'
  ]
})

module.exports = {
  ArrayExpression,
  AssignmentExpression,
  BinaryExpression,
  BlockStatement,
  BreakStatement,
  CallExpression,
  CatchClause,
  ConditionalExpression,
  ContinueStatement,
  DebuggerStatement,
  DoWhileStatement,
  EmptyStatement,
  ExpressionStatement,
  ForInStatement,
  ForStatement,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  IfStatement,
  LabeledStatement,
  Literal,
  LogicalExpression,
  MemberExpression,
  NewExpression,
  ObjectExpression,
  Property,
  ReturnStatement,
  SequenceExpression,
  SwitchCase,
  SwitchStatement,
  ThisExpression,
  ThrowStatement,
  TryStatement,
  UnaryExpression,
  UpdateExpression,
  VariableDeclaration,
  VariableDeclarator,
  WhileStatement,
  WithStatement
}
