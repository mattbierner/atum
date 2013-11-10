/**
 * @fileOverview String builtin operations
 */
define(['exports',
        'atum/builtin/string',
        'atum/operations/construct'],
function(exports,
        builtin_string,
        construct){
"use strict";

/* Operations
 ******************************************************************************/
/**
 * Create a new builtin string object
 * 
 * @param primitiveValue Value stored in string object.
 */
var create = function(primitiveValue) {
    return construct.construct(builtin_string.String, [primitiveValue]);
};

/* Export
 ******************************************************************************/
exports.create = create;

});