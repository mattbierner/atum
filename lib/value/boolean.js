/**
 * @fileOverview Boolean primitive value and operations.
 */
define(['bes/record',
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
    'value']);

Boolean.prototype.type = type.BOOLEAN;

/* Constants
 ******************************************************************************/
var FALSE = Boolean.create(false);

var TRUE = Boolean.create(true);

/* Operations
 ******************************************************************************/
var create = function(x) {
    return (x ? TRUE : FALSE);
};

var isTrue = function(x) {
    return (value.isBoolean(x) && x.value);
};

/* Logical Operations
 ******************************************************************************/
var logicalNot = function(a) {
    return create(!a.value);
};

/* Export
 ******************************************************************************/
return {
    'create': create,

// Constants
    'FALSE': FALSE,
    'TRUE': TRUE,
    
// Operations
    'isTrue': isTrue,
    
// Logical Operations
    'logicalNot': logicalNot
};

});