/*globals exports, require */

'use strict';

var check = require('check-types'), report;
var debug = require('debug')('escomplex:module');

exports.analyse = analyse;

var processOperators = processOperatorsOrOperands('operators');
var processOperands = processOperatorsOrOperands('operands');

function analyse (ast, walker, options) {
    // TODO: Asynchronise

    var settings, currentReport, clearDependencies = true, scopeStack = [];

    check.assert.object(ast, 'Invalid syntax tree');
    check.assert.object(walker, 'Invalid walker');
    check.assert.function(walker.walk, 'Invalid walker.walk method');

    if (check.object(options)) {
        settings = options;
    } else {
        settings = getDefaultSettings();
    }

    // TODO: loc is moz-specific, move to walker?
    report = createReport(ast.loc);

    debug('Walking the AST:');
    debug(JSON.stringify(ast, null, 2));
    walker.walk(ast, settings, {
        processNode: processNode,
        createScope: createScope,
        popScope: popScope
    });

    calculateMetrics(settings);

    return report;

    function processNode (node, syntax) {
        processLloc(node, convertToNumber(syntax.lloc, node), currentReport);
        processCyclomatic(node, convertToNumber(syntax.cyclomatic, node), currentReport);
        processOperators(node, syntax.operators, currentReport);
        processOperands(node, syntax.operands, currentReport);

        if (processDependencies(node, syntax, clearDependencies)) {
            // HACK: This will fail with async or if other syntax than CallExpression introduces dependencies.
            // TODO: Come up with a less crude approach.
            clearDependencies = false;
        }
    }

    function createScope (name, loc, parameterCount) {
        currentReport = createFunctionReport(name, loc, parameterCount);

        report.functions.push(currentReport);
        report.aggregate.params += parameterCount;

        scopeStack.push(currentReport);
    }

    function popScope () {
        scopeStack.pop();

        if (scopeStack.length > 0) {
            currentReport = scopeStack[scopeStack.length - 1];
        } else {
            currentReport = undefined;
        }
    }
}

function getDefaultSettings () {
    return {
        logicalor: true,
        switchcase: true,
        forin: false,
        trycatch: false,
        newmi: false
    };
}

function createReport (lines) {
    debug('aggregate report: ' + JSON.stringify(createFunctionReport(undefined, lines, 0), null, 2));
    return {
        aggregate: createFunctionReport(undefined, lines, 0),
        functions: [],
        dependencies: []
    };
}

function createFunctionReport (name, lines, params) {
    var result = {
        name: name,
        sloc: {
            logical: 0
        },
        cyclomatic: 1,
        halstead: createInitialHalsteadState(),
        params: params
    };

    if (check.object(lines)) {
        debug('Calculating line information...');
        debug('start line: ' + lines.start.line);
        debug('end line: ' + lines.end.line);
        result.line = lines.start.line;
        result.sloc.physical = lines.end.line - lines.start.line + 1;
        debug('physical lines: ' + result.sloc.physical);
    }

    return result;
}

function createInitialHalsteadState () {
    return {
        operators: createInitialHalsteadItemState(),
        operands: createInitialHalsteadItemState()
    };
}

function createInitialHalsteadItemState () {
    return {
        distinct: 0,
        total: 0,
        identifiers: []
    };
}

/**
 * check if amount a function, then call it with the given node and return a number
 * @param amount
 * @param node
 * @returns {*}
 */
function convertToNumber(amount, node) {
    if (check.function(amount)) {
        amount = amount(node);
    }
    if (!check.number(amount)) {
        return 0;
    }
    return amount;
}

/**
 * refactored function for lloc processing
 * @param node
 * @param llocAmount
 * @param currentReport
 */
function processLloc (node, llocAmount, currentReport) {
    //incrementCounter(node, syntax, 'lloc', incrementLogicalSloc, currentReport);
    report.aggregate.sloc.logical += llocAmount;
    if (currentReport) {
        currentReport.sloc.logical += llocAmount;
    }
}


/**
 * refactored function for cyclomatic processing
 * @param node
 * @param cyclomaticAmount
 * @param currentReport
 */
function processCyclomatic (node, cyclomaticAmount, currentReport) {
    report.aggregate.cyclomatic += cyclomaticAmount;
    if (currentReport) {
        currentReport.cyclomatic += cyclomaticAmount;
    }
}


/**
 * refactoring of processOperators and processOperands
 * @param type
 * @returns {processOperators}
 */
function processOperatorsOrOperands(type) {
    var buildReport = function (actualReport, identifier) {
        // incrementHalsteadItems(actualReport, type, identifier);
        /*
         function incrementHalsteadItems (actualReport, type, identifier) {
         incrementDistinctHalsteadItems(baseReport, metric, identifier);
         incrementTotalHalsteadItems(baseReport, metric);
         }

         // make total first
         */
        //incrementTotalHalsteadItems(report, type);
        actualReport.halstead[type].total += 1;
        /*

         function incrementDistinctHalsteadItems (baseReport, metric, identifier) {
         if (Object.prototype.hasOwnProperty(identifier)) {
         // Avoid clashes with built-in property names.
         incrementDistinctHalsteadItems(baseReport, metric, '_' + identifier);
         } else if (isHalsteadMetricDistinct(baseReport, metric, identifier)) {
         recordDistinctHalsteadMetric(baseReport, metric, identifier);
         incrementHalsteadMetric(baseReport, metric, 'distinct');
         }
         }

         function isHalsteadMetricDistinct (baseReport, metric, identifier) {
         return baseReport.halstead[metric].identifiers.indexOf(identifier) === -1;
         }

         // first if could moved up
         // isHalsteadMetricDistinct(baseReport, metric, identifier) return to negate with return
         */
        if (actualReport.halstead[type].identifiers.indexOf(identifier) !== -1) {
            return;
        }

        // recordDistinctHalsteadMetric(actualReport, type, saveIdentifier);
        actualReport.halstead[type].identifiers.push(identifier);


        // incrementHalsteadMetric(actualReport, type, 'distinct');
        actualReport.halstead[type].distinct += 1;
    };

        return function(node, operatorsOrOperands, currentReport) {
            if (!Array.isArray(operatorsOrOperands)) {
                return;
            }
            /**
             * oooItem is the short variant of operatorsOrOperandsItem
             */
            operatorsOrOperands.forEach(function (oooItem) {
                /**
                 var identifier;

                 if (check.function(s.identifier)) {
                    identifier = s.identifier(node);
                } else {
                    identifier = s.identifier;
                }
                 refactored to
                 */
                var identifier = check.function(oooItem.identifier) ? oooItem.identifier(node) : oooItem.identifier;
                //identifier = Object.prototype.hasOwnProperty(identifier) ? '_' + identifier : identifier;
                /*
                 if (check.function(s.filter) === false || s.filter(node) === true) {
                 halsteadItemEncountered(currentReport, metric, identifier);
                 }

                 !a || b -> a && !b
                 */
                if (check.function(oooItem.filter) && !oooItem.filter(node)) {
                    return;
                }
                /*
                 function halsteadItemEncountered (currentReport, metric, identifier) {
                 if (currentReport) {
                 incrementHalsteadItems(currentReport, metric, identifier);
                 }

                 incrementHalsteadItems(report.aggregate, metric, identifier);
                 }

                 var actualReport = currentReport ? currentReport || report.aggregate
                 incrementHalsteadItems(actualReport, metric, identifier);
                 */
                // halsteadItemEncountered(currentReport, type, identifier);
                if (currentReport) {
                    buildReport(currentReport, identifier);
                }
                buildReport(report.aggregate, identifier);


            });
        }
}

function processDependencies (node, syntax, clearDependencies) {
    var dependencies;

    if (check.function(syntax.dependencies)) {
        dependencies = syntax.dependencies(node, clearDependencies);
        if (check.object(dependencies) || check.array(dependencies)) {
            report.dependencies = report.dependencies.concat(dependencies);
        }

        return true;
    }

    return false;
}

function calculateMetrics (settings) {
    var count, indices, sums, averages;

    count = report.functions.length;
    debug('calculateMetrics: ' + count + ' functions found.');

    indices = {
        loc: 0,
        cyclomatic: 1,
        effort: 2,
        params: 3
    };
    sums = [ 0, 0, 0, 0 ];

    report.functions.forEach(function (functionReport) {
        calculateCyclomaticDensity(functionReport);
        calculateHalsteadMetrics(functionReport.halstead);
        sumMaintainabilityMetrics(sums, indices, functionReport);
    });

    calculateCyclomaticDensity(report.aggregate);
    calculateHalsteadMetrics(report.aggregate.halstead);
    if (count === 0) {
        // Sane handling of modules that contain no functions.
        sumMaintainabilityMetrics(sums, indices, report.aggregate);
        count = 1;
    }

    averages = sums.map(function (sum) { return sum / count; });

    calculateMaintainabilityIndex(
        averages[indices.effort],
        averages[indices.cyclomatic],
        averages[indices.loc],
        settings
    );

    Object.keys(indices).forEach(function (index) {
        report[index] = averages[indices[index]];
    });
}

function calculateCyclomaticDensity (data) {
    data.cyclomaticDensity = (data.cyclomatic / data.sloc.logical) * 100;
}

function calculateHalsteadMetrics (data) {
    data.length = data.operators.total + data.operands.total;
    if (data.length === 0) {
        nilHalsteadMetrics(data);
    } else {
        data.vocabulary = data.operators.distinct + data.operands.distinct;
        data.difficulty =
            (data.operators.distinct / 2) *
            (data.operands.distinct === 0 ? 1 : data.operands.total / data.operands.distinct);
        data.volume = data.length * (Math.log(data.vocabulary) / Math.log(2));
        data.effort = data.difficulty * data.volume;
        data.bugs = data.volume / 3000;
        data.time = data.effort / 18;
    }
}

function nilHalsteadMetrics (data) {
    data.vocabulary =
        data.difficulty =
            data.volume =
                data.effort =
                    data.bugs =
                        data.time =
                            0;
}

function sumMaintainabilityMetrics (sums, indices, data) {
    sums[indices.loc] += data.sloc.logical;
    sums[indices.cyclomatic] += data.cyclomatic;
    sums[indices.effort] += data.halstead.effort;
    sums[indices.params] += data.params;
}

function calculateMaintainabilityIndex (averageEffort, averageCyclomatic, averageLoc, settings) {
    if (averageCyclomatic === 0) {
        throw new Error('Encountered function with cyclomatic complexity zero!');
    }

    report.maintainability =
        171 -
        (3.42 * Math.log(averageEffort)) -
        (0.23 * Math.log(averageCyclomatic)) -
        (16.2 * Math.log(averageLoc));

    if (report.maintainability > 171) {
        report.maintainability = 171;
    }

    if (settings.newmi) {
        report.maintainability = Math.max(0, (report.maintainability * 100) / 171);
    }
}
