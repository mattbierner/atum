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

/* Export
 ******************************************************************************/
return {
    'createReturnCompletion': createReturnCompletion
};

});