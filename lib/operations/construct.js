/**
 * @fileOverview Object creation operations.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/builtin/meta/object',
        'atum/operations/error',
        'atum/operations/string',
        'atum/operations/value_reference',
        'atum/value/args',
        'atum/value/value'],
function(exports,
        compute,
        fun,
        meta_object,
        error,
        string,
        value_reference,
        args,
        value) {
"use strict";

/* Creation Operations
 ******************************************************************************/
/**
 * Construct a new object from a constructor.
 * 
 * @param callee Reference the constructor object.
 * @param a Arguments to pass to constructor.
 */
var constructForward = function(callee, a) {
    return value_reference.dereference(callee, function(obj) {
        return (value.isObject(obj) ?
            obj.construct(callee, a) :
            error.typeError('construct on non object'));
    });
};

/**
 * Construct a new object from a constructor.
 * 
 * @param callee Reference the constructor object.
 * @param a Array of arguments to pass to constructor.
 */
var construct = function(callee, a) {
    return constructForward(callee, args.Args.create(a));
};

/**
 * 
 */
var create = fun.compose(
    value_reference.create,
    meta_object.Object.create);

/* Exports
 ******************************************************************************/
exports.constructForward = constructForward;
exports.construct = construct;
exports.create = create;

});