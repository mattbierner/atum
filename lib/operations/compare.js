/**
 * @fileOverview Computations for comparison operations.
 * 
 * Also correctly handles object values.
 */
define(['atum/compute',
        'atum/value/type',
        'atum/value/value',
        'atum/operations/boolean',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/compare'],
function(compute,
        type,
        value,
        boolean,
        type_conversion,
        value_reference,
        compare) {
"use strict";

/* Computations
 ******************************************************************************/
/**
 * Computation that performs a regular equality comparison of two values.
 */
var equal = function(left, right) {
    return compute.binary(
        value_reference.getValue(left),
        value_reference.getValue(right),
        function(l, r) {
            if (value.type(l) === type.OBJECT_TYPE || value.type(r) === type.OBJECT_TYPE) {
                return boolean.create(l === r);
            } else if (value.type(l) === type.OBJECT_TYPE) {
                return equal(type_conversion.toPrimitive(compute.always(l)), compute.always(r));
            } else if (value.type(r) === type.OBJECT_TYPE) {
                return equal(compute.always(l), type_conversion.toPrimitive(compute.always(r)));
            }
            return compute.always(compare.equal(l, r));
        });
};

/**
 * Computation that performs a strict equality comparison of two values.
 */
var strictEqual = function(left, right) {
    return compute.binary(
        value_reference.getValue(left),
        value_reference.getValue(right),
        function(l, r) {
            if (value.type(l) === type.OBJECT_TYPE && value.type(r) === type.OBJECT_TYPE) {
                return boolean.create(l === r);
            }
            return compute.always(compare.strictEqual(l, r));
        });
};

/* Export
 ******************************************************************************/
return {
    'equal': equal,
    'strictEqual': strictEqual
};

});