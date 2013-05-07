/**
 * @fileOverview Boolean primitive value and boolean operations.
 */
define(['atum/value/value',
        'atum/value/type'],
function(value,
        type) {
"use strict";

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

Boolean.prototype.type = type.BOOLEAN_TYPE;

/* Operations
 ******************************************************************************/
var logicalNot = function(argument) { return new Boolean(!argument.value); };

/* Relational
 ******************************************************************************/
var eq = function(l, r) { return new Boolean(l.value === r.value); };

/* Export
 ******************************************************************************/
return {
    'Boolean': Boolean,
    
    'logicalNot': logicalNot,
    
    'eq': eq
};

});