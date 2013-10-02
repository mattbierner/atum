/**
 * @fileOverview Computations for interacting with the execution context.
 */
define(['atum/compute',
        'atum/fun',
        'atum/context/execution_context',
        'atum/context/execution_metadata'],
function(compute,
        fun,
        execution_context,
        execution_metadata) {
"use strict";

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
var setContext = compute.setContext;

/**
 * Computation to extract a value from the current execution context with `f`.
 */
var extract = compute.extract;

/* Query Computations
 ******************************************************************************/
/**
 * Get the strictness of the current execution context.
 */
var strict = extract(function(ctx) {
    return ctx.strict;
});

/**
 * Set the strictness of the current execution context.
 */
var setStrict = function(isStrict) {
    return modifyContext(function(ctx) {
        return execution_context.setStrictness(ctx, isStrict);
    });
};

/**
 * Performs computation 'p' with this binding 't'.
 * Restore old this binding on completion.
 */
var withStrict = function(isStrict, p) {
    return compute.bind(strict, function(oldStrictness) {
        return compute.between(setStrict(isStrict), setStrict(oldStrictness),
            p);
    });
};

/**
 * Get the this binding of the current execution context.
 */
var thisBinding = extract(function(ctx) {
    return ctx.thisBinding;
});

/**
 * Modifies the this binding of the current execution context.
 * 
 * @param f Function that maps current this binding to the new this binding.
 */
var modifyThisBinding = function(f) {
    return compute.bind(thisBinding, function(t) {
        return modifyContext(function(ctx) {
            return execution_context.setThisBinding(ctx, f(t));
        });
    });
};

/**
 * Sets this binding of the current execution context
 */
var setThisBinding = fun.compose(
    modifyThisBinding,
    fun.constant);

/**
 * Performs computation 'p' with this binding 't'.
 * Restore old this binding on completion.
 */
var withThisBinding = function(t, p) {
    return compute.bind(thisBinding, function(oldT) {
        return compute.between(setThisBinding(t), setThisBinding(oldT),
            p);
    });
};

/**
 * Get the current execution context's location value.
 */
var loc = extract(function(ctx) {
    return ctx.metadata.loc;
});

/**
 * Set the location of the current execution contex.
 */
var setLoc = function(loc) {
    return modifyContext(function(ctx) {
        return execution_context.setMetadata(ctx, execution_metadata.setLocation(ctx.metadata, loc));
    });
};

/* Creation
 ******************************************************************************/
var createEvalContext = function() {
    return extract(function(ctx) {
        return execution_context.setType(ctx,
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
    'setStrict': setStrict,
    'withStrict': withStrict,
    
    'thisBinding': thisBinding,
    'modifyThisBinding': modifyThisBinding,
    'setThisBinding': setThisBinding,
    'withThisBinding': withThisBinding,
    
    
    'loc': loc,
    'setLoc': setLoc,

    'createEvalContext': createEvalContext,
};

});