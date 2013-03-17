/**
 * @fileOverview Boolean primitive value and boolean operations.
 */
define(['atum/value/value'],
function(value) {
"use strict";

/* Boolean Type
 ******************************************************************************/
/**
 * Type of primitive number values.
 */
var BOOLEAN_TYPE = 'boolean';

/* Boolean
 ******************************************************************************/
/**
 * Boolean primitive value.
 */
var Boolean = function(v) {
    value.Value.call(this);
    this.value = v;
};
Boolean.prototype = new value.Value;

Boolean.prototype.type = BOOLEAN_TYPE;

/* Operations
 ******************************************************************************/
var logicalNot = function(argument) { return new Boolean(!argument.value); };

/* Export
 ******************************************************************************/
return {
    'BOOLEAN_TYPE': BOOLEAN_TYPE,
    
    'Boolean': Boolean,
    
    'logicalNot': logicalNot
};

});