/**
 * @fileOverview Computations for interacting with the execution context.
 */
define(['atum/compute',
        'atum/context/execution_context'],
function(compute,
        execution_context) {
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
var getContext = function() {
    return compute.getContext();
};

/**
 * Computation to modify the current execution context with `f`.
 */
var modifyContext = function(f) {
    return compute.modifyContext(f);
};

/**
 * Computation to set the current execution context to `ctx`.
 */
var setContext = function(ctx) {
    return modifyContext(function(){ return ctx; });
}

/**
 * Computation to extract a value from the current execution context with `f`.
 */
var extract = function(f) {
    return compute.extract(f);
};

/* Query Computations
 ******************************************************************************/
/**
 * Computation to gets the strictness of the current execution context.
 */
var getStrict = function() {
    return extract(function(ctx) {
        return ctx.strict;
    });
};

/**
 * Computation that gets the this binding of the current execution context.
 */
var getThisBinding = function() {
    return compute.extract(function(ctx) {
        return ctx.thisBinding;
    });
};

/**
 * Computation that modifies the this binding of the current execution context
 * with function f.
 * 
 * @param f Function that maps current this binding to the new this binding.
 */
var modifyThisBinding = function(f) {
    return compute.bind(getThisBinding(), function(t){
        return compute.modifyContext(function(ctx) {
            return execution_context.setThisBinding(ctx, f(t));
        });
    });
};

/**
 * Computation that sets the this binding of the current execution context to
 * 't'.
 */
var setThisBinding = function(t) {
    return modifyThisBinding(function() { return t; });
};

/**
 * Computation that performs computation 'p' with this binding 't'. Restores
 * old thisBinding on completion.
 */
var withThisBinding = function(t, p) {
    return compute.bind(getThisBinding(), function(oldT) {
        return compute.next(
            setThisBinding(t),
            compute.then(p,
                setThisBinding(oldT)));
    });
};

/* Export
 ******************************************************************************/
return {
    'extract': extract,
    'getContext': getContext,
    'modifyContext': modifyContext,
    'setContext': setContext,

    'getStrict': getStrict,
    
    'getThisBinding': getThisBinding,
    'modifyThisBinding': modifyThisBinding,
    'setThisBinding': setThisBinding,
    'withThisBinding': withThisBinding
};

});