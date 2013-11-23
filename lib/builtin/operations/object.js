/**
 * @fileOverview Object builtin operations
 */
define(['exports',
        'atum/builtin/object',
        'atum/operations/construct'],
function(exports,
        builtin_object,
        construct){
"use strict";

/* Operations
 ******************************************************************************/
/**
 * Create a new builtin object.
 */
var create = function() {
    return construct.construct(builtin_object.Object, []);
};

/* Export
 ******************************************************************************/
exports.create = create;

});