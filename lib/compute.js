/**
 * @fileOverview Base combinatorial computations.
 * 
 * A computation takes an execution context and two callbacks, 'ok' and 'err',
 * for success and failure. Both callbacks take a value to return and a context
 * to continue computation in.
 */
define(['amulet/object'],
function(amulet_object) {
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

/* Creation
 ******************************************************************************/
/**
 * Creates a named computation.
 * 
 * @param {string} name Human readable name used to identify this computation for
 *     debugging purposes..
 */
var Computation = function(name, impl){
    return Object.defineProperties(impl, {
        'displayName': {
            'value': name,
            'writable': false
        }
    });
};
    
/* Computations
 ******************************************************************************/
/**
 * Computation that always succeeds with value 'x' and existing context.
 */
var always = function(x) {
    return function(ctx, v, ok, err) {
        return ok(x, ctx, v);
    };
};

/**
 * Computation that always fails with value 'x' and existing context.
 */
var never = function(x) {
    return function(ctx, v, ok, err) {
        return err(x, ctx, v);
    };
};

/**
 * Compute 'p' and if it succeeds, call 'f' with results. 'f' returns the next
 * computation to perform. Return results from computation given by 'f'.
 */
var bind = function(p, f) {
    if (!p || !f) {
        debugger;
    }
    return function(ctx, v, ok, err) {
        return p(ctx,
            v,
            function(x, ctx, v) { return f(x)(ctx, v, ok, err); },
            err);
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
/**
 * 
 */
var extract = function(f) {
    return function(ctx, v, ok, err) {
        return ok(f(ctx), ctx, v);
    };
};

/**
 * 
 */
var context = Computation('Context',
    extract(identity));

/* Values
 ******************************************************************************/

/**
 * 
 */
var values = function(ctx, v, ok, err) {
    return ok(v, ctx, v);
};


/**
 * 
 */
var getValue = function(key) {
    return bind(
        values,
        function(v) {
            return always(v[key]);
        });
};

/**
 * 
 */
var setValue = function(key, value) {
    return bind(
        value,
        function(x) {
            return function(ctx, v, ok, err) {
                return ok(x, ctx, amulet_object.defineProperty(v, key, {
                    'value': x,
                    'enumerable': true,
                    'configurable': true
                }));
            };
        });
};


/* Export
 ******************************************************************************/
return {
// Creation
    'Computation': Computation,

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
    'context': context,

// Values
    'values': values,
    'getValue': getValue,
    'setValue': setValue
};

});