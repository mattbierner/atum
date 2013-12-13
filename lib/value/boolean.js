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
var Boolean = record.extend(value.Value, [
    'value'],
    function(v) {
        this.value = !!v;
    });

Boolean.prototype.type = type.BOOLEAN;

/* Constants
 ******************************************************************************/
var FALSE = Boolean.create(false);

var TRUE = Boolean.create(true);

/* Operations
 ******************************************************************************/
var isTrue = function(x) {
    return (value.isBoolean(x) && x.value);
};

/* Logical Operations
 ******************************************************************************/
var logicalNot = function(a) {
    return Boolean.create(!a.value);
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