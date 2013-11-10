/**
 * @fileOverview Boolean builtin operations
 */
define(['exports',
        'atum/builtin/boolean',
        'atum/operations/construct'],
function(exports,
        builtin_boolean,
        construct){
"use strict";

/* Operations
 ******************************************************************************/
/**
 * Create a new builtin boolean object
 * 
 * @param primitiveValue Value stored in boolean object.
 */
var create = function(primitiveValue) {
    return construct.construct(builtin_boolean.Boolean, [primitiveValue]);
};

/* Export
 ******************************************************************************/
exports.create = create;

});