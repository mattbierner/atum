/**
 * @fileOverview Computations for creating and interacting with completions.
 */
define(['atum/compute',
        'atum/completion'],
function(compute,
        completion){
"use strict";

/* Completion Semantics
 ******************************************************************************/
/**
 * Computation that creates a return completion with result of 'argument'
 */
var createReturnCompletion = function(argument) {
    return compute.bind(argument, function(x) {
        return compute.always(new completion.ReturnCompletion(x));
    });
};

/**
 * Computation that creates a return completion with result of 'argument'
 */
var createBreakCompletion = function(target, argument) {
    return (!argument ?
        createBreakCompletion(target, compute.always(null)) :
        compute.bind(argument, function(x) {
            return compute.always(new completion.BreakCompletion(target, x));
        }));
};

/**
 * Computation that creates a return completion with result of 'argument'
 */
var createContinueCompletion = function(target, argument) {
    return compute.bind(argument, function(x) {
        return compute.always(new completion.ContinueCompleition(target, x));
    });
};


/* Export
 ******************************************************************************/
return {
    'createReturnCompletion': createReturnCompletion,
    'createBreakCompletion': createBreakCompletion,
    'createContinueCompletion': createContinueCompletion
};

});