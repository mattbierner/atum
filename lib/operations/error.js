/**
 * @fileOverview Error computations.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/native_errors',
        'atum/operations/execution_context',
        'atum/operations/object',
        'atum/operations/string'],
function(exports,
        compute,
        native_errors,
        execution_context,
        object,
        string) {
"use strict";

var createError = function(type) {
    return function(msg) {
        return (msg ?
            compute.bind(
                string.concat(msg, string.create(' '), compute.bind(execution_context.loc, string.create)),
                function(msg) {
                    return object.construct(type, [msg]);
                }) :
            object.construct(type, []));
    };
};

var error = function(type) {
    var create = createError(type);
    return function(msg) {
        return compute.bind(create(msg), compute.error);
    };
}

/* Error Computations
 ******************************************************************************/
/**
 * Error with an eval error.
 * 
 * @param [msg] Optional computation giving message for error.
 */
var evalError = error(native_errors.EvalError);

/**
 * Error with a range error.
 * 
 * @param [msg] Optional computation giving message for error.
 */
var rangeError = error(native_errors.RangeError);

/**
 * Error with a reference error.
 * 
 * @param [msg] Optional computation giving message for error.
 */
var referenceError = error(native_errors.ReferenceError);

/**
 * Error with a syntax error.
 * 
 * @param [msg] Optional computation giving message for error.
 */
var syntaxError = error(native_errors.SyntaxError);

/**
 * Error with a type error.
 * 
 * @param [msg] Optional computation giving message for error.
 */
var typeError = error(native_errors.TypeError);

/**
 * Error with a reference error.
 * 
 * @param [msg] Optional computation giving message for error.
 */
var uriError = error(native_errors.UriError);

/* Export
 ******************************************************************************/
exports.evalError = evalError;
exports.rangeError = rangeError;
exports.referenceError = referenceError;
exports.syntaxError = syntaxError;
exports.typeError = typeError;
exports.uriError = uriError;

});