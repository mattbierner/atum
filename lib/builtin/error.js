/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/object',
        'atum/value/object',
        'atum/operations/value_reference'],
function(exports,
        compute,
        value_reference,
        object,
        object_value,
        value_reference_operations){
//"use strict";

/* Refs
 ******************************************************************************/
var errorRef = new value_reference.ValueReference();

var errorPrototypeRef = new value_reference.ValueReference();

/* ErrorPrototype
 ******************************************************************************/
var ErrorPrototype = function(message) {
    object_value.Object.call(this, this.proto, this.properties);
};
ErrorPrototype.prototype = new object_value.Object;
ErrorPrototype.prototype.constructor = ErrorPrototype;

ErrorPrototype.prototype.proto = object.objectPrototypeRef;
ErrorPrototype.prototype.cls = "Error";

ErrorPrototype.prototype.properties = {
    
};

/* Error
 ******************************************************************************/
/**
 * 
 */
var Error = function() {
    object.Object.call(this);
};
Error.prototype = new object.Object;

Error.prototype.properties = {
    'prototype': {
        'value': errorPrototypeRef,
        'writable': false,
        'enumerable': false,
        'configurable': false
    }
};

Error.prototype.call = function(ref, thisObj, args) {
    return this.construct(args);
};

Error.prototype.construct = function(args) {
    return value_reference_operations.create(new ErrorPrototype(args[0]));
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        errorRef.setValue(new Error()),
        
        errorPrototypeRef.setValue(new ErrorPrototype()));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.errorRef = errorRef;

exports.Error = Error;
exports.ErrorPrototype =  ErrorPrototype;

});