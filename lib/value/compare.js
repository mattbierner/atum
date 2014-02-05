/**
 * @fileOverview Comparison operations for primitive values.
 * 
 * Does not handle object values.
 */
define(['atum/value/type',
        'atum/value/type_conversion'],
function(type,
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
    if (x.type !== y.type)
        return false;
    
    switch (x.type) {
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
    if (x.type === y.type)
        return strictEqual(x, y);
    
    if ((x.type === type.NULL && y.type === type.UNDEFINED) ||
      (x.type === type.UNDEFINED && y.type === type.NULL)) {
        return true;
    } else if (x.type === type.NUMBER && y.type === type.STRING) {
        return equal(x, type_conversion.toNumber(y));
    } else if (x.type === type.STRING && y.type === type.NUMBER) {
        return equal(type_conversion.toNumber(x), y);
    } else if (x.type === type.BOOLEAN) {
        return equal(type_conversion.toNumber(x), y);
    } else if (y.type === type.BOOLEAN) {
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