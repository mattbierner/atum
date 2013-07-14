/**
 * @fileOverview String computations.
 */
define(['atum/compute',
        'atum/value/string'],
function(compute,
        string) {
"use strict";

/* Creation
 ******************************************************************************/
/**
 * Create a new hosted string.
 * 
 * @param {string} x Host value to store in string.
 */
var create = function(x) {
    return compute.just(new string.String(x));
};

/* Operations
 ******************************************************************************/
/**
 * Concatenates `l` and `l` into a new hosted string.
 * 
 * @param l Computation resulting in string value.
 * @param r Computation resulting in string value.
 */
var concat = function(l, r) {
    return compute.binary(l, r, function(lVal, rVal) {
        return compute.just(string.concat(lVal, rVal)); 
    });
};

/* Export
 ******************************************************************************/
return {
// Creation
    'create': create,
    
// Operations
    'concat': concat
};

});