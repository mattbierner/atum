/**
 * @fileOverview Common builtin Array operations.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/builtin/array',
        'atum/operations/construct',
        'atum/operations/number',
        'atum/operations/object',
        'atum/value/number',
        'atum/value/property'],
function(exports,
        compute,
        fun,
        array,
        construct,
        number,
        object,
        number_value,
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
    return compute.bind(
        construct.construct(
            array.Array,
            [new number_value.Number(elements.length)]),
        function(t) {
            return compute.next(
                compute.sequencea(
                    fun.map(function(c, i) {
                        return (!c ? compute.empty :
                            compute.bind(c, function(x) {
                                return object.defineProperty(t, i, 
                                    property.createValuePropertyFlags(x, property.ALL));
                        }));
                    }, elements)),
                compute.just(t));
        });
};

/**
 * Convert a hosted array object to a host array.
 */
var toHost = function(arr) {
    return compute.bind(
        compute.bind(object.get(arr, 'length'), number.toHost),
        function(len) {
            return compute.eager(compute.enumerationa(
                fun.map(
                    fun.curry(object.get, arr),
                    fun.gen(len))));
        });
};

/* Export
 ******************************************************************************/
exports.create = create;
exports.toHost = toHost;
});