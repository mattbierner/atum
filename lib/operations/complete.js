/**
 * @fileOverview Completion computations.
 */
define(['atum/compute',
        'atum/completion'],
function(compute,
        completion){
"use strict";

/* Creation
 ******************************************************************************/
/**
 * Complete normally.
 * 
 * @param x Value stored in completion.
 */
var completeNormal = function(x) {
    return compute.just(new completion.NormalCompletion(x));
};

/**
 * Complete normally.
 * 
 * @param value Computation of value to store in completion.
 */
var completeNormalFrom = function(value) {
    return compute.bind(value, completeNormal);
};

/**
 * Complete with an error.
 * 
 * @param x Value stored in completion.
 * @param [previous] Previous completion.
 */
var completeThrow = function(x, previous) {
    return compute.just(new completion.ThrowCompletion(x, previous));
};

/**
 * Complete with an error.
 * 
 * @param value Computation of value to store in completion.
 * @param [previous] Previous completion.
 */
var completeThrowFrom = function(value, previous) {
    return compute.bind(value, function(x){
        return completeThrow(x, previous);
    });
};

/**
 * Complete with a return.
 * 
 * @param x Value to stored in completion.
 */
var completeReturn = function(x) {
    return compute.just(new completion.ReturnCompletion(x));
};

/**
 * Complete with a return.
 * 
 * @param value Computation of value to store in completion.
 */
var completeReturnFrom = function(value) {
    return compute.bind(value, completeReturn);
};

/**
 * Complete with a break.
 * 
 * @param {string} target Target of break. May be null if none.
 * @param x Value to store in completion.
 */
var completeBreak = function(target, x) {
    return compute.just(new completion.BreakCompletion(target, x));
};

/**
 * Complete with a break.
 * 
 * @param {string} target Target of break. May be null if none.
 * @param value Computation of value to store in completion..
 */
var completeBreakFrom = function(target, value) {
    return compute.bind(value, function(x) {
        return completeBreak(target, x);
    });
};

/**
 * Complete with a continue.
 * 
 * @param {string} target Target of continue. May be null.
 * @param x Value to store in completion.
 */
var completeContinue = function(target, x) {
    return compute.just(new completion.ContinueCompletion(target, x));
};

/**
 * Complete with a continue.
 * 
 * @param {string} target Target of continue. May be null if none.
 * @param value Computation of value to store in completion..
 */
var completeContinueFrom = function(target, value) {
    return compute.bind(value, function(x) {
        return completeContinue(target, x);
    });
};

/* Export
 ******************************************************************************/
return {
// Creation
    'completeNormal': completeNormal,
    'completeNormalFrom': completeNormalFrom,
    
    'completeThrow': completeThrow,
    'completeThrowFrom': completeThrowFrom,
    
    'completeReturn': completeReturn,
    'completeReturnFrom': completeReturnFrom,
    
    'completeBreak': completeBreak,
    'completeBreakFrom': completeBreakFrom,
    
    'completeContinue': completeContinue,
    'completeContinueFrom': completeContinueFrom
};

});