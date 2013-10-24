/**
 * @fileOverview Operations for builtin constructors
 */
define(['exports',
        'atum/compute',
        'atum/builtin/func',
        'atum/operations/func',
        'atum/operations/object',
        'atum/value/number',
        'atum/value/property'],
function(exports,
        compute,
        func_builtin,
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
        return object.defineProperties(
            compute.just(f), {
            'length': property.createValuePropertyFlags(
                new number_value.Number(length))
        });
    });
};


/* Export
 ******************************************************************************/
exports.create = create;

});