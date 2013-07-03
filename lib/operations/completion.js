/**
 * @fileOverview Computations for creating and interacting with completions.
 */
define(['atum/compute',
        'atum/completion'],
function(compute,
        completion){
"use strict";

/* Creation Semantics
 ******************************************************************************/
var createNormalCompletion = function(argument) {
    return compute.bind(argument, function(x) {
        return compute.just(new completion.NormalCompletion(x));
    })
};

var createThrowCompletion = function(argument) {
    return compute.bind(argument, function(x) {
        return compute.just(new completion.ThrowCompletion(x));
    })
};

/**
 * Computation that creates a return completion with result of 'argument'
 */
var createReturnCompletion = function(argument) {
    return compute.bind(argument, function(x) {
        return compute.just(new completion.ReturnCompletion(x));
    });
};

/**
 * Computation that creates a return completion with result of 'argument'
 */
var createBreakCompletion = function(target, argument) {
    return (!argument ?
        createBreakCompletion(target, compute.just(null)) :
        compute.bind(argument, function(x) {
            return compute.just(new completion.BreakCompletion(target, x));
        }));
};

/**
 * Computation that creates a return completion with result of 'argument'
 */
var createContinueCompletion = function(target, argument) {
    return (!argument ?
        createContinueCompletion(target, compute.just(null)) :
        compute.bind(argument, function(x) {
            return compute.just(new completion.ContinueCompletion(target, x));
        }));
};


/* Export
 ******************************************************************************/
return {
    'createNormalCompletion': createNormalCompletion,
    'createThrowCompletion': createThrowCompletion,
    'createReturnCompletion': createReturnCompletion,
    'createBreakCompletion': createBreakCompletion,
    'createContinueCompletion': createContinueCompletion
};

});