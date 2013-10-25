/**
 * @fileOverview Operations for builtin constructors
 */
define(['exports',
        'atum/compute',
        'atum/operations/func'],
function(exports,
        compute,
        func){
"use strict";

/* Operations
 ******************************************************************************/
/**
 */
var create = function(id, length, prototype, impl) {
    return compute.bind(impl, function(f) {
        return func.create(id, length, f);
    });
};

/* Export
 ******************************************************************************/
exports.create = create;

});