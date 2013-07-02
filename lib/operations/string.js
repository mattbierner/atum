/**
 * @fileOverview Computations for strings.
 */
define(['atum/compute',
        'atum/value/string'],
function(compute,
        string) {
"use strict";

/* Creation
 ******************************************************************************/
/**
 * Computation to create a new string with a given value.
 */
var create = function(value) {
    return compute.just(new string.String(value));
};

/* Operations
 ******************************************************************************/
/**
 * Computation that concatenates  computations 'l' and 'l' which result in strings values,
 * and returns new string value.
 */
var concat = function(l, r) {
    return compute.binary(l, r, function(lVal, rVal) {
        return compute.just(string.concat(lVal, rVal)); 
    });
};

/* Export
 ******************************************************************************/
return {
    'create': create,
    
    'concat': concat
};

});