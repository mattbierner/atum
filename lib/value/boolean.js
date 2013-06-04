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

/* Export
 ******************************************************************************/
return {
    'Boolean': Boolean,
    
    'logicalNot': logicalNot
};

});