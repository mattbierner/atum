/**
 * @fileOverview Computations for querying and mutating the environment.
 */
define(['atum/compute',
        'atum/context/execution_context'],
function(compute,
        execution_context) {
//"use strict";

var getContext = function() {
    return compute.getContext();
};


var modifyContext = function(f) {
    return compute.modifyContext(f);
};

var setContext = function(ctx) {
    return modifyContext(function(){ return ctx; });
}

/**
 * Extract a value from the current execution context.
 */
var extract = function(f) {
    return compute.extract(f);
};


    
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

/* Export
 ******************************************************************************/
return {
    'extract': extract,
    'getContext': getContext,
    'modifyContext': modifyContext,
    'setContext': setContext,

    'getSettings': getSettings,
    'getGlobal': getGlobal,
    'getStrict': getStrict,
    
    'getThisBinding': getThisBinding,
    'modifyThisBinding': modifyThisBinding,
    'setThisBinding': setThisBinding,
    'withThisBinding': withThisBinding
};

});