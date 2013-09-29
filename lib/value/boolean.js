/**
 * @fileOverview Boolean primitive value and operations.
 */
define(['atum/value/type',
        'atum/value/value'],
function(type,
        value) {
"use strict";

/* Boolean
 ******************************************************************************/
/**
 * Boolean primitive value.
 */
var Boolean = function(v) {
    value.Value.call(this);
    this.value = !!v;
};
Boolean.prototype = new value.Value;
Boolean.prototype.constructor = Boolean;

Boolean.prototype.type = type.BOOLEAN_TYPE;

/* Constants
 ******************************************************************************/
var FALSE = new Boolean(false);

var TRUE = new Boolean(true);

/* Logical Operations
 ******************************************************************************/
var logicalNot = function(a) {
    return new Boolean(!a.value);
};

/* Export
 ******************************************************************************/
return {
    'Boolean': Boolean,

// Constants
    'FALSE': FALSE,
    'TRUE': TRUE,

// Logical Operations
    'logicalNot': logicalNot
};

});