/**
 * @fileOverview Comparison operations for primitive values.
 */
define(['atum/value/value',
        'atum/value/type_conversion',
        'atum/value/type'],
function(value,
        type_conversion,
        type) {
"use strict";

/* Compare Operations
 ******************************************************************************/
/**
 * Perform a strict equality comparison on primitive values 'x' and 'y'.
 * 
 * Does not perform type conversion.
 */
var strictEqual = function(x, y) {
    var xType = value.type(x),
        yType = value.type(y);
    
    if (xType !== yType) {
        return false;
    }
    
    switch (xType) {
    case type.UNDEFINED_TYPE:
    case type.NULL_TYPE:
        return true;
    case type.NUMBER_TYPE:
        return (x.value === NaN || y.value === NaN ?
            false :
            (x.value === y.value));
    default:
        return (x.value === y.value);
    }
};

/**
 * Perform a equality comparison on primitive values 'x' and 'y'.
 * 
 * Attempts type conversion.
 */
var equal = function(x, y) {
    if (strictEqual(x, y)) {
        return true;
    }
    
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
    } else if ((xType === type.STRING_TYPE || x.Type === type.NUMBER_TYPE) &&
      yType === object.OBJECT_TYPE) {
        return equal(x, type_conversion.toPrimitive(y));
    } else if ((yType === type.STRING_TYPE || y.Type === type.NUMBER_TYPE) &&
      xType === object.OBJECT_TYPE) {
        return equal(type_conversion.toPrimitive(x), y);
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