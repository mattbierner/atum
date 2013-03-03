/**
 * @fileOverview Base combinatorial computations.
 * 
 * A computation takes an execution context and two callbacks, 'ok' and 'err',
 * for success and failure. Both callbacks take a value to return and a context
 * to continue computation in.
 */
define(function() {
//"use strict";

var reduceRight = Array.prototype.reduceRight;

    
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
 * Compute 'p' and if it succeeds, call 'f' with the results of 'p' as arguments.
 */
var binda = function(p, f) {
    return bind(p, function(x) {
        return f.apply(undefined, x);
    });
};

/**
 * Compute 'p', discard results and return results from 'q'.
 */
var next = function(p, q) {
    return bind(p, constant(q));
};

/* Sequence Computations
 ******************************************************************************/
var _end = always([]);

/**
 * 
 */
var cons = function(p1, p2) {
    return bind(p1, function(v1) {
        return bind(p2, function(v2) {
            return always(([v1]).concat(v2));
        });
    });
};

/**
 * 
 */
var sequence = (function(){
    var reducer = function(p, q) { return cons(q, p); };
    
    return function(/*...*/) {
        return reduceRight.call(arguments, reducer, _end);
    };
}());  

/* Examine
 ******************************************************************************/
var extract = function(f) {
    return function(ctx, ok, err) {
        return ok(f(ctx), ctx);
    };
};

var context = extract(identity);

/* Export
 ******************************************************************************/
return {
// Basic Computations
    'always': always,
    'never': never,
    'bind': bind,
    'binda': binda,
    'next': next,
    
// Sequence Computations
    'sequence': sequence,
    
// State interaction
    'extract': extract,
    'context': context
};

});