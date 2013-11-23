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

var stmt = function(f) {
    f.stmt = true;
    return f;
}

/* Base Computations
 ******************************************************************************/
/**
 * Computation that always succeeds with value 'x' and existing context.
 */
var just = function(x) {
    return stmt(function(ctx, k) {
       // return [x, ctx];
        return cont.appk(k, x, ctx);
    });
};

/**
 * Compute 'p' and if it succeeds, call 'f' with results. 'f' returns the next
 * computation to perform. Return results from computation given by 'f'.
 */
var bind = function(p, f) {
    if (!p || !p.call || !p.stmt || !f || !f.call)
        debugger;
    
    //return stmt(function(ctx) {
   //     var r = p(ctx);
     //   return f(r[0])(r[1]);
    //});
    
    return stmt(function(ctx, k) {
        return p(ctx,
            function(x, ctx) {
                return tail.cont(f(x), [ctx.setNow(new Date), k]);
            });
    });
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


/*
 ******************************************************************************/
var empty = completeNormal();

/**
 * Computation that performs a sequence of computations in order and returns
 * the last result.
 */
var sequencea = fun.curry(fun.reduce, next, empty);

/**
 * Same as 'sequencea' but takes an argument list of computation.
 */
var sequence = fun.compose(sequencea, fun.args);

/* Lifting Computations
 ******************************************************************************/
var bindExpression = function(expr, f) {
    var p = compute.bindError(
        compute.bind(expr, f),
        completeThrow);
    
    return stmt(function(ctx, k) {
        return p(ctx, function(x, ctx) {
            return cont.appk(k, x, ctx);
        });
    });
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
    'sequencea': sequencea,
    'sequence': sequence,
    
    'completeNormal': completeNormal,
    'completeReturn': completeReturn,
    'completeThrow': completeThrow,
    'completeBreak': completeBreak,
    'completeContinue': completeContinue,
    
    'liftExpression': liftExpression,
    'bindExpression': bindExpression
};

});