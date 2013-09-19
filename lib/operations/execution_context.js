/**
 * @fileOverview Computations for interacting with the execution context.
 */
define(['atum/compute',
        'atum/context/execution_context'],
function(compute,
        execution_context) {
//"use strict";

/* Base Computations
 * 
 * Currently these forward to `compute` but future changes may decouple the
 * compute execution context from the hosted language execution context.
 * These versions should always be used instead of the `compute` versions to
 * support this change.
 ******************************************************************************/
/**
 * Computation to get the current execution context.
 */
var context = compute.context;

/**
 * Computation to modify the current execution context with `f`.
 */
var modifyContext = compute.modifyContext;

/**
 * Computation to set the current execution context to `ctx`.
 */
var setContext = function(ctx) {
    return modifyContext(function(){ return ctx; });
}

/**
 * Computation to extract a value from the current execution context with `f`.
 */
var extract = compute.extract;

/* Query Computations
 ******************************************************************************/
/**
 * Computation to gets the strictness of the current execution context.
 */
var strict = extract(function(ctx) {
    return ctx.strict;
});

/**
 * Computation that gets the this binding of the current execution context.
 */
var thisBinding = extract(function(ctx) {
    return ctx.thisBinding;
});

/**
 * Computation that sets the this binding of the current execution context to
 * 't'.
 */
var setThisBinding = function(t) {
    return modifyContext(function(ctx) {
        return execution_context.setThisBinding(ctx, t);
    });
};

/**
 * Computation that modifies the this binding of the current execution context
 * with function f.
 * 
 * @param f Function that maps current this binding to the new this binding.
 */
var modifyThisBinding = function(f) {
    return compute.bind(thisBinding, function(t) {
        return setThisBinding(f(t));
    });
};


/**
 * Computation that performs computation 'p' with this binding 't'. Restores
 * old thisBinding on completion.
 */
var withThisBinding = function(t, p) {
    return compute.bind(thisBinding, function(oldT) {
        return compute.between(setThisBinding(t), setThisBinding(oldT),
            p);
    });
};

/**
 * Computation that gets the current execution context's location value.
 */
var loc = extract(function(ctx) {
    return ctx.loc;
});

/**
 * Computation that sets the location of the current execution context to
 * 'loc'.
 */
var setLoc = function(loc) {
    return modifyContext(function(ctx) {
        return execution_context.setLocation(ctx, loc);
    });
};

/* Creation
 ******************************************************************************/
var createEvalContext = function() {
    return extract(function(ctx) {
        return new execution_context.setType(ctx,
            execution_context.ExecutionContextType.EVAL);
    });
};

/* Export
 ******************************************************************************/
return {
    'extract': extract,
    'context': context,
    'modifyContext': modifyContext,
    'setContext': setContext,

    'strict': strict,
    
    'thisBinding': thisBinding,
    'modifyThisBinding': modifyThisBinding,
    'setThisBinding': setThisBinding,
    'withThisBinding': withThisBinding,
    
    
    'loc': loc,
    'setLoc': setLoc,

    'createEvalContext': createEvalContext,
};

});