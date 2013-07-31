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

/*
 ******************************************************************************/
var createTypeError = function(msg) {
    return object.construct(
        compute.just(native_errors.TypeError),
        compute.sequence(msg));
};

var typeError = function(msg) {
    return compute.bind(createTypeError(msg || string.empty), compute.error);
};

/* Export
 ******************************************************************************/
exports.typeError = typeError;

});