/**
 * @fileOverview Boolean primitive.
 */
define(['atum/compute',
        'atum/value/value'],
function(compute,
        value) {
//"use strict";
    
/* Boolean
 ******************************************************************************/
/**
 * 
 */
var Boolean = function(v) {
    value.Value.call(this, 'boolean', v);
};
Boolean.prototype = new value.Value;


/* Operators
 ******************************************************************************/
/**
 * 
 */
var logicalNot = function(argument) {
    new Boolean(!argument.value);
};


/* Export
 ******************************************************************************/
return {
    'Boolean': Boolean,
    
    'logicalNot': logicalNot
};

});