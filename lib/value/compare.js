/**
 * @fileOverview Comparison operations for primitive values.
 * 
 * Does not handle object values.
 */
define(['atum/value/type',
        'atum/value/type_conversion',
        'atum/value/value'],
function(type,
        type_conversion,
        value) {
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
    case type.UNDEFINED:
    case type.NULL:
        return true;
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
    
    if ((xType === type.NULL && yType === type.UNDEFINED) ||
      (xType === type.UNDEFINED && yType === type.NULL)) {
        return true;
    } else if (xType === type.NUMBER && yType === type.STRING) {
        return equal(x, type_conversion.toNumber(y));
    } else if (xType === type.STRING && yType === type.NUMBER) {
        return equal(type_conversion.toNumber(x), y);
    } else if (xType === type.BOOLEAN) {
        return equal(type_conversion.toNumber(x), y);
    } else if (yType === type.BOOLEAN) {
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