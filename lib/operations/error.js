/**
 * @fileOverview Error computations.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/native_errors',
        'atum/operations/object'],
function(exports,
        compute,
        native_errors,
        object) {
//"use strict";


var createTypeError = function(msg) {
    return object.construct(compute.just(native_errors.TypeError), compute.sequence(msg));
};

var typeError = function(msg) {
    return compute.bind(createTypeError(msg), compute.error);
};

/* Export
 ******************************************************************************/
exports.typeError = typeError;

});