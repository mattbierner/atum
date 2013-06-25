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

var reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight);


/* Helper functions
 ******************************************************************************/
var curry = function(f /*, ...*/) {
    return f.bind.apply(f, arguments);
};

var identity = function(x) {
    return x;
};

var constant = function(x) {
    return function() {
        return x;
    };
};

/* Context
 ******************************************************************************/
var Context = function(values, userData) {
    this.values = values;
    this.userData = userData;
};

Context.setValues = function(ctx, values) {
    return new Context(values, ctx.userData);
};

Context.setUserData = function(ctx, ud) {
    return new Context(ctx.values, ud);
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

/* Base Computations
 ******************************************************************************/
/**
 * Computation that always succeeds with value 'x' and existing context.
 */
var just = function(x) {
    return function(ctx, ok, err) {
        return ok(x, ctx);
    };
};

/**
 * Computation that always fails with value 'x' and existing context.
 */
var error = function(x) {
    return function(ctx, ok, err) {
        return err(x, ctx);
    };
};

/**
 * Compute 'p' and if it succeeds, call 'f' with results. 'f' returns the next
 * computation to perform. Return results from computation given by 'f'.
 */
var bind = function(p, f) {
    if (!p || !p.call || !f || !f.call) {
        debugger;
    }
    return function(ctx, ok, err) {
        return p(ctx,
            function(x, ctx) { return f(x, ctx)(ctx, ok, err); },
            err);
    };
};


/**
 * Compute 'p' and if it fails, call 'f' with results. 'f' returns the next
 * computation to perform. Return results from computation given by 'f'.
 */
var bindError = function(p, f) {
    if (!p || !p.call || !f || !f.call) {
        debugger;
    }
    return function(ctx, ok, err) {
        return p(ctx,
            ok,
            function(x, ctx) { return f(x, ctx)(ctx, ok, err); });
    };
};

/* Continuations
 ******************************************************************************/
/**
 * Captures the execution state.
 * 
 * @param f Function called with two arguments, kok and kerr, for the current
 *    success continuation and failure continuations. Returns either a computation
 *    or the result of calling kok or kerr.
 */
var callcc = function(f) {
    return function(ctx, ok, err) {
        return f(function(x) {
            return function(/*ctx, ok, err*/) { return ok(x, ctx); }
        },
        function(x) {
            return function(/*ctx, ok, err*/) { return err(x, ctx); }
        })(ctx, ok, err);
    };
};

/**
 * 
 */
var abrupt = function(x) {
    return function(/*ctx, ok, err*/) {
        return x;
    };
};


/* Helper Computations
 ******************************************************************************/


var empty = just(null);

/**
 * Compute 'p' and if it succeeds, call 'f' with the results of 'p' as arguments.
 */
var binds = function(p, f) {
    return bind(p, function(x) {
        return f.apply(undefined, x);
    });
};

var binary = function(l, r, f) {
    return bind(l, function(lVal) {
        return bind(r, function(rVal) {
            return f(lVal, rVal);
        });
    });
};

/**
 * Compute 'p', discard results and return results from 'q'.
 */
var next = function(p, q) {
    if (!p || !p.call || !q || !q.call) {
        debugger;
    }
    return bind(p, constant(q));
};

/**
 * Compute 'p', discard results and return results from 'p'.
 */
var then = function(p, q) {
    if (!p || !p.call || !q || !q.call) {
        debugger;
    }
    return bind(p, function(x) {
        return next(q, just(x));
    });
};


/* Context Computations
 ******************************************************************************/
var modifyComputeContext = function(f) {
    return function(ctx, ok, err) {
        var newCtx = f(ctx);
        return ok(newCtx, newCtx);
    }
};

var setComputeContext = function(ctx) {
    return modifyComputeContext(constant(ctx));
};

/**
 * Computation that succeeds with the current context.
 */
var getComputeContext = function() {
    return modifyComputeContext(identity);
};

/**
 * Computation that examines the current context with function 'f' and succeeds
 * with result.
 */
var extractComputeContext = function(f) {
    return bind(getComputeContext(), function(ctx) {
        return just(f(ctx));
    });
};

/**
 * Computation that succeeds with the current computation values.
 */
var modifyValues = function(f) {
    return modifyComputeContext(function(ctx) {
        return Context.setValues(ctx, f(ctx.values));
    });
};

/**
 * Computation that succeeds with the current computation values.
 */
var setValues = function(v) {
    return modifyValues(constant(v));
};

/**
 * Computation that succeeds with the current computation values.
 */
var getValues = function() {
    return extractComputeContext(function(ctx) { return ctx.values; })
};

/**
 * Computation that gets the stored value for 'key'
 */
var getValue = function(key) {
    return bind(getValues(), function(v) {
        return just(v[key]);
    });
};

/**
 * Computation that sets the value for 'key' to 'x'.
 */
var setValue = function(key, x) {
    return modifyValues(function(v){
        return amulet_object.defineProperty(v, key, {
            'value': x,
            'enumerable': true,
            'configurable': true
        });
    });
};

/**
 * Computation that succeeds with the current computation values.
 */
var modifyContext = function(f) {
    return modifyComputeContext(function(ctx) {
        return Context.setUserData(ctx, f(ctx.userData));
    });
};

/**
 * Computation that succeeds with the current computation values.
 */
var setContext = function(ud) {
    return modifyContext(constant(ud));
};

/**
 * Computation that succeeds with the current computation values.
 */
var getContext = function() {
    return extractComputeContext(function(ctx) { return ctx.userData; })
};

var extract = function(f) {
    return bind(getContext(), function(ctx) {
        return just(f(ctx));
    });
};

/* Sequence Computations
 ******************************************************************************/
var _end = just([]);

/**
 * Computation that cons result of 'value' onto list result of 'rest'
 */
var cons = function(value, rest) {
    return binary(value, rest, function(x, xs) {
        return just(([x]).concat(xs));
    });
};

/**
 * Computation that performs a sequence of computations in order and succeeds
 * with a list of results.
 */
var sequencea = (function(){
    var reducer = function(p, c) { return cons(c, p); };
    
    return function(arr) {
        return reduceRight(arr, reducer, _end);
    };
}());  

/**
 * Computation that performs a sequence of computations in order and succeeds
 * with a list of results.
 */
var sequence = function(/*...*/) {
    return sequencea(arguments);
};



/* Values Computations
 ******************************************************************************/


/* Export
 ******************************************************************************/
return {
    'Context': Context,
    
// Creation
    'Computation': Computation,

// Basic Computations
    'just': just,
    'error': error,
    'bind': bind,
    'bindError': bindError,
    
// Continuation Computations
    'callcc': callcc,
    'abrupt': abrupt,
    
// Helper Computations
    'empty': empty,
    'binds': binds,
    'next': next,
    'then': then,
    
    'binary': binary,

// Context Computations
    'modifyComputeContext': modifyComputeContext,
    'setComputeContext': setComputeContext,
    'getComputeContext': getComputeContext,
    'extractComputeContext': extractComputeContext,
    
    'modifyValues': modifyValues,
    'setValues': setValues,
    'getValues': getValues,
    'getValue': getValue,
    'setValue': setValue,
    
    'modifyContext': modifyContext,
    'setContext': setContext,
    'getContext': getContext,
    'extract': extract,
    
// Sequence Computations
    'sequencea': sequencea,
    'sequence': sequence,

};

});