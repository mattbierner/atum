/**
 * @fileOverview Evaluation operations.
 */
define(['exports',
        'ecma/parse/parser',
        'atum/completion',
        'atum/compute',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/string',
        'atum/value/value'],
function(exports,
        parser,
        completion,
        compute,
        error,
        execution_context,
        string,
        value) {
//"use strict";

var getFile = function(path) {
    if (typeof module !== 'undefined' && module.exports) {
        var fs = require.nodeRequire('fs');
        return fs.readFileSync(path, 'utf8');
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send(null);

    if (xhr.status > 399 && xhr.status < 600)
        throw new Error(path + ' HTTP status: ' + xhr.status);
    
    return xhr.responseText;
};
    
/* Operations
 ******************************************************************************/
/**
 * Evaluate a string as a program in the current context.
 * 
 * Errors with syntax error if value is not a valid program. Forwards the 
 * completion of the evaluation into the calling program.
 * 
 * @param {String} value Program string.
 */
var evaluate = function(value) {
    var semantics = require('atum/semantics/semantics');

    var ast;
    try {
        ast = parser.parse(value);
    } catch (e) {
        return error.syntaxError(string.create(e + ""));
    }
    
    var prog = semantics.sourceElements(ast.body);
    return compute.bind(execution_context.context, function(ctx) {
        return compute.between(compute.bind(execution_context.createEvalContext(), execution_context.setContext), execution_context.setContext(ctx),
            compute.bind(prog, function(x) {
                return (x instanceof completion.ErrorCompletion ?
                    compute.error(x.value) :
                    compute.just(x.value));
            }));
    });
};

var evaluateUrlFile = function(name) {
    try {
        var x = getFile(name);
        return evaluate(x);
    } catch (e) {
        return error.syntaxError(string.create(e + ""));
    }
};

var evaluateFile = function(name) {
    try {
        var x = require('text!' + name);
        return evaluate(x);
    } catch (e) {
        return error.syntaxError(string.create(e + ""));
    }
};

/* 
 ******************************************************************************/
exports.evaluate = evaluate;
exports.evaluateFile = evaluateFile;
exports.evaluateUrlFile = evaluateUrlFile;

});