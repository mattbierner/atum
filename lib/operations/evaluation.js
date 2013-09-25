/**
 * @fileOverview Evaluation operations.
 */
define(['exports',
        'ecma/parse/parser',
        'atum/completion',
        'atum/compute',
        'atum/builtin/global',
        'atum/context/execution_context',
        'atum/context/execution_settings',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/string',
        'atum/value/value'],
function(exports,
        parser,
        completion,
        compute,
        global,
        execution_context,
        execution_settings,
        environment,
        error,
        execution_context_ops,
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
    return compute.bind(execution_context_ops.context, function(ctx) {
        return compute.between(compute.bind(execution_context_ops.createEvalContext(), execution_context_ops.setContext), execution_context_ops.setContext(ctx),
            compute.bind(prog, function(x) {
                return (x instanceof completion.ErrorCompletion ?
                    compute.error(x.value) :
                    compute.just(x.value));
            }));
    });
};

/**
 * Evaluate a string in a local context.
 * 
 * The context uses an isolated environment but the global object is shared with
 * the current environment.
 * 
 * @see evaluate
 */
var evaluateModule = function(value) {
    return compute.bind(execution_context_ops.context, function(ctx) {
        return compute.bind(
            environment.createObjectEnvironment(null, global.global),
            function(env) {
                return compute.bind(environment.createDeclativeEnvironment(env), function(lex) {
                    var newCtx = new execution_context.createGlobalContext(
                        execution_settings.DEFAULTS,
                        lex,
                        global.global);
                    return compute.between(execution_context_ops.setContext(newCtx), execution_context_ops.setContext(ctx),
                        evaluate(value));
                });
            });
    });
};

/**
 * Evaluate a file loaded from a given url.
 */
var evaluateUrlFile = function(name) {
    try {
        var x = getFile(name);
        return evaluateModule(x);
    } catch (e) {
        return error.syntaxError(string.create(e));
    }
};

/**
 * Evaluate a file loaded from a given module path.
 */
var evaluateFile = function(name) {
    try {
        var x = require('text!' + name);
        return evaluateModule(x);
    } catch (e) {
        return error.syntaxError(string.create(e));
    }
};

/* 
 ******************************************************************************/
exports.evaluate = evaluate;
exports.evaluateModule = evaluateModule;

exports.evaluateFile = evaluateFile;
exports.evaluateUrlFile = evaluateUrlFile;

});