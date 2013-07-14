/**
 * @fileOverview Comparison operation computations.
 * 
 * Unlike `atum/value/compare`, these also handle object values.
 */
define(['atum/compute',
        'atum/operations/boolean',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/compare',
        'atum/value/type',
        'atum/value/value'],
function(compute,
        boolean,
        type_conversion,
        value_reference,
        compare,
        type,
        value) {
"use strict";

/* Operations
 ******************************************************************************/
/**
 * Regular equality comparison of `left` and `right`.
 * 
 * Will attempt type conversions.
 * 
 * @param left Computation of left value.
 * @param right Computation of right Value.
 */
var equal = function(left, right) {
    return compute.binary(left, right, function(lRef, rRef) {
        return compute.binary(
            value_reference.getValue(compute.just(lRef)),
            value_reference.getValue(compute.just(rRef)),
            function(l, r) {
                if (value.type(l) === type.OBJECT_TYPE && value.type(r) === type.OBJECT_TYPE)
                    return boolean.create(l === r);
                else if (value.type(l) === type.OBJECT_TYPE)
                    return equal(
                        type_conversion.toPrimitive(compute.just(lRef)),
                        compute.just(r));
                else if (value.type(r) === type.OBJECT_TYPE)
                    return equal(
                        compute.just(l),
                        type_conversion.toPrimitive(compute.just(rRef)));
                return compute.just(compare.equal(l, r));
            });
    });
};

/**
 * Strict equality comparison of `left` and `right`.
 * 
 * Does not attempt type conversion.
 * 
 * @param left Computation of left value.
 * @param right Computation of right Value.
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