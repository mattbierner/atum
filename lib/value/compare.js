/**
 * @fileOverview Comparison operations for primitive values.
 * 
 * Does not handle object values.
 */
define(['atum/value/value',
        'atum/value/type',
        'atum/value/type_conversion'],
function(value,
        type,
        type_conversion) {
"use strict";

/* Compare Operations
 ******************************************************************************/
/**
 * Perform a strict equality comparison of primitive values 'x' and 'y'.
 * 
 * Does not perform type conversion.
 * 
 * @return Host boolean.
 */
var strictEqual = function(x, y) {
    var xType = value.type(x),
        yType = value.type(y);
    
    if (xType !== yType)
        return false;
    
    switch (xType) {
    case type.UNDEFINED_TYPE:
    case type.NULL_TYPE:
        return true;
    case type.OBJECT_TYPE:
        return (x === y);
    default:
        return (x.value === y.value);
    }
};

/**
 * Perform a equality comparison on primitive values 'x' and 'y'.
 * 
 * Attempts type conversion.
 *
 * @return Host boolean.
 */
var equal = function(x, y) {
    var strict = strictEqual(x, y);
    if (strict)
        return strict;
    
    var xType = value.type(x),
        yType = value.type(y);
    
    if ((xType === type.NULL_TYPE && yType === type.UNDEFINED_TYPE) ||
      (xType === type.UNDEFINED_TYPE && yType === type.NULL_TYPE)) {
        return true;
    } else if (xType === type.NUMBER_TYPE && yType === type.STRING_TYPE) {
        return equal(x, type_conversion.toNumber(y));
    } else if (xType === type.STRING_TYPE && yType === type.NUMBER_TYPE) {
        return equal(type_conversion.toNumber(x), y);
    } else if (xType === type.BOOLEAN_TYPE) {
        return equal(type_conversion.toNumber(x), y);
    } else if (yType === type.BOOLEAN_TYPE) {
        return equal(x, type_conversion.toNumber(y));
    }
    
    return false;
};

/* Export
 ******************************************************************************/
return {
    'equal': equal,
    'strictEqual': strictEqual
};

});