/**
 * @fileOverview String computations.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/operations/type_conversion',
        'atum/value/string'],
function(exports,
        compute,
        fun,
        type_conversion,
        string) {
"use strict";

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
    return compute.just(new string.String(x + ''));
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
 * @param left Computation resulting in string value.
 * @param right Computation resulting in string value.
 */
var binaryConcat = function(left, right) {
    return compute.binary(
        compute.bind(left, type_conversion.toString),
        compute.bind(right, type_conversion.toString),
        compute.lift(string.concat));
};

/**
 * Concatenates all arguments into a new hosted string.
 */
var concat = fun.compose(
    fun.curry(fun.reduce, binaryConcat, EMPTY),
    fun.args);

/* Export
 ******************************************************************************/
// Constants
exports.EMPTY = EMPTY;

// Creation
exports.create = create;
exports.from = from;

// Operations
exports.concat = concat;

});