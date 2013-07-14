/**
 * @fileOverview Boolean value computations.
 */
define(['atum/compute',
        'atum/value/boolean'],
function(compute,
        boolean) {
"use strict";

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
// Creation
    'create': create,
    
// Operators
    'logicalNot': logicalNot
};

});