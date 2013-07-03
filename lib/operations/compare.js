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
            if (value.type(l) === type.OBJECT_TYPE && value.type(r) === type.OBJECT_TYPE) {
                return boolean.create(l === r);
            } else if (value.type(l) === type.OBJECT_TYPE) {
                return equal(type_conversion.toPrimitive(compute.just(l)), compute.just(r));
            } else if (value.type(r) === type.OBJECT_TYPE) {
                return equal(compute.just(l), type_conversion.toPrimitive(compute.just(r)));
            }
            return compute.just(compare.equal(l, r));
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
            return (value.type(l) === type.OBJECT_TYPE && value.type(r) === type.OBJECT_TYPE ?
                boolean.create(l === r) :
                compute.just(compare.strictEqual(l, r)));
        });
};

/* Export
 ******************************************************************************/
return {
    'equal': equal,
    'strictEqual': strictEqual
};

});