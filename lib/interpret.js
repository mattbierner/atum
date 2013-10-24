/**
 * @fileOverview Functions for interpreting an ECMAScript abstract syntax tree.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/compute/context',
        'atum/compute/tail',
        'atum/debug/debugger',
        'atum/semantics/semantics'],
function(exports,
        compute,
        fun,
        context,
        tail,
        atum_debugger,
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
    return tail.trampoline(
        p(context.ComputeContext.setFail(ctx, function(x, ctx) {
            return err(x, ctx);
        }), ok, err));
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
 * Execute `p` with given context and callbacks to completion.
 * 
 * Unlike `exec`, this always runs `p` until it completes even if it returns
 * debuggable values.
 */
var complete = function(p, ctx, ok, err) {
    return atum_debugger.Debugger.create(p, ctx, ok, err)
        .finish()
        .k;
};

/**
 * Interpret AST `root` to completion with given context and callbacks.
 */
var interpret = function(root, ctx, ok, err) {
    return complete(semantics.mapSemantics(root), ctx, ok, err);
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
exports.complete = complete;
exports.interpret = interpret;
exports.evaluateContext = evaluateContext;
exports.evaluate = evaluate;

});