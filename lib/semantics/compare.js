/**
 * @fileOverview Semantics for comparison
 */
define(['atum/compute',
        'atum/value/compare'],
function(compute,
        compare) {
"use strict";

/* Computations
 ******************************************************************************/
/**
 * Computation that performs a regular equality comparison of two values.
 */
var equal = function(left, right) {
    return compute.binda(
        compute.sequence(
            left,
            right),
        function(l, r) {
            return compute.always(compare.equal(l, r));
        });
};

/**
 * Computation that performs a strict equality comparison of two values.
 */
var strictEqual = function(left, right) {
    return compute.binda(
        compute.sequence(
            left,
            right),
        function(l, r) {
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