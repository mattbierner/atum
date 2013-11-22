/**
 * @fileOverview Evaluation operations.
 */
define(['exports',
        'ecma/parse/parser',
        'atum/completion',
        'atum/compute',
        'atum/fun',
        'atum/builtin/global',
        'atum/compute/program',
        'atum/context/execution_context',
        'atum/context/execution_settings',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/string',
        'atum/operations/undef',
        'atum/value/value'],
function(exports,
        parser,
        completion,
        compute,
        fun,
        global,
        program,
        execution_context,
        execution_settings,
        environment,
        error,
        execution_context_ops,
        string,
        undef,
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
var parse = function(text) {
    var ast;
    try {
        return compute.just(parser.parse(text));
    } catch (e) {
        return error.syntaxError(string.create(e));
    }
};

var extract = function(body) {
    return program.bindStatement(body, function(x) {
        if (x instanceof completion.Completion) {
            switch (x.type) {
            case completion.ThrowCompletion.type:
                return compute.error(x.value);
            
            case completion.NormalCompletion.type:
                return (x.value === null ? undef.UNDEFINED : compute.just(x.value));
            
            case completion.ReturnCompletion.type:
                return error.syntaxError(
                    string.create("Return statements are only valid inside of functions"));
                
            case completion.BreakCompletion.type:
                return error.syntaxError(
                    string.create("'break' is only valid inside a switch or loop statement"));
            
            case completion.ContinueCompletion.type:
                return error.syntaxError(
                    string.create("'continue' is only valid inside a loop statement"));
            }
        }
        return compute.just(x);
    });
};
 

/* Evaluate
 ******************************************************************************/
/**
 * Evaluate a computation in the current context.
 * 
 * Errors with syntax error if value is not a valid program. Forwards the 
 * completion of the evaluation into the calling program.
 * 
 * @param prog Program computation.
 */
var evaluate = function(prog) {
    return prog;
};

/**
 * @see evaluate
 * 
 * @param ast Program.
 */
var evaluateAst = function(ast) {
    var semantics = require('atum/semantics/semantics');
    return evaluate(
        extract(
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

/* Evaluate Eval
 ******************************************************************************/
/**
 * Evaluate a computation in an eval context.
 * 
 * Errors with syntax error if value is not a valid program. Forwards the 
 * completion of the evaluation into the calling program.
 * 
 * @param prog Program computation.
 */
var evaluateEval = function(prog) {
    return compute.bind(execution_context_ops.context, function(ctx) {
        return compute.betweenForce(
            compute.bind(execution_context_ops.createEvalContext(), execution_context_ops.setContext),
            execution_context_ops.setContext(ctx),
            prog);
    });
};

/**
 * @see evaluate
 * 
 * @param ast Program.
 */
var evaluateEvalAst = fun.compose(
    evaluateEval,
    evaluateAst);

/**
 * @see evaluate
 * 
 * @param {String} text Program string.
 */
var evaluateEvalText = fun.compose(
    evaluateEval,
    evaluateText);

/* Evaluate Modules
 ******************************************************************************/
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
      //  compute.bind(
            environment.createObjectEnvironment(global.global, null),
          //  environment.createDeclativeEnvironment),
        function(ctx, lex) {
            var newCtx = execution_context.createGlobalContext(
                execution_settings.DEFAULTS,
                lex,
                global.global);
            return compute.betweenForce(execution_context_ops.setContext(newCtx), execution_context_ops.setContext(ctx),
                prog);
        });
};

/**
 * Evaluate a ast in a new local context.
 * 
 * @see evaluateModule
 * 
 * @param ast Program ast .
 */
var evaluateModuleAst = fun.compose(
    evaluateModule,
    evaluateAst);

/**
 * Evaluate a string in a local context.
 *
 * @see evaluateModule
 * 
 * @see evaluate
 */
var evaluateModuleText = fun.compose(
    evaluateModule,
    evaluateText);

/* Evaluate Files
 ******************************************************************************/
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

exports.evaluateEval = evaluateEval;
exports.evaluateEvalAst = evaluateEvalAst;
exports.evaluateEvalText = evaluateEvalText;

exports.evaluateModule = evaluateModule;
exports.evaluateModuleAst = evaluateModuleAst;
exports.evaluateModuleText = evaluateModuleText;

exports.evaluateFile = evaluateFile;
exports.evaluateUrlFile = evaluateUrlFile;

});