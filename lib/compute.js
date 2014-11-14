/**
 * @fileOverview Base combinatorial computations.
 * 
 * Computations are expressed using delimited continuations with state.
 * The delimited continuation logic is based on:
 * http://www.cs.indiana.edu/~sabry/papers/monadicDC.pdf
 */
define(['bes/object',
        'hamt',
        'nu-stream/stream',
        'atum/fun',
        'atum/compute/cont',
        'atum/compute/context',
        'atum/compute/io',
        'atum/compute/tail'],
function(amulet_object,
        hamt,
        stream,
        fun,
        cont,
        computation_context,
        io,
        tail) {
"use strict";

/* Base Computations
 ******************************************************************************/
/**
 * Computation that always succeeds with value 'x' and existing computation_context.
 */
var just = function(x) {
    return function(ctx, k) {
        return cont.appk(k, x, ctx);
    };
};

/**
 * Compute 'c' and if it succeeds, call 'f' with results. 'f' returns the next
 * computation to perform. Return results from computation given by 'f'.
 */
var bind = function(c, f) {
    if (!c || !c.call || !f || !f.call)  debugger;
    
    return function(ctx, k) {
        return new tail.Tail(c,
             ctx,
             cont.pushSeg(f, k));
    };
};

/**
 * Compute 'c' and if it succeeds, call 'f' with results and return results.
 */
var map = function(c, f) {
    return bind(c, function(x) { return just(f(x)); });
};

/* Lifting
 ******************************************************************************/
/**
 * Create a Kleisli function from standard function.
 */
var from = fun.curry(fun.composen, just);

/**
 * Lift unary function `f` into the monad.
 */
var lift = function(f) {
    return function(m) {
        return bind(m, fun.compose(just, f));
    };
};

/**
 * Lift binary function `f` into the monad.
 */
var lift2 = function(f) {
    return function(m1, m2) {
        return binary(m1, m2, function(x, y) {
            return just(f(x, y));
        });
    };
};

/* Composition
 ******************************************************************************/
/**
 * Left-to-right compose of two Kleisli functions.
 */
var compose = function(f, g) {
    return function(x) {
        return bind(f(x), g);
    }
};

/**
 * Compoese where `f` takes n arguments.
 */
var composen = function(f, g) {
    return function(/*...*/) {
        return bind(f.apply(this, arguments), g);
    }
};

var composeWith = function(g) {
    return function(f) {
        return bind(f, g);
    };
};


/* Primitive Continuation Operations
 ******************************************************************************/
/**
 * Get a unique identifier in the context.
 */
var unique = function(ctx, k) {
    return cont.appk(
        k,
        ctx.unique,
        ctx.setUnique(ctx.unique + 1));
};

/**
 * Create a new unique prompt.
 */
var newPrompt = unique;

/**
 * Pushes prompt onto the stack and evaluate `c`.
 * 
 * @param prompt Prompt.
 * @param c Computation.
 */
var pushPrompt = function(prompt, c) {
    return function(ctx, k) {
        return c(ctx, cont.pushP(prompt, k));
    };
};

/**
 * Capture the continuation delimited by `prompt` and call `f` with it.
 * 
 * @param prompt Prompt.
 * @param f Function mapping delimited continuation to computation.
 */
var withSubCont = function(prompt, f) {
    return function(ctx, k) {
        var sub = cont.splitSeq(prompt, k);
        return f(sub[0])(ctx, sub[1]);
    };
};

/**
 * Push an entire sub continuation onto the stack and evaluate `c`.
 * 
 * @param subk Sub continuation.
 * @param c Computation
 */
var pushSubCont = function(subk, c) { if (!c) debugger;
    return function(ctx, k) {
        return c(ctx, cont.pushSeq(subk, k));
    };
};

/* Continuation Operations
 ******************************************************************************/
/**
 * Delimit a continuation
 * 
 * @param f Function taking a new prompt and returning the computation to be 
 *    enclosed.
 */
var reset = function(f) {
    return bind(newPrompt, function(p) {
        return pushPrompt(p, f(p));
    });
};

/**
 * Capture the continuation delimited by `p`
 * 
 * @param p Prompt.
 * @param f Function taking current delimited continuation.
 */
var shift = function(p, f) {
    return withSubCont(p, function(k) {
        return pushPrompt(p, f(function(c) {
            return pushPrompt(p, pushSubCont(k, c));
        }));
    });
};


/**
 * Abort the computation delimited by `p` and continue with `c`.
 */
var abort = function(p, c) {
    return withSubCont(p, fun.constant(c));
};

/**
 * Return `x` immediately without calling any continuation.
 * 
 * @param x Value returned.
 */
var abrupt = function(x) {
    return function(/*ctx, k*/) {
        return x;
    };
};

/**
 * Call with current continuation. Captures the execution state of a computation.
 * 
 * @param f Function called with the reified current continuation.
 */
var callcc = (function(){
    var withCont = function(f) {
        return withSubCont(0, function(k) {
            return pushPrompt(0, f(k));
        });
    };
    
    var abort = function(e) {
        return withCont(function(k) { return e; });
    };
    
    var reify = function(k) {
        return function(x, ctx) {
            return abort(pushSubCont(k, just(x)))(ctx, k);
        };
    };
    
    return function(f) {
        return withCont(function(k) {
            return pushSubCont(k, f(reify(k)));
        });
    };
}());

/* Error Computations
 ******************************************************************************/
/**
 * Computation that always fails with value 'x' and existing computation_context.
 */
var error = function(x) {
    var handler = just(function(e) {
        return e(x);
    });
    return bind(getFail, function(p) {
        return abort(p, handler);
    });
};

/**
 * Compute 'c' and if it fails, call 'f' with results. 'f' returns the next
 * computation to perform. Return results from computation given by 'f'.
 */
var bindError = function(c, f) {
    if (!c || !c.call || !f || !f.call) debugger;
    
    var inner = bind(c, function(x) {
        return just(fun.constant(just(x)));
    });
    
    var body = reset(function(p) {
        return next(
            setFail(p),
            inner);
    });
    
    return bind(getFail, function(oldFail) {
        return bind(body, function(x) {
            return next(
                setFail(oldFail),
                x(f));
        });
    });
};


/**
 * Compute `p` then `q`, returning result from `p`.
 * 
 * Always runs `q` even if `p` fails.
 */
var thenForce = function(p, q) {
     return then(
         bindError(p, function(x) {
             return next(
                 q,
                error(x));
         }),
         q);
};

/**
 * Compute `open`, `p, then `close. If `p` fails, still evaluate close then fail. 
 */
var betweenForce = function(open, close, p) {
     return next(open, thenForce(p, close));
};

/* Helper Computations
 ******************************************************************************/
/**
 * Noop computation.
 */
var empty = just(null);

/**
 * Compute `l` then `r`, and call binary function `f' with results. `f` returns next
 * computation.
 */
var binary = function(l, r, f) {
    return bind(l, function(lVal) {
        return bind(r, function(rVal) {
            return f(lVal, rVal);
        });
    });
};

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

/* Sequencing Computations
 ******************************************************************************/
/**
 * Compute `p`, discard results and return result from `q`.
 */
var next = function(p, q) {
    if (!p || !p.call || !q || !q.call) debugger;
    
    return bind(p, fun.constant(q));
};

/**
 * Compute `p` then `q`, returning result from `p`.
 */
var then = function(p, q) {
    return bind(p,
        fun.compose(
            fun.curry(next, q),
            just))
};

/**
 * Compute `open`, `p`, then `close`, returning results from `p`.
 */
var between = function(open, close, p) {
    return next(open, then(p, close));
};

/**
 * Performs a sequence of computations left to right and return the last result.
 * 
 * @param computations Array of computations.
 */
var sequencea = fun.curry(fun.foldl, next, empty);

/**
 * Same as `sequencea` but takes an argument list of computations.
 */
var sequence = fun.composen(sequencea, fun.args);

/* Collection
 ******************************************************************************/
/**
 * Convert finite stream result to an array.
 */
var eager = lift(stream.toArray);

/**
 * Performs a sequence of computations left to right, building value results into a list.
 * 
 * Returns complete result list.
 * 
 * @param computations Array of computations.
 */
var enumerationa = fun.curry(fun.foldr,
    lift2(fun.flip(stream.cons)),
    just(stream.NIL));

/**
 * Same as `enumerationa` but takes an argument list of computations.
 */
var enumeration = fun.composen(enumerationa, fun.args);

/**
 * 
 */
var mapm = fun.composen(
    enumerationa,
    fun.map);

/**
 * 
 */
var mapm_ = fun.composen(
    sequencea,
    fun.map);

/**
 * Compute `p` and call `f` with the results of `p` as arguments.
 */
var binds = function(p, f) {
    return bind(eager(p), function(x) {
        return f.apply(undefined, x);
    });
};

/* Context Computations
 ******************************************************************************/
/**
 * Modify the compute context with function 'f'.
 * 
 * @param f Function mapping the current computation context to a new compute context.
 */
var modifyComputeContext = function(f) {
    return function(ctx, k) {
        var newCtx = f(ctx);
        return cont.appk(k, newCtx, newCtx);
    }
};

/**
 * Computation that sets the computation context to 'ctx'.
 */
var setComputeContext = fun.compose(
    modifyComputeContext,
    fun.constant);

/**
 * Get the compute compute context.
 */
var computeContext = modifyComputeContext(fun.identity);

/**
 * Examine the compute context with function 'f' and return the result.
 */
var extractComputeContext = function(f) {
    return bind(computeContext, from(f));
};

var setFail = function(fail) {
    return modifyComputeContext(function(ctx) {
        return ctx.setFail(fail);
    });
}

var getFail = extractComputeContext(function(ctx) {
    return ctx.fail;
});

/* Memory
 ******************************************************************************/
/**
 * Computation that modifies the compute context values with 'f'.
 * 
 * @param f Function that takes the current values and returns the new values.
 */
var modifyValues = function(f) {
    return modifyComputeContext(function(ctx) {
        return ctx.setValues(f(ctx.values));
    });
};

/**
 * Set the compute context's memory.
 * 
 * @param values New memory object.
 */
var setValues = fun.compose(
    modifyValues,
    fun.constant);

/**
 * Get the compute context's memory.
 */
var values = extractComputeContext(function(ctx) {
    return ctx.values;
});

/**
 * Get the stored memory value for 'key'.
 * 
 * @param key Handle
 */
var getValue = function(key) {
    return bind(values, function(v) {
        return just(hamt.get(key, v));
    });
};

/**
 * Store `x` in memory for `key`.
 * 
 * @param key Handle.
 * @param x Value to store.
 */
var setValue = function(key, x) {
    return modifyValues(function(v) {
        return hamt.set(key, x, v);
    });
};

/* User Context
 ******************************************************************************/
/**
 * Modifies the user context with 'f'.
 * 
 * @param f Function that maps the user context to a new usr context.
 */
var modifyContext = function(f) {
    return modifyComputeContext(function(ctx) {
        return ctx.setUserData(f(ctx.userData));
    });
};

/**
 * Set the user computation context.
 * 
 * @param ud New user context.
 */
var setContext = fun.compose(modifyContext, fun.constant);

/**
 * Get the user computation context.
 */
var context = extractComputeContext(function(ctx) {
    return ctx.userData;
});

/**
 * Extract a value from the user context using function `f`.
 * 
 * @param f Function that maps the user context to a value.
 */
var extract = fun.compose(
    fun.curry(bind, context),
    from);

/* Lifting
 ******************************************************************************/
var liftIO = from(io.perform);

/* Export
 ******************************************************************************/
return {
// Basic
    'just': just,
    'bind': bind,
    'map': map,
    
// Operators
    'from': from,
    'lift': lift,
    'lift2': lift2,
    
    'compose': compose,
    'composen': composen,
    'composeWith': composeWith,
    
// Primitve Continuation
    'newPrompt': newPrompt,
    'pushPrompt': pushPrompt,
    'withSubCont': withSubCont,
    'pushSubCont': pushSubCont,

// Continuation
    'reset': reset,
    'shift': shift,
    
    'callcc': callcc,
    'abrupt': abrupt,

// Error handling
    'error': error,
    'bindError': bindError,
    
// Helper Computations
    'empty': empty,
    
    'binary': binary,

    'yes': yes,
    'no': no,
    'bool': bool,
    'branch': branch,
    
// Sequencing
    'next': next,
    'then': then,
    'thenForce': thenForce,
    'between': between,
    'betweenForce': betweenForce,
    
    'sequencea': sequencea,
    'sequence': sequence,

// Collections
    'eager': eager,
    'enumerationa': enumerationa,
    'enumeration': enumeration,
    'mapm': mapm,
    'mapm_': mapm_,
    'binds': binds,
    
// Context Computations
    'modifyComputeContext': modifyComputeContext,
    'setComputeContext': setComputeContext,
    'computeContext': computeContext,
    'extractComputeContext': extractComputeContext,
    
    'unique': unique,
    
    'getValue': getValue,
    'setValue': setValue,
    
    'context': context,
    'modifyContext': modifyContext,
    'setContext': setContext,
    'extract': extract,

// Lifting
    'liftIO': liftIO,
};

});