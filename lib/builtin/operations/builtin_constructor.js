/**
 * @fileOverview Operations for builtin constructors
 */
define(['exports',
        'atum/compute',
        'atum/builtin/func',
        'atum/builtin/meta/builtin_constructor',
        'atum/operations/object',
        'atum/value/number',
        'atum/value/string',
        'atum/value/property'],
function(exports,
        compute,
        func_builtin,
        meta_builtin_constructor,
        object,
        number_value,
        string_value,
        property){
"use strict";

/* Operations
 ******************************************************************************/
/**
 */
var create = function(ref, id, length, properties, call, construct) {
    return compute.next(
        ref.setValue(
            meta_builtin_constructor.BuiltinConstructor.create(
                func_builtin.FunctionPrototype,
                properties,
                true,
                call,
                construct)),
        object.defineProperties(ref, {
            'length': property.createValuePropertyFlags(
                new number_value.Number(length)),
            
            'name': property.createValuePropertyFlags(
                (id ? new string_value.String(id) : string_value.EMPTY))
        }));
};

/* Export
 ******************************************************************************/
exports.create = create;

});