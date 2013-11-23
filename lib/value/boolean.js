/**
 * @fileOverview Boolean primitive value and operations.
 */
define(['amulet/record',
        'atum/value/type',
        'atum/value/value'],
function(record,
        type,
        value) {
"use strict";

/* Boolean
 ******************************************************************************/
/**
 * Boolean primitive value.
 */
var Boolean = record.declare(new value.Value, [
    'value'],
    function(v) {
        this.value = !!v;
    });

Boolean.prototype.type = type.BOOLEAN;

/* Constants
 ******************************************************************************/
var FALSE = new Boolean(false);

var TRUE = new Boolean(true);

/* Operations
 ******************************************************************************/
var isTrue = function(x) {
    return (value.isBoolean(x) && x.value);
};

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
    
// Operations
    'isTrue': isTrue,
    
// Logical Operations
    'logicalNot': logicalNot
};

});