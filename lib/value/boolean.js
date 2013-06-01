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

/* Logical Operations
 ******************************************************************************/
var logicalNot = function(a) { return new Boolean(!a.value); };

/* Relational Operations
 ******************************************************************************/
/**
 * Create a new Boolean from the result of an equality comparison between
 * Booleans 'l ' and 'r'.
 */
var eq = function(l, r) { return new Boolean(l.value === r.value); };

/* Export
 ******************************************************************************/
return {
    'Boolean': Boolean,
    
    'logicalNot': logicalNot,
    
    'eq': eq
};

});