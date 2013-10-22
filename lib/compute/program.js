/**
 * @fileOverview Base statement computations.
 */
define(['atum/completion',
        'atum/compute',
        'atum/compute/cont',
        'atum/compute/tail'],
function(completion,
        compute,
        cont,
        tail) {
"use strict";


/* Base Computations
 ******************************************************************************/
/**
 * Computation that always succeeds with value 'x' and existing context.
 */
var just = function(x) {
    if (x === undefined || (x && typeof x === 'function'))
        debugger;
    
    return function(ctx, ok, err) {
        return cont.appk(ok, x, ctx);
    };
};

var fail = function(x) {
    return function(ctx, ok, err) {
        return err(x, ctx);
    };
};

/**
 * Compute 'p' and if it succeeds, call 'f' with results. 'f' returns the next
 * computation to perform. Return results from computation given by 'f'.
 */
var bind = function(p, f) {
    if (!p || !p.call || !f || !f.call)
        debugger;
    
    return function(ctx, ok, err) {
        return p(ctx,
            function(x, ctx) {
                return tail.cont(f(x), [ctx, ok, err]);
            },
            err);
    };
};

var next = function(p, q) {
    return bind(p, function() { return q });
};

/* Base Computations
 ******************************************************************************/
var bindStatement = function(statement, f) {
    return function(ctx, ok, err) {
        return statement(ctx,
            function(x, ctx) {
                return f(x)(ctx, ok, err);
            });
    };
};

var liftStatement = function(statement) {
    return bindStatement(statement,
        function(x, ctx) {
            switch (x.type) {
            case completion.ThrowCompletion.type:
                return fail(x.value);
                
            case completion.NormalCompletion.type:
                return just(x.value);
            }
            return just(x);
        });
};





/* Export
 ******************************************************************************/
return {
// Basic Computations
    'just': just,
    'fail': fail,
    'bind': bind,
    'next': next,
    
    
    'liftStatement': liftStatement,
    'bindStatement': bindStatement
};

});