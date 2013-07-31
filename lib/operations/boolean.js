/**
 * @fileOverview Boolean value computations.
 */
define(['atum/compute',
        'atum/value/boolean',
        'atum/value/type'],
function(compute,
        boolean,
        type) {
"use strict";

/* Host Operations
 ******************************************************************************/
/**
 * Computation resulting in host boolean value of if the result of computation
 * `c` a true boolean hosted value. 
 */
var isTrue = function(c) {
    return compute.bind(c, function(x) {
        return compute.just(x.type === type.BOOLEAN_TYPE && x.value === true);
    });
};

/* Creation
 ******************************************************************************/
/**
 * Create a new hosted boolean value.
 * 
 * @param x Host value to create hosted boolean from.
 */
var create = function(x) {
    return compute.just(new boolean.Boolean(x));
};

/* Operators
 ******************************************************************************/
/**
 * Perform a logical not on `argument`.
 * 
 * @param argument Computation resulting in hosted boolean value.
 */
var logicalNot = function(argument) {
    return compute.bind(argument, function(x) {
        return compute.just(boolean.logicalNot(x));
    });
};

/* Export
 ******************************************************************************/
return {
// Host Operations
    'isTrue': isTrue,
    
// Creation
    'create': create,
    
// Operators
    'logicalNot': logicalNot
};

});