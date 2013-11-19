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
        'atum/semantics/program',
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
        program_semantics,
        value) {
"use strict";

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

/* Internal
 ******************************************************************************/
var extract = function(c) {
    return compute.bind(c, function(x) {
        return (x instanceof completion.ErrorCompletion ?
            compute.error(x.value) :
            compute.just(x.value));
    });
};

var parse = function(text) {
    var ast;
    try {
        return compute.just(parser.parse(text));
    } catch (e) {
        return error.syntaxError(string.create(e));
    }
};

/* Operations
 ******************************************************************************/
/**
 * Evaluate a computation in an eval context.
 * 
 * Errors with syntax error if value is not a valid program. Forwards the 
 * completion of the evaluation into the calling program.
 * 
 * @param prog Program computation.
 */
var evaluate = function(prog) {
    return compute.bind(execution_context_ops.context, function(ctx) {
        return compute.between(
            compute.bind(execution_context_ops.createEvalContext(), execution_context_ops.setContext),
            execution_context_ops.setContext(ctx),
            extract(prog));
    });
};

/**
 * @see evaluate
 * 
 * @param ast Program.
 */
var evaluateAst = function(ast) {
    var semantics = require('atum/semantics/semantics');
    return evaluate(
        program_semantics.programBody(
            semantics.sourceElements(ast.body)));
};

/**
 * @see evaluate
 * 
 * @param {String} text Program string.
 */
var evaluateText = function(text) {
    return compute.bind(
        parse(text),
        evaluateAst);
};

/**
 * Evaluate a computation in a new local context.
 * 
 * The context uses an isolated environment but the global object is shared with
 * the current environment.
 * 
 * @param prog Program computation.
 */
var evaluateModule = function(prog) {
    return compute.binary(
        execution_context_ops.context,
        environment.createObjectEnvironment(global.global, null),
        function(ctx, lex) {
            var newCtx = new execution_context.createGlobalContext(
                execution_settings.DEFAULTS,
                lex,
                global.global);
            return compute.between(execution_context_ops.setContext(newCtx), execution_context_ops.setContext(ctx),
                extract(prog));
        });
};

/**
 * Evaluate a ast in a new local context.
 * 
 * @see evaluateModule
 * 
 * @param ast Program ast .
 */
var evaluateModuleAst = function(ast) {
    var semantics = require('atum/semantics/semantics');
    return evaluateModule(
        program_semantics.programBody(
            semantics.sourceElements(ast.body)));
};

/**
 * Evaluate a string in a local context.
 *
 * @see evaluateModule
 * 
 * @see evaluate
 */
var evaluateModuleText = function(text) {
    return compute.bind(
        parse(text),
        evaluateModuleAst);
};

/**
 * Evaluate a file loaded from a given url.
 */
var evaluateUrlFile = function(name) {
    try {
        var x = getFile(name);
        return evaluateModuleText(x);
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
        return evaluateModuleText(x);
    } catch (e) {
        return error.syntaxError(string.create(e));
    }
};

/* 
 ******************************************************************************/
exports.evaluate = evaluate;
exports.evaluateAst = evaluateAst;
exports.evaluateText = evaluateText;

exports.evaluateModule = evaluateModule;
exports.evaluateModuleAst = evaluateModuleAst;
exports.evaluateModuleText = evaluateModuleText;

exports.evaluateFile = evaluateFile;
exports.evaluateUrlFile = evaluateUrlFile;

});