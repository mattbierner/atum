/**
 * @fileOverview Number builtin operations
 */
define(['exports',
        'atum/builtin/number',
        'atum/operations/construct'],
function(exports,
        builtin_number,
        construct){
"use strict";

/* Operations
 ******************************************************************************/
/**
 * Create a new builtin number object
 * 
 * @param primitiveValue Value stored in number object.
 */
var create = function(primitiveValue) {
    return construct.construct(builtin_number.Number, [primitiveValue]);
};

/* Export
 ******************************************************************************/
exports.create = create;

});