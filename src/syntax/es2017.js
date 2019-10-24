'use strict'

const defineSyntax = require('./define-syntax')
const safeName = require('../safeName')

const AwaitExpression = settings => defineSyntax({
  operators: 'await',
  children: [ 'argument' ]
})

// FunctionDeclaration redefined here with
// generator and async optionally adding to operators
const FunctionDeclaration = settings => defineSyntax({
  lloc: 1,
  operators: [
    'function',
    node => node.generator ? 'generator' : undefined,
    node => node.async ? 'async' : undefined
  ],
  operands: node => safeName(node.id),
  children: [ 'params', 'body' ],
  newScope: true
})

module.exports = {
  AwaitExpression,
  FunctionDeclaration
}
