/**
 * @fileOverview Base combinatorial computations.
 * 
 * A computation takes an execution context and two callbacks, 'ok' and 'err',
 * for success and failure. Both callbacks take a value to return and a context
 * to continue computation in.
 */
define(function() {
//"use strict";

/* Helper functionss
 ******************************************************************************/
var curry = function(f) {
    return ((arguments.length === 1) ? f : f.bind.apply(f, arguments));
};

var identity = function(x) {
    return x;
};

var constant = function(x) {
    return function() {
        return x;
    };
};
    
/* Computations
 ******************************************************************************/
/**
 * Computation that always succeeds with value 'x' and existing context.
 */
var always = function(x) {
    return function(ctx, ok, err) {
        return ok(x, ctx);
    };
};

/**
 * Computation that always fails with value 'x' and existing context.
 */
var never = function(x) {
    return function(ctx, ok, err) {
        return err(x, ctx);
    };
};

/**
 * Compute 'p' and if it succeeds, call 'f' with results. 'f' returns the next
 * computation to perform. Return results from computation given by 'f'.
 */
var bind = function(p, f) {
    return function(ctx, ok, err) {
        return p(ctx, function(x, ctx) { return f(x)(ctx, ok, err); }, err);
    };
};

/**
 * Compute 'p', discard results and return results from 'q'.
 */
var next = function(p, q) {
    return bind(p, constant(q));
};

/* Export
 ******************************************************************************/
return {
    'always': always,
    'never': never,
    'bind': bind,
    'next': next
};

});