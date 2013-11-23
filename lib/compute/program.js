/**
 * @fileOverview Program computation operations.
 * 
 * Interfaces for wrapping statement computations and running program computations
 * with a error callback
 */
define(['atum/completion',
        'atum/compute',
        'atum/compute/tail'],
function(completion,
        compute,
        tail) {
"use strict";

/* Running
 ******************************************************************************/
/**
 * Run a computation with an explicit error callback.
 * 
 * Error callback has the same interface as the success callback.
 * 
 * @param c Computation.
 * @param ctx Computation context.
 * @param ok Success callback.
 * @param err Failure callback.
 */
var run = function(c, ctx, ok, err) {
    var prog = compute.bindError(c, function(x) {
        return compute.bind(compute.computeContext, function(ctx) {
            return compute.abrupt(err(x, ctx));
        });
    });
    return tail.trampoline(prog(ctx, ok));
};

/* Base Computations
 ******************************************************************************/
/**
 * Evaluate a statement computation and pass results to a function which
 * returns a program computation.
 */
var bindStatement = function(statement, f) {
    return function(ctx, k) {
         //var r = statement(ctx);
         //return f(r[0])(r[1], k);
        
        return statement(ctx,
            function(x, ctx) {
                return f(x)(ctx, k);
            });
    };
};

/**
 * Transform a statement computation into a program computation.
 */
var liftStatement = function(statement) {
    return bindStatement(statement, function(x) {
        switch (x.type) {
        case completion.ThrowCompletion.type:
            return compute.error(x.value);
        
        case completion.NormalCompletion.type:
            return compute.just(x.value);
        }
        debugger;
        return compute.abrupt(x);
    });
};


/* Export
 ******************************************************************************/
return {
// Running
    'run': run,
    
// Statement Interface
    'liftStatement': liftStatement,
    'bindStatement': bindStatement
};

});