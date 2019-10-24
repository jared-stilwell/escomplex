'use strict'

const _isObject = require('lodash.isobject')
const _isFunction = require('lodash.isfunction')
const assert = require('assert')
const safeName = require('./safeName')
const syntaxDefinitions = require('./syntax')
const debug = require('debug')('escomplex:walker')

module.exports.walk = walk

// Settings
// - trycatch (Boolean)
// - forin (Boolean)
// - logicalor (Boolean)
// - switchcase (Boolean)
//

function walk (tree, settings, callbacks) {
  assert(_isObject(tree), 'Invalid syntax tree')
  assert(Array.isArray(tree.body), 'Invalid syntax tree body')
  assert(_isObject(settings), 'Invalid settings')
  assert(_isObject(callbacks), 'Invalid callbacks')
  assert(_isFunction(callbacks.processNode), 'Invalid processNode callback')
  assert(_isFunction(callbacks.createScope), 'Invalid createScope callback')
  assert(_isFunction(callbacks.popScope), 'Invalid popScope callback')

  visitNodes(tree.body)

  function getSyntax (type) {
    const definition = syntaxDefinitions[type]

    if (_isFunction(definition)) {
      return definition(settings)
    }
  }

  function visitNodes (nodes, assignedName) {
    nodes.forEach(node => visitNode(node, assignedName))
  }

  function visitNode (node, assignedName) {
    if (_isObject(node)) {
      const syntax = getSyntax(node.type)
      if (_isObject(syntax)) {
        callbacks.processNode(node, syntax)
        if (_isFunction(syntax.newScope) ? syntax.newScope(node) : syntax.newScope) {
          callbacks.createScope(safeName(node.id, assignedName), node.loc, node.params.length)
        }
        if (syntax.methodName) {
          node.value.id = syntax.methodName(node)
          debug('Writing method name into child function expression')
          debug(node.value.id)
        }
        visitChildren(node)
        if (syntax.newScope) {
          callbacks.popScope()
        }
      }
    }
  }

  function visitChildren (node) {
    const syntax = getSyntax(node.type)
    if (Array.isArray(syntax.children)) {
      syntax.children.forEach(child => visitChild(
        node[child],
        _isFunction(syntax.assignableName) ? syntax.assignableName(node) : ''
      ))
    }
  }

  function visitChild (child, assignedName) {
    const visitor = Array.isArray(child) ? visitNodes : visitNode
    visitor(child, assignedName)
  }
}
