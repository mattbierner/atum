/**
 * @fileOverview Comparison operation computations.
 * 
 * Unlike `atum/value/compare`, these also handle object values.
 */
define(['exports',
        'atum/compute',
        'atum/operations/boolean',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/compare',
        'atum/value/value'],
function(exports,
        compute,
        boolean,
        type_conversion,
        value_reference,
        compare,
        value) {
"use strict";

/* Operations
 ******************************************************************************/
/**
 * Regular equality comparison of `left` and `right`.
 * 
 * Will attempt type conversions.
 */
var equal = function(left, right) {
    return compute.binary(
        value_reference.getValue(left),
        value_reference.getValue(right),
        function(l, r) {
            if (value.isObject(l) && value.isObject(r))
                return boolean.create(l === r);
            else if (value.isObject(l))
                return compute.bind(
                    type_conversion.toPrimitive(left),
                    function(l) {
                        return equal(l, right);
                    });
            else if (value.isObject(r))
                return compute.bind(
                    type_conversion.toPrimitive(right),
                    function(r) {
                        return equal(left, r);
                    });
            return boolean.create(compare.equal(l, r));
        });
};

/**
 * Strict equality comparison of `left` and `right`.
 * 
 * Does not attempt type conversion.
 */
var strictEqual = function(left, right) {
    return compute.binary(
        value_reference.getValue(left),
        value_reference.getValue(right),
        function(l, r) {
            return boolean.create(value.isObject(l) && value.isObject(r) ?
                (l === r) :
                compare.strictEqual(l, r));
        });
};

/* Export
 ******************************************************************************/
exports.equal = equal;
exports.strictEqual = strictEqual;

});