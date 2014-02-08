/**
 * @fileOverview Boolean value computations.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/operations/type_conversion',
        'atum/value/boolean',
        'atum/value/value'],
function(exports,
        compute,
        fun,
        type_conversion,
        boolean,
        value) {
"use strict";

/* Creation
 ******************************************************************************/
/**
 * Create a hosted boolean value.
 * 
 * @param x Host value to create hosted boolean from.
 */
exports.create = compute.from(boolean.create);

/**
 * Create a hosted boolean value from the results of a computation.
 */
exports.from = compute.lift(boolean.create);

/* Constants
 ******************************************************************************/
exports.TRUE = compute.just(boolean.TRUE);

exports.FALSE = compute.just(boolean.FALSE);

/* Host Operations
 ******************************************************************************/
/**
 * Computation resulting in host boolean value of if the result of computation
 * `c` a true boolean hosted value. 
 */
exports.isTrue = compute.compose(
    type_conversion.toBoolean,
    compute.from(boolean.isTrue));

/* Logical Operators
 ******************************************************************************/
/**
 * Perform a logical not on `argument`.
 * 
 * @param argument Computation resulting in hosted boolean value.
 */
exports.logicalNot = compute.compose(
    type_conversion.toBoolean,
    compute.from(boolean.logicalNot));

});