/**
 * @fileOverview Common builtin Array operations.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/array',
        'atum/operations/object',
        'atum/value/number',
        'atum/value/property'],
function(exports,
        compute,
        array,
        object,
        number,
        property){
"use strict";

var reduce = Function.prototype.call.bind(Array.prototype.reduce);

/* Operations
 ******************************************************************************/
/**
 * Create a new builtin array from a list of computation elements. 
 * 
 * Elements may be null for uninitialized array values.
 */
var create = function(elements) {
    return reduce(elements, function(p, c, i) {
        if (!c)
            return p;
        return compute.bind(c, function(x) {
            return object.defineProperty(p, i,
                property.createValuePropertyFlags(x, property.ENUMERABLE | property.CONFIGURABLE | property.WRITABLE));
        });
    }, object.construct(
        array.Array,
        [new number.Number(elements.length)]));
};

/* Export
 ******************************************************************************/
exports.create = create;

});