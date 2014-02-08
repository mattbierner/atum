/**
 * @fileOverview Error computations.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/builtin/native_errors',
        'atum/operations/execution_context',
        'atum/operations/construct',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion'],
function(exports,
        compute,
        fun,
        native_errors,
        execution_context,
        construct,
        object,
        string) {
"use strict";

var createError = function(type) {
    return function(/*...*/) {
        return (arguments.length ?
            compute.bind(
                string.concata(fun.map(function(x) {
                    if (typeof x === 'string')
                        return string.create(x);
                    if (typeof x !== 'function')
                        return type_conversion.toString(x);
                    return x;
                }, arguments)),
                function(msg) {
                    return construct.construct(type, [msg]);
                }) :
            construct.construct(type, []));
    };
};

var error = function(type) {
    return compute.composen(
        createError(type),
        compute.error);
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

/* 
 ******************************************************************************/
var assert = function(check, err, value) {
    return compute.bind(value, function(x) {
        return (check(x) ? compute.just(x) : err);
    });
};

/* Basic Stack Operations
 ******************************************************************************/
/**
 * Gets the error handlers for the current execution context.
 */
var getErrorHandlers = execution_context.extract(function(ctx) {
    return ctx.metadata.errorHandlers;
});

/**
 * Sets the error handlers to `s`
 */
var setErrorHandlers = function(s) {
    return execution_context.modifyContext(function(ctx) {
        return ctx.setMetadata(ctx.metadata.setErrorHandlers(s));
    });
};

/**
 */
var modifyErrorHandlers = function(f) {
    return compute.bind(getErrorHandlers, fun.compose(setErrorHandlers, f));
};

/* Stack Operations
 ******************************************************************************/
/**

 */
var push = function(frame) {
    return modifyErrorHandlers(fun.curry(fun.concat, frame));
};

/**
 */
var pop = modifyErrorHandlers(fun.curry(fun.slice, 1, undefined));


/* Export
 ******************************************************************************/
exports.evalError = evalError;
exports.rangeError = rangeError;
exports.referenceError = referenceError;
exports.syntaxError = syntaxError;
exports.typeError = typeError;
exports.uriError = uriError;

exports.assert = assert;

// Error Handlers
exports.push = push;
exports.pop = pop;

});