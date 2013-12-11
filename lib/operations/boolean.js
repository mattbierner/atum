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
 * Create a new hosted boolean value.
 * 
 * @param x Host value to create hosted boolean from.
 */
var create = compute.lift(boolean.Boolean.create);

/**
 * Create a new hosted boolean value from the results of a computation.
 */
var from = compute.composeWith(create);

/**
 * Hosted true value.
 */
var TRUE = compute.just(boolean.TRUE);

/**
 * Hosted false value.
 */
var FALSE = compute.just(boolean.FALSE);

/* Host Operations
 ******************************************************************************/
/**
 * Computation resulting in host boolean value of if the result of computation
 * `c` a true boolean hosted value. 
 */
var isTrue = compute.compose(
    type_conversion.toBoolean,
    compute.lift(boolean.isTrue));

/* Logical Operators
 ******************************************************************************/
/**
 * Perform a logical not on `argument`.
 * 
 * @param argument Computation resulting in hosted boolean value.
 */
var logicalNot = compute.compose(
    type_conversion.toBoolean,
    compute.lift(boolean.logicalNot));

/* Export
 ******************************************************************************/
// Host Operations
exports.isTrue = isTrue;

// Creation
exports.create = create;
exports.from = from;

exports.TRUE = TRUE;
exports.FALSE = FALSE;

// Operators
exports.logicalNot = logicalNot;

});