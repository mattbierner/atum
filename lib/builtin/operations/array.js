/**
 * @fileOverview The builtin Array object.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/array',
        'atum/operations/object',
        'atum/value/number',
        'atum/value/property'],
function(exports,
        compute,
        array_ref,
        object,
        number,
        property){
//"use strict";

var reduce = Function.prototype.call.bind(Array.prototype.reduce);

/* Operations
 ******************************************************************************/
/**
 */
var create = function(elements) {
    return reduce(elements, function(p, c, i) {
        if (!c)
            return p;
        return object.defineProperty(p, i,
            property.createValueProperty(c, true, true, true));
    }, object.construct(
        array_ref.Array,
        [new number.Number(elements.length)]));
};

/* Export
 ******************************************************************************/
exports.create = create;

});