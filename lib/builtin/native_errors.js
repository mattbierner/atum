/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/object',
        'atum/builtin/builtin_function',
        'atum/builtin/meta/native_error',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/object',
        'atum/value/string',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        compute,
        value_reference,
        object,
        builtin_function,
        meta_native_error,
        string,
        type_conversion,
        value_reference_operations,
        object_value,
        string_value,
        type,
        value){
//"use strict";

/* Refs
 ******************************************************************************/
var referenceErrorRef = new value_reference.ValueReference();

/* ErrorPrototype
 ******************************************************************************/
var ReferenceError = function() {
    
};
ReferenceError.prototype = new meta_native_error.NativeError;

var ReferenceErrorPrototype = function(message) {
    return (new meta_native_error.NativeErrorPrototype())
        .defineOwnProperty('message', {'value': message});
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        referenceErrorRef.setValue(new ReferenceError()));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.referenceErrorRef = referenceErrorRef;

exports.ReferenceErrorPrototype = ReferenceErrorPrototype;

});