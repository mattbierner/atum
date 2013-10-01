/**
 * @fileOverview Operations for builtin constructors
 */
define(['exports',
        'atum/compute',
        'atum/builtin/func',
        'atum/builtin/meta/builtin_function',
        'atum/operations/func',
        'atum/operations/object',
        'atum/value/number',
        'atum/value/property'],
function(exports,
        compute,
        func_builtin,
        meta_builtin_function,
        func,
        object,
        number_value,
        property){
"use strict";

/* Operations
 ******************************************************************************/
/**
 */
var create = function(id, length, prototype, impl) {
    return compute.bind(impl, function(f) {
        return object.defineProperties(compute.just(f), {
            'length': property.createValuePropertyFlags(
                new number_value.Number(length)),
                
            'prototype': property.createValuePropertyFlags(
                prototype, 
                property.WRITABLE | property.CONFIGURABLE)
        });
    });
};


/* Export
 ******************************************************************************/
exports.create = create;

});