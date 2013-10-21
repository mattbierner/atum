/**
 * @fileOverview Base combinatorial computations.
 */
define(['amulet/object',
        'atum/fun',
        'atum/compute/cont'],
function(amulet_object,
        fun,
        cont) {
//"use strict";

/* Context
 ******************************************************************************/
/**
 * A computation state.
 * 
 * @param values Object that maps keys to values referenced in a computation.
 * @param userData User computation context.
 * @param now Current time of the context.
 * @param prompt Index of current prompt.
 */
var ComputeContext = function(values, userData, now, prompt, fail) {
    this.values = values;
    this.userData = userData;
    this.now = now;
    this.prompt = prompt;
    this.fail = fail;
};

/**
 * Empty computation context that stores no values and has no user data.
 */
ComputeContext.empty = new ComputeContext({}, null, null, 0, null);

ComputeContext.create = function(fail) {
    return ComputeContext.setFail(ComputeContext.empty, fail);
};

/**
 * Create a new context with given values.
 */
ComputeContext.setValues = function(ctx, values) {
    return new ComputeContext(
        values,
        ctx.userData,
        ctx.now,
        ctx.prompt,
        ctx.fail);
};

/**
 * Create a new context given user data.
 */
ComputeContext.setUserData = function(ctx, ud) {
    return new ComputeContext(
        ctx.values,
        ud,
        ctx.now,
        ctx.prompt,
        ctx.fail);
};

/**
 * Create a new context with given current time.
 */
ComputeContext.setNow = function(ctx, now) {
    return new ComputeContext(
        ctx.values,
        ctx.userData,
        now,
        ctx.prompt,
        ctx.fail);
};

/**
 */
ComputeContext.setPrompt = function(ctx, prompt) {
    return new ComputeContext(
        ctx.values,
        ctx.userData,
        ctx.now,
        prompt,
        ctx.fail);
};

/**
 */
ComputeContext.setFail = function(ctx, fail) {
    return new ComputeContext(
        ctx.values,
        ctx.userData,
        ctx.now,
        ctx.prompt,
        fail);
};


/* Continuations
 ******************************************************************************/
var Seg = function(f, k) {
    this.frame = f;
    this.k = k;
};

var P = function(t, k) {
    this.prompt = t;
    this.k = k;
};


var appseg = function(f, x, ctx) {
    return f(x, ctx);
};

var appk = function(k, x, ctx) {
    if (Array.isArray(k)) {
        if (k[0] instanceof Seg) {
            return appseg(k[0].frame, x, ctx)(ctx, k.slice(1));
        }
        if (k[0] instanceof P)
            return appk(k.slice(1), x, ctx);
        return k[0](x, ctx);
    }
    return k(x, ctx);
};

var pushP = function(t, k) {
    return [].concat(new P(t, k), [k]);
};

var pushSeg = function(f, k) {
    return [].concat(new Seg(f, k), k);
};

var pushSeq = function(sub, k) {
    return [].concat(sub, k);
};

var splitSeq = function(t, k) {
    if (k.length) {
        if (k[0] instanceof P && k.prompt === t)
            return [null, k.k];
        
        var sub = splitSeq(t, k.slice(1));
        if (sub[0] instanceof Seg)
            return [pushSeg(k.f, sub[0]), sub[1]];
        
        if (sub[0] instanceof P)
            return [pushP(k.prompt, sub[0]), sub[1]];
        
        return [sub[0], sub[1]];
    }
    return [k, null]
};

/* Creation
 ******************************************************************************/
/**
 * Creates a named computation.
 * 
 * @param {string} name Human readable name used to identify this computation for
 *     debugging purposes.
 */
var Computation = function(name, impl) {
    return Object.defineProperties(impl, {
        'displayName': {
            'value': name,
            'writable': false
        }
    });
};

/* Base Computations
 ******************************************************************************/
var run = function(c) {
    return pushPrompt(0, c);
};

/**
 * Computation that always succeeds with value 'x' and existing context.
 */
var just = function(x) {
    if (x === undefined || x && typeof  x ==='function')
        debugger;
    
    return function(ctx, k) {
        return appk(k, x, ctx);
    };
};

/**
 * Computation that always fails with value 'x' and existing context.
 */
var error = function(x) {
    return function(ctx, k) {
        return ctx.fail(x, ctx);
    };
};

/**
 * Compute 'p' and if it succeeds, call 'f' with results. 'f' returns the next
 * computation to perform. Return results from computation given by 'f'.
 */
var bind = function(p, f) {
    if (!p || !p.call || !f || !f.call)
        debugger;
    
    return function(ctx, k) {
        return p(ctx, pushSeg(f, k));
    };
};


/**
 * Compute 'p' and if it fails, call 'f' with results. 'f' returns the next
 * computation to perform. Return results from computation given by 'f'.
 */
var bindError = function(p, f) {
    if (!p || !p.call || !f || !f.call)
        debugger;
    
    return function(ctx, k) {
        var old = ctx.fail;
        return p(
            ComputeContext.setFail(ctx, function(x, ctx) {
                return f(x, ctx)(ComputeContext.setFail(ctx, old), k);
            }),
            k);
          
    };
};

/* Continuations
 ******************************************************************************/
/**
 * Call with current continuation. Captures the execution state of a computation.
 * 
 * @param f Function called with two arguments, kok and kerr, for the current
 *    success continuation and failure continuations. Returns either a computation
 *    or the result of calling kok or kerr.
 */
var callcc = function(f) {
   /* var abort = function(e) { return withCont(function(k) { return e; }); };
    
    var reify = function(k) {
        return function(x, ctx) {
            return abort(
                pushSubCont(k, function() {
                    return appk(k, x, ctx);
                }));
        };
    };
    
    return withCont(function(k) {
        return pushSubCont(k, f(reify(k)));
    });
    */
    return function(ctx, k) {
        return f(function(x, ctx) {
            return appk(k, x, ctx);
        })(ctx, k);
    };
};

var withCont = function(f) {
    return withSubCont(0, function(k, ctx) {
        return pushPrompt(0, f(k, ctx));
    });
};

/**
 * Computation that returns 'x' immediately, without calling any continuation.
 * 
 * @param x Value to return.
 */
var abrupt = function(x) {
    return function(/*ctx, k*/) {
        return x;
    };
};

/**
 * 
 */
var newPrompt = function(ctx, k) {
    return appk(k, ctx.prompt, ComputeContext.setPrompt(ctx, ctx.prompt + 1));
};

/**
 * 
 */
var pushPrompt = function(t, c) {
    return function(ctx, k) {
        return c(ctx, pushP(t, k));
    };
};

/**
 * 
 */
var withSubCont = function(t, f) {
    return function(ctx, k) {
        var sub = splitSeq(t, k);
        return f(sub[0], ctx)(ctx, sub[1]);
    };
};

/**
 * 
 */
var pushSubCont = function(subk, c) {
    return function(ctx, k) {
        return c(ctx, pushSeq(subk, k));
    };
};

/* Helper Computations
 ******************************************************************************/
/**
 * Noop computation.
 */
var empty = just(null);

/**
 * Compute 'p' and if it succeeds, call 'f' with the results of 'p' as arguments.
 */
var binds = function(p, f) {
    return bind(p, function(x) {
        return f.apply(undefined, x);
    });
};

/**
 * Compute 'l' then 'r' and call 'f' with results.
 */
var binary = function(l, r, f) {
    return bind(l, function(lVal) {
        return bind(r, function(rVal) {
            return f(lVal, rVal);
        });
    });
};

/**
 * Compute 'p', discard results and return result from 'q'.
 */
var next = function(p, q) {
    if (!p || !p.call || !q || !q.call)
        debugger;
    
    return bind(p, fun.constant(q));
};

/**
 * Compute 'p', discard results and return results from 'p'.
 */
var then = function(p, q) {
    if (!p || !p.call || !q || !q.call) {
        debugger;
    }
    return bind(p, fun.compose(fun.curry(next, q), just))
};


/**
 * Compute `open`, `p`, then `close`, returning results from `p`.
 */
var between = function(open, close, p) {
    return next(open, then(p, close));
};

/* Context Computations
 ******************************************************************************/
/**
 * Computation that alters the computation context with function 'f'.
 * 
 * @param f Function that takes the existing computation context and returns 
 *     a new context.
 */
var modifyComputeContext = function(f) {
    return function(ctx, k) {
        var newCtx = f(ctx);
        return appk(k, newCtx, newCtx);
    }
};

/**
 * Computation taht sets the computation contex to 'ctx'.
 */
var setComputeContext = fun.compose(
    modifyComputeContext,
    fun.constant);

/**
 * Computation that succeeds with the compute context.
 */
var computeContext = modifyComputeContext(fun.identity);

/**
 * Computation that examines the compute context with function 'f' and
 * succeeds with result.
 */
var extractComputeContext = function(f) {
    return bind(computeContext, fun.compose(just, f));
};

/**
 * Computation that modifies the compute context values with 'f'.
 * 
 * @param f Function that takes the current values and returns the new values.
 */
var modifyValues = function(f) {
    return modifyComputeContext(function(ctx) {
        return ComputeContext.setValues(ctx, f(ctx.values));
    });
};

/**
 * Computation sets the compute context values to 'values'
 */
var setValues = fun.compose(
    modifyValues,
    fun.constant);

/**
 * Computation that succeeds with the context values.
 */
var values = extractComputeContext(function(ctx) {
    return ctx.values;
});

/**
 * Computation that gets the stored value for 'key'.
 */
var getValue = function(key) {
    return bind(values, function(v) {
        return just(v.hasOwnProperty(key) ? v[key] : null);
    });
};

/**
 * Computation that sets the stored value for 'key' to 'x'.
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
 * Computation that modifies the user context with 'f'.
 * 
 * @param f Function that takes the current user context and returns a 
 *    new user context.
 */
var modifyContext = function(f) {
    return modifyComputeContext(function(ctx) {
        return ComputeContext.setUserData(ctx, f(ctx.userData));
    });
};

/**
 * Computation that sets the user context to 'ud'.
 */
var setContext = fun.compose(modifyContext, fun.constant);
/**
 * Computation that succeeds with the user context.
 */
var context = extractComputeContext(function(ctx) {
    return ctx.userData;
});

/**
 * Computation that extract a value from the user context with 'f'.
 * 
 * @param f Function that takes the current user context and returns the value
 *    to succeed with.
 */
var extract = fun.compose(
    fun.curry(bind, context),
    fun.curry(fun.compose, just));

/**
 * Computation that modifies the compute context values with 'f'.
 * 
 * @param f Function that takes the current values and returns the new values.
 */
var modifyNow = function(f) {
    return modifyComputeContext(function(ctx) {
        return ComputeContext.setNow(ctx, f(ctx.now));
    });
};

/**
 * Computation sets the compute context now time to 'now'
 */
var setNow = fun.compose(modifyNow, fun.constant);

/**
 * Computation that succeeds with the computation now time.
 */
var getNow = extractComputeContext(function(ctx) {
    return ctx.now;
});


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
 * Computation that performs a sequence of computations in order and returns
 * the last result.
 */
var sequencea = fun.curry(fun.reduce, next, empty);

/**
 * Same as 'sequencea' but takes an argument list of computation.
 */
var sequence = fun.compose(sequencea, fun.args);

/**
 * Computation that performs an ordered sequence of computations and succeeds
 * with a list of results.
 */
var enumerationa = fun.curry(fun.reduceRight, fun.flip(cons), _end);

/**
 * Same as 'enumerationa' but takes an argument list of computations.
 */
var enumeration = fun.compose(enumerationa, fun.args);

/* 
 ******************************************************************************/
var yes = just(true);

var no = just(false);

var bool = function(x) {
    return (x ? yes : no);
};

var branch = function(test, conditional, alternative) {
    alternative = alternative || empty;
    return bind(test, function(x) {
        return (x ? conditional : alternative);
    });
};

/* 
 ******************************************************************************/
var lift = fun.curry(fun.compose, just);

/* Export
 ******************************************************************************/
return {
    'cont': cont.cont,
    'trampoline': cont.trampoline,
    
    'ComputeContext': ComputeContext,
    
// Creation
    'Computation': Computation,
'appk': appk,

// Basic Computations
    'run': run,
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
    'between': between,
    'binary': binary,

// Context Computations
    'modifyComputeContext': modifyComputeContext,
    'setComputeContext': setComputeContext,
    'computeContext': computeContext,
    'extractComputeContext': extractComputeContext,
    
    'modifyValues': modifyValues,
    'setValues': setValues,
    'values': values,
    'getValue': getValue,
    'setValue': setValue,
    
    'context': context,
    'modifyContext': modifyContext,
    'setContext': setContext,
    'extract': extract,
    
    'getNow': getNow,
    'setNow': setNow,
    'modifyNow': modifyNow,
    
// Sequence Computations
    'cons': cons,
    
    'sequencea': sequencea,
    'sequence': sequence,
    
    'enumerationa': enumerationa,
    'enumeration': enumeration,
//
    'yes': yes,
    'no': no,
    'bool': bool,
    'branch': branch,

//
    'lift': lift
};

});