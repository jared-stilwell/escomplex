# escomplex

[![Greenkeeper badge](https://badges.greenkeeper.io/escomplex/escomplex.svg)](https://greenkeeper.io/) [![Build Status](https://travis-ci.org/escomplex/escomplex.svg?branch=master)](https://travis-ci.org/escomplex/escomplex) [![Known Vulnerabilities](https://snyk.io/test/github/escomplex/escomplex/badge.svg)](https://snyk.io/test/github/escomplex/escomplex) [![Dependencies][dep-image]][dep-status] [![Dev Dependencies][devdep-image]][devdep-status]

Software complexity analysis
of JavaScript abstract syntax trees.
The back-end for [complexity-report].

## Installation

The library is published on npm
under the name `escomplex`.
To install,
you can add it to the dependencies
in your `package.json` file
or simply run:

```
npm i escomplex --save
```

## Usage

You can use escomplex by including it as an Node.js module:

```javascript
const escomplex = require('escomplex');
```

The module exports the `analyse` function.

### analyse

The `analyse` function is used to convert the source code of one or more modules
into one or more corresponding report objects containing metrics.

```javascript
const result = escomplex.analyse(source, options, parserOptions);
```

#### Arguments

##### source

The first argument, `source`, must be either a string or an array of objects. If it is an array, each object should include a `path` property that is either a relative or full path to the equivalent module on disk and a `code` with the contents of the module. As well as identifying each of the result objects, the path property is also used during dependency analysis.

##### options

The second argument, `options`,
is an optional object
containing properties that modify
some of the complexity calculations:

* `options.logicalor`:
  Boolean indicating whether operator `||`
  should be considered a source of cyclomatic complexity,
  defaults to `true`.
* `options.switchcase`:
  Boolean indicating whether `switch` statements
  should be considered a source of cyclomatic complexity,
  defaults to `true`.
* `options.forin`:
  Boolean indicating whether `for`...`in` loops
  should be considered a source of cyclomatic complexity,
  defaults to `false`.
* `options.trycatch`:
  Boolean indicating whether `catch` clauses
  should be considered a source of cyclomatic complexity,
  defaults to `false`.
* `options.newmi`:
  Boolean indicating whether the maintainability
  index should be rebased on a scale from 0 to 100,
  defaults to `false`.
* `options.skipCalculation`:
  *only valid for when source is an array of files*
  Boolean indicating if we should skip processing of certain values,
  such as the adjacency and visibility matrixes,
  core sizes, and average values loc, etc.
* `options.noCoreSize`:
  Skips creating the visibility matrix and calculating the coreSize,
  which can be very expensive for large projects

#### parserOptions

Espree is used to parse the JavaScript AST.
By default, it uses the options `{ ecmaVersion: 8, loc: true }`.
The third argument, `parserOptions` is an optional object containing options
passed to Espree to parse the JavaScript AST.
This will be merged with the default parser options.

### Result Format
The `analyze` function returns
a report of the following format,
with some variation depending on the given options.

#### For a single module

If a single source string
is passed in the `source` argument,
the result will be a report object
that looks like the following:

```javascript
{
    maintainability: 171,
    dependencies: [],
    aggregate: {
        sloc: {
            logical: 0,
            physical: 0
        },
        params: 0,
        cyclomatic: 1,
        cyclomaticDensity: 1,
        halstead: {
            vocabulary: 0,
            difficulty: 0,
            volume: 0,
            effort: 0,
            bugs: 0,
            time: 0
        }
    },
    functions: [
        {
            name: '',
            line: 0,
            sloc: {
                logical: 0,
                physical: 0
            },
            params: 0,
            cyclomatic: 1,
            cyclomaticDensity: 1,
            halstead: {
                vocabulary: 0,
                difficulty: 0,
                volume: 0,
                effort: 0,
                bugs: 0,
                time: 0
            }
        },
        ...
    ]
}
```

The meaning of those values, briefly,
is as follows
(see [metrics](#metrics)
for more information
on each one):

* `report.maintainability`:
  The maintainability index for the module.
* `report.dependencies`:
  The array of CommonJS/AMD dependencies for the module.
* `report.aggregate.sloc.physical`:
  Physical lines of code for the module.
  Will be `undefined`
  if the syntax tree
  is not annotated
  with line number data.
* `report.aggregate.sloc.logical`:
  Logical lines of code for the module.
* `report.aggregate.params`:
  Parameter count for the module.
* `report.aggregate.cyclomatic`:
  Cyclomatic complexity for the module.
* `report.aggregate.cyclomaticDensity`:
  Cyclomatic complexity density for the module.
* `report.aggregate.halstead.vocabulary`:
  Halstead vocabulary size for the module.
* `report.aggregate.halstead.difficulty`:
  Halstead difficulty for the module.
* `report.aggregate.halstead.volume`:
  Halstead volume for the module.
* `report.aggregate.halstead.effort`:
  Halstead effort for the module.
* `report.aggregate.halstead.bugs`:
  Halstead bugs for the module.
* `report.aggregate.halstead.time`:
  Halstead time for the module.
* `report.functions[n].name`:
  Function name.
* `report.functions[n].line`:
  Line number that the function starts on.
  Will be `undefined`
  if the syntax tree
  is not annotated
  with line number data.
* `report.functions[n].sloc.physical`:
  Physical lines of code for the function.
  Will be `undefined`
  if the syntax tree
  is not annotated
  with line number data.
* `report.functions[n].sloc.logical`:
  Logical lines of code for the function.
* `report.functions[n].params`:
  Parameter count for the function.
* `report.functions[n].cyclomatic`:
  Cyclomatic complexity for the function.
* `report.functions[n].cyclomaticDensity`:
  Cyclomatic complexity density for the function.
* `report.functions[n].halstead.vocabulary`:
  Halstead vocabulary size for the function.
* `report.functions[n].halstead.difficulty`:
  Halstead difficulty for the function.
* `report.functions[n].halstead.volume`:
  Halstead volume for the function.
* `report.functions[n].halstead.effort`:
  Halstead effort for the function.
* `report.functions[n].halstead.bugs`:
  Halstead bugs for the function.
* `report.functions[n].halstead.time`:
  Halstead time for the function.

#### For multiple modules

If an array of sources is passed in the `source` argument, the result will be an object
that looks like the following:

```javascript
{
    reports: [
        ...
    ],
    adjacencyMatrix: [
        [ 0 ]
    ],
    firstOrderDensity: 0,
    visibilityMatrix: [
        [ 0 ]
    ],
    changeCost: 100,
    coreSize: 100,
    loc: 0,
    cyclomatic: 1,
    effort: 0,
    params: 0,
    maintainability: 171
}
```

Those properties
are defined as follows:

* `result.reports`:
  An array of report objects,
  each one in the same format
  [described above](#for-a-single-module)
  but with an extra property `path`
  that matches the `path` property
  from its corresponding syntax tree.
  This `path` property is required
  because the reports array gets sorted
  during dependency analysis.
* `result.adjacencyMatrix`:
  The adjacency
  design structure matrix (DSM)
  for the project.
  This is a two-dimensional array,
  each dimension with the same order and length
  as the `reports` array.
  Each row and column
  represents its equivalent
  indexed module
  from the `reports` array,
  with values along the horizontal
  being `1`
  when that module
  directly depends on another
  and values along the vertical
  being `1`
  when that module
  is directly depended on by another.
  All other values are `0`.
* `result.firstOrderDensity`:
  The first-order density for the project.
* `result.visibilityMatrix`:
  The visibility DSM for the project.
  Like the adjacency matrix,
  but expanded to incorporate
  indirect dependencies.
  Will be missing if `noCoreSize` is passed
  as an option.
* `result.changeCost`:
  The change cost for the project.
  Will be missing if `noCoreSize` is passed
  as an option.
* `result.coreSize`:
  The core size for the project.
* `result.loc`:
  The average per-function
  count of logical lines of code.
* `result.cyclomatic`:
  The average per-function
  cyclomatic complexity.
* `result.effort`:
  The average per-function
  Halstead effort.
* `result.params`:
  The average per-function
  parameter count.
* `result.maintainability`:
  The average per-module
  maintainability index.

Refer to [a more in-depth description of the metrics used][metrics] for more details.

## Related projects

* [plato]:
  JavaScript source code visualization, static analysis, and complexity tool.
* [jsc]:
  JavaScript source code complexity tool.
* [bob]:
  Minimalist-omakase build tool for node.js projects.
* [cardio]:
  A web application health tool.
* [grunt-complexity][grunt]:
  A JavaScript complexity analysis grunt task.
* [atom-linter-escomplex][atom-linter-escomplex]: Lining code complexity in Atom editor.
* [brackets-crjs][brackets]:
  Brackets extension.
* [jscomplexity]:
  JS cyclomatic complexity report generator.
* [karma-complexity-processor][karma]:
  A preprocessor for karma runner to give some metrics about code complexity.
* [crlint]:
  JS linter based on complexity report results.

## Contributing

All changes should be submitted in the form of a pull request. Please refer
to the [contribution guidelines][contributions] before submitting a pull request.

Source code is in `/src`.
Unit tests are in `/test`.
You can run the tests with `npm test`.
You can run the linter with `npm run lint`.
Make sure you've installed
all the dependencies
with `npm install`
first.

## License

[MIT][license]

[dep-image]:https://david-dm.org/escomplex/escomplex.svg
[dep-status]:https://david-dm.org/escomplex/escomplex
[devdep-image]:https://david-dm.org/escomplex/escomplex/dev-status.svg
[devdep-status]:https://david-dm.org/escomplex/escomplex#info=devDependencies&view=table
[complexity-report]: https://github.com/escomplex/complexity-report
[escomplex-ast-moz]: https://github.com/escomplex/escomplex-ast-moz
[atom-linter-escomplex]: https://github.com/antono/atom-linter-escomplex
[api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API
[espree]: https://www.npmjs.com/package/espree
[acorn]: http://marijnhaverbeke.nl/acorn
[plato]: https://github.com/es-analysis/plato
[jsc]: https://github.com/bahmutov/js-complexity-viz
[bob]: https://github.com/cliffano/bob
[cardio]: https://github.com/auchenberg/cardio
[grunt]: https://github.com/vigetlabs/grunt-complexity
[brackets]: https://github.com/sahlas/brackets-crjs
[jscomplexity]: https://github.com/slyg/jscomplexity
[karma]: https://github.com/lorenzofox3/karma-complexity-preprocessor
[crlint]: https://github.com/spion/crlint.js
[metrics]: https://github.com/escomplex/escomplex/blob/master/METRICS.md
[contributions]: https://github.com/escomplex/escomplex/blob/master/CONTRIBUTING.md
[license]: https://github.com/escomplex/escomplex/blob/master/COPYING

