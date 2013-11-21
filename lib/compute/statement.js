/**
 * @fileOverview Base statement computations.
 */
define(['atum/compute',
        'atum/completion',
        'atum/fun',
        'atum/compute/cont',
        'atum/compute/tail'],
function(compute,
        completion,
        fun,
        cont,
        tail) {
"use strict";

/* Base Computations
 ******************************************************************************/
/**
 * Computation that always succeeds with value 'x' and existing context.
 */
var just = function(x) {
    var z= function(ctx, k) {
       // return [x, ctx];
        return cont.appk(k, x, ctx);
    };
    z.stmt = true;
    return z;
};

/**
 * Compute 'p' and if it succeeds, call 'f' with results. 'f' returns the next
 * computation to perform. Return results from computation given by 'f'.
 */
var bind = function(p, f) {
    if (!p || !p.call || !p.stmt || !f || !f.call)
        debugger;
    
   // var z= function(ctx) {
    //    var r = p(ctx);
    //    return f(r[0])(r[1]);
    //};
     var z = function(ctx, k) {
        return p(ctx,
            function(x, ctx) {
                return tail.cont(f(x), [ctx, k]);
            });
    };
    
    z.stmt = true;
    return z;
};

var next = function(p, q) {
    return bind(p, function(x) {
        if (x instanceof completion.AbruptCompletion)
            return just(x);
        return q;
    });
};

/* Completions
 ******************************************************************************/
/**
 * Complete normally.
 * 
 * @param x Value stored in completion.
 */
var completeNormal = fun.compose(
    just,
    completion.NormalCompletion.create);

/**
 * Complete with an error.
 * 
 * @param x Value stored in completion.
 * @param [previous] Previous completion.
 */
var completeThrow = fun.compose(
    just,
    completion.ThrowCompletion.create);

/**
 * Complete with a return.
 * 
 * @param x Value to stored in completion.
 */
var completeReturn = fun.compose(
    just,
    completion.ReturnCompletion.create);

/**
 * Complete with a break.
 * 
 * @param {string} target Target of break. May be null if none.
 * @param x Value to store in completion.
 */
var completeBreak = fun.compose(
    just,
    completion.BreakCompletion.create);

/**
 * Complete with a continue.
 * 
 * @param {string} target Target of continue. May be null.
 * @param x Value to store in completion.
 */
var completeContinue = fun.compose(
    just,
    completion.ContinueCompletion.create)


/* Base Computations
 ******************************************************************************/
var empty = completeNormal();

/* Lifting Computations
 ******************************************************************************/
var bindExpression = function(expr, f) {
    return compute.bindError(
        compute.bind(expr, f),
        completeThrow);
};

var liftExpression = function(expr) {
    return bindExpression(expr, completeNormal);
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