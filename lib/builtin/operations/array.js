/**
 * @fileOverview Common builtin Array operations.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/builtin/array',
        'atum/operations/object',
        'atum/operations/type_conversion',
        'atum/value/number',
        'atum/value/property'],
function(exports,
        compute,
        fun,
        array,
        object,
        type_conversion,
        number,
        property){
"use strict";

/* Operations
 ******************************************************************************/
/**
 * Create a new builtin array from a list of elements. 
 * 
 * Elements may be null for uninitialized array values.
 */
var create = function(elements) {
    return fun.reduce(
        function(p, c, i) {
            if (!c)
                return p;
            return compute.bind(c, function(x) {
                return object.defineProperty(p, i,
                    property.createValuePropertyFlags(x,
                        property.ENUMERABLE | property.CONFIGURABLE | property.WRITABLE));
            });
        },
        object.construct(
            array.Array,
            [new number.Number(elements.length)]),
        elements);
};

/**
 * Convert a hosted array object to a host array.
 */
var toHost = function(arr) {
    return compute.bind(
        compute.bind(object.get(arr, 'length'), type_conversion.toUint32),
        function(len) {
            var args = [];
            for (var i = 0; i < len.value; ++i)
                args.push(object.get(arr, i));
            return compute.enumerationa(args);
        });
};

/* Export
 ******************************************************************************/
exports.create = create;
exports.toHost = toHost;
});