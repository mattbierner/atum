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

/* Helper functions
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
            function(x, ctx, v) { return f(x, ctx, v)(ctx, v, ok, err); },
            err);
    };
};


/**
 * Compute 'p' and if it fails, call 'f' with results. 'f' returns the next
 * computation to perform. Return results from computation given by 'f'.
 */
var bindError = function(p, f) {
    if (!p || !f) {
        debugger;
    }
    return function(ctx, v, ok, err) {
        return p(ctx,
            v,
            ok,
            function(x, ctx, v) { return f(x, ctx, v)(ctx, v, ok, err); });
    };
};

/**
 * Compute 'p' and if it succeeds, call 'f' with the results of 'p' as arguments.
 */
var binds = function(p, f) {
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

/**
 * Compute 'p', discard results and return results from 'p'.
 */
var then = function(p, q) {
    return bind(p, function(x) {
        return next(q, always(x));
    });
};


/* 
 ******************************************************************************/
var modifyContext = function(f) {
    return function(ctx, v, ok, err) {
        var newCtx = f(ctx);
        return ok(newCtx, newCtx, v);
    }
};

var setContext = function(ctx) {
    return modifyContext(constant(ctx));
};

/**
 * Computation that succeeds with the current context.
 */
var getContext = function() {
    return modifyContext(identity);
};

/* Examine
 ******************************************************************************/
/**
 * Computation that examines the current context with function 'f' and succeeds
 * with result.
 */
var extract = function(f) {
    return function(ctx, v, ok, err) {
        return ok(f(ctx), ctx, v);
    };
};



/* Sequence Computations
 ******************************************************************************/
var _end = always([]);

/**
 * Computation that 'cons' result of value onto list result of 'rest'
 */
var cons = function(value, rest) {
    return bind(value, function(x) {
        return bind(rest, function(xs) {
            return always(([x]).concat(xs));
        });
    });
};

/**
 * Computation that performs a sequence of computations in order and succeeds
 * with a list of results.
 */
var sequence = (function(){
    var reducer = function(p, q) { return cons(q, p); };
    
    return function(/*...*/) {
        return reduceRight.call(arguments, reducer, _end);
    };
}());  



/* Values
 ******************************************************************************/
/**
 * Computation that succeeds with the current computation values.
 */
var values = function(ctx, v, ok, err) {
    return ok(v, ctx, v);
};

/**
 * Computation that gets the stored value for 'key'
 */
var getValue = function(key) {
    return bind(
        values,
        function(v) {
            return always(v[key]);
        });
};

/**
 * Computation that sets the value for 'key' to the result of 'value'.
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
    'bindError': bindError,

    'binds': binds,
    'next': next,
    'then': then,
    
//
    'modifyContext': modifyContext,
    'setContext': setContext,
    'getContext': getContext,

// Sequence Computations
    'sequence': sequence,
    
// State interaction
    'extract': extract,

// Values
    'values': values,
    'getValue': getValue,
    'setValue': setValue
};

});