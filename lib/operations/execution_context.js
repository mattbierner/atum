/**
 * @fileOverview Computations for querying and mutating the environment.
 */
define(['atum/compute',
        'atum/context/execution_context'],
function(compute,
        execution_context) {
//"use strict";

/* Computations
 ******************************************************************************/
/**
 */
var getSettings = function() {
    return compute.extract(function(ctx) {
        return ctx.settings;
    });
};

/**
 * Computation that gets the strictness of the current execution context.
 */
var getStrict = function() {
    return compute.extract(function(ctx) {
        return ctx.strict;
    });
};

/**
 * Computation that gets the global object.
 */
var getGlobal = function() {
    return compute.extract(function(ctx) {
        return ctx.global;
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

/**
 * Computation that gets the stack of the current execution context.
 */
var getStack  = function() {
    return compute.extract(function(ctx) {
        return ctx.stack;
    });
};

/**
 * Computation that modifies the stack of the current execution context
 * with function f.
 * 
 * @param f Function that maps current stack to the new stack.
 */
var modifyStack = function(f) {
    return compute.bind(getStack(), function(s){
        return compute.modifyContext(function(ctx) {
            return execution_context.setStack(ctx, f(s));
        });
    });
};

var setStack = function(s) {
    return modifyStack(function() { return s; });
};

/* Export
 ******************************************************************************/
return {
    'getSettings': getSettings,
    'getGlobal': getGlobal,
    'getStrict': getStrict,
    
    'getThisBinding': getThisBinding,
    'modifyThisBinding': modifyThisBinding,
    'setThisBinding': setThisBinding,
    'withThisBinding': withThisBinding,
    
    'getStack': getStack,
    'modifyStack': modifyStack,
    'setStack': setStack
};

});