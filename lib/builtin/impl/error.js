/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/builtin/error',
        'atum/builtin/object',
        'atum/builtin/builtin_function',
        'atum/builtin/meta/error',
        'atum/builtin/meta/func',
        'atum/builtin/meta/object',
        'atum/operations/error',
        'atum/operations/evaluation',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/object',
        'atum/value/string',
        'atum/value/value',
        'text!atum/builtin/hosted/error.js'],
function(exports,
        compute,
        error_ref,
        object,
        builtin_function,
        meta_error,
        meta_func,
        meta_object,
        error,
        evaluation,
        string,
        type_conversion,
        value_reference,
        object_value,
        string_value,
        value){
//"use strict";

/* Error
 ******************************************************************************/
/**
 * 
 */
var Error = function() {
    meta_func.Function.call(this, this.proto, this.properties);
};
Error.prototype = new meta_func.Function;

Error.prototype.proto = builtin_function.FunctionPrototype;

Error.prototype.properties = {
    'prototype': {
        'value': error_ref.ErrorPrototype
    }
};

Error.prototype.call = function(ref, thisObj, args) {
    return this.construct(ref, args);
};

Error.prototype.construct = function(ref, args) {
    return value_reference.create(
        new ErrorInstance(args.getArg(0)));
};

/* ErrorInstance
 ******************************************************************************/
var ErrorInstance = function() {
    meta_error.Error.call(this, this.proto, this.properties);
};
ErrorInstance.prototype = new meta_error.Error;
ErrorInstance.prototype.constructor = ErrorInstance; 

ErrorInstance.prototype.proto = error_ref.ErrorPrototype;

ErrorInstance.prototype.properties = {};

/* ErrorPrototype
 ******************************************************************************/
var ErrorPrototype = function() {
    meta_object.Object.call(this, this.proto, this.properties);

};
ErrorPrototype.prototype = new meta_object.Object;
ErrorPrototype.prototype.constructor = ErrorPrototype;

ErrorPrototype.prototype.proto = object.ObjectPrototype;

ErrorPrototype.prototype.properties = { };

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        error_ref.Error.setValue(new Error()),
        
        error_ref.ErrorPrototype.setValue(new ErrorPrototype()),
        evaluation.evaluateFile('atum/builtin/hosted/error.js'));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.Error = error_ref.Error;
exports.ErrorPrototype =  error_ref.ErrorPrototype;

});