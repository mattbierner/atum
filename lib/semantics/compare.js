/**
 * @fileOverview Semantics for comparison
 */
define(['atum/compute',
        'atum/value/compare',
        'atum/semantics/boolean'],
function(compute,
        compare,
        boolean) {
//"use strict";


/* Computations
 ******************************************************************************/
/**
 * 
 */
var equal = function(left, right) {
    return compute.binda(
        compute.sequence(
            left,
            right),
        function(l, r) {
            return boolean.create(compare.equal(l, r));
        });
};

/**
 * 
 */
var strictEqual = function(left, right) {
    return compute.binda(
        compute.sequence(
            left,
            right),
        function(l, r) {
            return boolean.create(compare.strictEqual(l, r));
        });
};



/* Export
 ******************************************************************************/
return {
    'equal': equal,
    'strictEqual': strictEqual
};

});