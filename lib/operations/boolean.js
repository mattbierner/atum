/**
 * @fileOverview Computations for boolean value.
 */
define(['atum/compute',
        'atum/value/boolean'],
function(compute,
        boolean) {
"use strict";

/* Creation
 ******************************************************************************/
/**
 * Computation that creates a new boolean language value from host 'value'
 */
var create = function(value) {
    return compute.always(new boolean.Boolean(value));
};

/* Operators
 ******************************************************************************/
/**
 * Computation that performs a logical not operation on computation 'argument'
 */
var logicalNot = function(argument) {
    return compute.bind(argument, function(x) {
        return compute.always(boolean.logicalNot(x));
    });
};

/* Export
 ******************************************************************************/
return {
    'create': create,
    
    'logicalNot': logicalNot
};

});