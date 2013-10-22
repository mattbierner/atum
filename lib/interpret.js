/**
 * @fileOverview Functions for interpreting an ECMAScript abstract syntax tree.
 */
define(['atum/compute',
        'atum/compute/context',
        'atum/debug/debugger',
        'atum/semantics/semantics'],
function(compute,
        context,
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
    return trampoline(p(ctx, ok, err));
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
return {
// Callbacks
    'ret': ret,
    'thr': thr,
    'noop': noop,
    
// Evaluation
    'exec': exec,
    
    'runContext': runContext,
    'run': run,
    'complete': complete,
    'interpret': interpret,
    'evaluateContext': evaluateContext,
    'evaluate': evaluate
};

});