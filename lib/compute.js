/**
 * @fileOverview Base combinatorial computations.
 * 
 * Computations are expressed using deliminated continuations with state.
 * The deliminated continuation logic is based on:
 * http://www.cs.indiana.edu/~sabry/papers/monadicDC.pdf
 */
define(['bes/object',
        'atum/fun',
        'atum/compute/cont',
        'atum/compute/context',
        'atum/compute/tail'],
function(amulet_object,
        fun,
        cont,
        computationContext,
        tail) {
"use strict";

/* Base Computations
 ******************************************************************************/
/**
 * Computation that always succeeds with value 'x' and existing computationContext.
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

/* Lifting
 ******************************************************************************/
/**
 * Create a Kleisli function from standard function.
 */
var from = fun.curry(fun.composen, just);

/**
 * 
 */
var lift = function(f) {
    return function(m) {
        return bind(m, fun.compose(just, f));
    };
};

/**
 * 
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
 * Compoese where `f` takes any arbitrary number of arguments.
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
 * Create a new unique prompt.
 */
var newPrompt = function(ctx, k) {
    return cont.appk(
        k,
        ctx.prompt,
        computationContext.ComputeContext.setPrompt(ctx, ctx.prompt + 1));
};

/**
 * Pushes prompt onto the stack and evaluated `c`.
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
 * @param f Function mapping deliminated continuation to computation.
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
var pushSubCont = function(subk, c) {
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
 * Capture the continuation deliminated by `p`
 * 
 * @param p Prompt.
 * @param f Function taking current deliminated continuation.
 */
var shift = function(p, f) {
    return withSubCont(p, function(k) {
        return pushPrompt(p, f(function(c) {
            return pushPrompt(p, pushSubCont(k, c));
        }));
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
var abort = function(p, c) {
    return withSubCont(p, fun.constant(c));
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
 * Computation that always fails with value 'x' and existing computationContext.
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

/* Helper Computations
 ******************************************************************************/
/**
 * Noop computation.
 */
var empty = just(null);

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
 * Compute 'p' and if it succeeds, call 'f' with the results of 'p' as arguments.
 */
var binds = function(p, f) {
    return bind(p, function(x) {
        return f.apply(undefined, x);
    });
};

/**
 * Compute 'p', discard results and return result from 'q'.
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
 * Compute `open`, `p`, then `close`, returning results from `p`.
 */
var between = function(open, close, p) {
    return next(open, then(p, close));
};

/**
 * Compute `open`, `p, then `close. If `p` fails, still evaluate close then fail. 
 */
var betweenForce = function(open, close, p) {
     return next(open, thenForce(p, close));
};

/* Context Computations
 ******************************************************************************/
/**
 * Computation that alters the computation context with function 'f'.
 * 
 * @param f Function that takes the existing computation context and returns 
 *     a new computationContext.
 */
var modifyComputeContext = function(f) {
    return function(ctx, k) {
        var newCtx = f(ctx);
        return cont.appk(k, newCtx, newCtx);
    }
};

/**
 * Computation taht sets the computation contex to 'ctx'.
 */
var setComputeContext = fun.compose(
    modifyComputeContext,
    fun.constant);

/**
 * Computation that succeeds with the compute computationContext.
 */
var computeContext = modifyComputeContext(fun.identity);

/**
 * Computation that examines the compute context with function 'f' and
 * succeeds with result.
 */
var extractComputeContext = function(f) {
    return bind(computeContext, from(f));
};

/**
 * 
 */
var unique = bind(computeContext, function(ctx) {
    return next(
        setComputeContext(ctx.setUnique(ctx.unique + 1)),
        just(ctx.unique));
});

/**
 * 
 */
var setFail = function(fail) {
    return modifyComputeContext(function(ctx) {
        return computationContext.ComputeContext.setFail(ctx, fail);
    });
}

/**
 * 
 */
var getFail = extractComputeContext(function(ctx) {
    return ctx.fail;
});


/**
 * Computation that modifies the compute context values with 'f'.
 * 
 * @param f Function that takes the current values and returns the new values.
 */
var modifyValues = function(f) {
    return modifyComputeContext(function(ctx) {
        return computationContext.ComputeContext.setValues(ctx, f(ctx.values));
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
        return just(v[key]);
    });
};

/**
 * Computation that sets the stored value for 'key' to 'x'.
 */
var setValue = function(key, x) {
    return modifyValues(function(v){
        return amulet_object.setProperty(v, key, x, true);
    });
};

/**
 * Computation that modifies the user context with 'f'.
 * 
 * @param f Function that takes the current user context and returns a 
 *    new user computationContext.
 */
var modifyContext = function(f) {
    return modifyComputeContext(function(ctx) {
        return computationContext.ComputeContext.setUserData(ctx, f(ctx.userData));
    });
};

/**
 * Computation that sets the user context to 'ud'.
 */
var setContext = fun.compose(modifyContext, fun.constant);
/**
 * Computation that succeeds with the user computationContext.
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
        return computationContext.ComputeContext.setNow(ctx, f(ctx.now));
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
var sequence = fun.composen(sequencea, fun.args);

/**
 * Computation that performs an ordered sequence of computations and succeeds
 * with a list of results.
 */
var enumerationa = fun.curry(fun.reduceRight, fun.flip(cons), _end);

/**
 * Same as 'enumerationa' but takes an argument list of computations.
 */
var enumeration = fun.composen(enumerationa, fun.args);

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



/* Export
 ******************************************************************************/
return {
// Basic Computations
    'just': just,
    'bind': bind,

    'error': error,
    'bindError': bindError,
    
// Primitve Continuation Computations
    'newPrompt': newPrompt,
    'pushPrompt': pushPrompt,
    'withSubCont': withSubCont,
    'pushSubCont': pushSubCont,

// Continuation Computations
    'reset': reset,
    'shift': shift,
    
    'callcc': callcc,
    'abrupt': abrupt,
    
// Helper Computations
    'empty': empty,
    'binds': binds,
    'next': next,
    'then': then,
    'thenForce': thenForce,
    'between': between,
    'betweenForce': betweenForce,
    
    'binary': binary,

// Context Computations
    'modifyComputeContext': modifyComputeContext,
    'setComputeContext': setComputeContext,
    'computeContext': computeContext,
    'extractComputeContext': extractComputeContext,
    
    'unique': unique,
    
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
    'from': from,
    'lift': lift,
    'lift2': lift2,
    
    'compose': compose,
    'composen': composen,
    'composeWith': composeWith,
};

});