/**
 * @fileOverview Computations for boolean value.
 */
define(['atum/compute',
        'atum/value/boolean'],
function(compute,
        boolean) {
//"use strict";

var create = function(value) {
    return compute.always(new boolean.Boolean(value));
};

/* Operators
 ******************************************************************************/
/**
 * 
 */
var logicalNot = function(argument) {
    return compute.bind(argument, function(oldValue) {
        return compute.always(boolean.logicalNot(oldValue));
    });
};


/* Export
 ******************************************************************************/
return {
    'create': create,
    
    'logicalNot': logicalNot
};

});