/**
 * @fileOverview String computations.
 */
define(['atum/compute',
        'atum/value/string'],
function(compute,
        string) {
"use strict";

var reduce = Function.prototype.call.bind(Array.prototype.reduce);

/* Constants
 ******************************************************************************/
/**
 * Computation resulting in empty string;
 */
var EMPTY = compute.just(string.EMPTY);

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

/**
 * Computation that creates a new hosted string from the result of computation x.
 * 
 * @param x Computation resulting in a host string to store in string.
 */
var from = function(x) {
    return compute.bind(x, create);
};

/* Operations
 ******************************************************************************/
/**
 * Concatenates `l` and `l` into a new hosted string.
 * 
 * @param l Computation resulting in string value.
 * @param r Computation resulting in string value.
 */
var binaryConcat = function(l, r) {
    return compute.binary(l, r, function(lVal, rVal) {
        return compute.just(string.concat(lVal, rVal));
    });
};

/**
 * Concatenates all arguments into a new hosted string.
 */
var concat = function(/*...*/) {
    return reduce(arguments, binaryConcat);
};

/* Export
 ******************************************************************************/
return {
// Constants
    'EMPTY': EMPTY,

// Creation
    'create': create,
    'from': from,
    
// Operations
    'concat': concat
};

});