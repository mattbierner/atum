/**
 * @fileOverview Base statement computations.
 */
define(['atum/completion'],
function(completion) {
"use strict";

/* Continuation
 ******************************************************************************/
var cont = function(f, args) {
    var c = [f, args];
    c._next = true;
    return c;
};

var trampoline = function(f) {
    var value = f;
    while (value && value._next)
        value = value[0].apply(undefined, value[1]);
    return value;
};

/* Base Computations
 ******************************************************************************/
/**
 * Computation that always succeeds with value 'x' and existing context.
 */
var just = function(x) {
    if (x === undefined || (x && typeof x === 'function'))
        debugger;
    
    return function(ctx, k) {
        return k(x, ctx);
    };
};

/**
 * Complete normally.
 * 
 * @param x Value stored in completion.
 */
var completeNormal = function(x) {
    return just(new completion.NormalCompletion(x));
};

/**
 * Complete with an error.
 * 
 * @param x Value stored in completion.
 * @param [previous] Previous completion.
 */
var completeThrow = function(x, previous) {
    return just(new completion.ThrowCompletion(x, previous));
};

/**
 * Complete with a return.
 * 
 * @param x Value to stored in completion.
 */
var completeReturn = function(x) {
    return just(new completion.ReturnCompletion(x));
};


/**
 * Complete with a break.
 * 
 * @param {string} target Target of break. May be null if none.
 * @param x Value to store in completion.
 */
var completeBreak = function(target, x) {
    return just(new completion.BreakCompletion(target, x));
};

/**
 * Complete with a continue.
 * 
 * @param {string} target Target of continue. May be null.
 * @param x Value to store in completion.
 */
var completeContinue = function(target, x) {
    return just(new completion.ContinueCompletion(target, x));
};

/**
 * Compute 'p' and if it succeeds, call 'f' with results. 'f' returns the next
 * computation to perform. Return results from computation given by 'f'.
 */
var bind = function(p, f) {
    if (!p || !p.call || !f || !f.call)
        debugger;
    
    return function(ctx, k) {
        return p(ctx,
            function(x, ctx) {
                return cont(f(x), [ctx, k]);
            });
    };
};

var next = function(p, q) {
    return bind(p, function(x) {
        if (x instanceof completion.AbruptCompletion)
            return just(x);
        return q;
    });
};

/* Base Computations
 ******************************************************************************/
var empty = completeNormal();

/* Base Computations
 ******************************************************************************/
var liftExpression = function(expr) {
    return function(ctx, k) {
        return expr(ctx,
            function(x, ctx) {
                return cont(completeNormal(x), [ctx, k]);
            },
            function(x, ctx) {
                return cont(completeThrow(x), [ctx, k]);
            });
    };
};

var bindExpression = function(expr, f) {
    return bind(liftExpression(expr), function(x) {
        if (x instanceof completion.NormalCompletion)
            return f(x.value);
        return just(x);
    })
};

/* Export
 ******************************************************************************/
return {
// Basic Computations
    'just': just,
    'bind': bind,
    'next': next,
    
    'empty': empty,
    
    'completeNormal': completeNormal,
    'completeReturn': completeReturn,
    'completeThrow': completeThrow,
    'completeBreak': completeBreak,
    'completeContinue': completeContinue,
    
    'liftExpression': liftExpression,
    'bindExpression': bindExpression
};

});