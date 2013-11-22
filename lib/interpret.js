/**
 * @fileOverview Functions for interpreting an ECMAScript abstract syntax tree.
 */
define(['exports',
        'atum/compute/program',
        'atum/compute/context',
        'atum/compute/tail',
        'atum/semantics/semantics'],
function(exports,
        program,
        context,
        tail,
        semantics){
"use strict";

/* Callbacks
 ******************************************************************************/
/**
 * Standard success callback.
 * 
 * Returns 'x'.
 */
var ret = function(x, ctx) {
    return x;
};

/**
 * Standard error callback.
 * 
 * Throws 'x'.
 */
var thr = function(x, ctx) {
    throw x;
};

/**
 * Noop
 */
var noop = function() { };

/* Interpretation
 ******************************************************************************/
/**
 * Execute `p` with given context and callbacks.
 */
var exec = function(p, ctx, ok, err) {
    return program.run(p, ctx, ok, err);
};

/**
 * Perform `p` in `ctx` with standard callbacks.
 */
var runContext = function(p, ctx) {
    return exec(p, ctx, ret, thr);
};

/**
 * Perform `p` with standard callbacks.
 */
var run = function(p) {
    return runContext(p, context.ComputeContext.empty);
};

/**
 * Interpret AST `root` to completion with given context and callbacks.
 */
var interpret = function(root, ctx, ok, err) {
    return run(semantics.mapSemantics(root), ctx, ok, err);
};

/**
 * Interprets AST `root` to completion with standard callbacks.
 */
var evaluateContext = function(root, ctx) {
    return interpret(root, ctx, ret, thr);
};

/**
 * Interprets AST `root` to completion with empty context and callbacks.
 *
 */
var evaluate = function(root) {
    return evaluateContext(root, context.ComputeContext.empty);
};

/* Export
 ******************************************************************************/
// Callbacks
exports.ret = ret;
exports.thr = thr;
exports.noop = noop;

// Evaluation
exports.exec = exec;
    
exports.runContext = runContext;
exports.run = run;

exports.interpret = interpret;

exports.evaluateContext = evaluateContext;
exports.evaluate = evaluate;

});