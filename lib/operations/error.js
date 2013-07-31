/**
 * @fileOverview Error computations.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/native_errors',
        'atum/operations/object',
        'atum/operations/string'],
function(exports,
        compute,
        native_errors,
        object,
        string) {
"use strict";

/* Type Error
 ******************************************************************************/
/**
 * Create a type error with optional message.
 */
var createTypeError = function(msg) {
    return object.construct(
        compute.just(native_errors.TypeError),
        (msg ? compute.sequence(msg) : compute.sequence()));
};

/**
 * Error with a type error.
 * 
 * @param [msg] Optional computation giving message for error.
 */
var typeError = function(msg) {
    return compute.bind(createTypeError(msg), compute.error);
};

/* Export
 ******************************************************************************/
exports.typeError = typeError;

});