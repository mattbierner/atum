/**
 * @fileOverview Error object builtin.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/error',
        'atum/builtin/object',
        'atum/builtin/operations/builtin_function',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/error',
        'atum/builtin/meta/object',
        'atum/builtin/operations/builtin_constructor',
        'atum/operations/object',
        'atum/operations/error',
        'atum/operations/evaluation',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/string',
        'atum/value/property',
        'atum/value/value',
        'text!atum/builtin/hosted/error.js'],
function(exports,
        compute,
        error_builtin,
        object_builtin,
        func_builtin,
        meta_builtin_constructor,
        meta_error,
        meta_object,
        builtin_constructor,
        object,
        error,
        evaluation,
        type_conversion,
        value_reference,
        string,
        property,
        value){
"use strict";

/* Error
 ******************************************************************************/
/**
 * `Error([msg])`
 */
var ErrorCall = function(ref, thisObj, args) {
    return this.construct(ref, args);
};

/**
 * `new Error([msg])`
 */
var ErrorConstruct = function(ref, args) {
    var msg = args.getArg(0);
    if (value.isUndefined(msg))
        return value_reference.create(new ErrorInstance());
    
    return compute.binary(
        value_reference.create(new ErrorInstance()),
        type_conversion.toString(msg),
        function(obj, msg) {
            return object.set(obj, 'message', msg);
        });
};

/**
 * `Error`
 */
var Error = new meta_builtin_constructor.BuiltinConstructor(
    func_builtin.FunctionPrototype, {
        'prototype': property.createValuePropertyFlags(
            error_builtin.ErrorPrototype)
    },
    true,
    ErrorCall,
    ErrorConstruct);

/* ErrorInstance
 ******************************************************************************/
var ErrorInstance = function() {
    meta_error.Error.call(this, this.proto, this.properties, true);
};
ErrorInstance.prototype = new meta_error.Error;
ErrorInstance.prototype.constructor = ErrorInstance; 

ErrorInstance.prototype.proto = error_builtin.ErrorPrototype;

ErrorInstance.prototype.properties = {};

/* ErrorPrototype
 ******************************************************************************/
var ErrorPrototype = new meta_object.Object(
    object_builtin.ObjectPrototype, {
        'constructor': property.createValuePropertyFlags(
            error_builtin.Error),
        
        'message': property.createValuePropertyFlags(
             string.EMPTY,
             property.WRITABLE | property.CONFIGURABLE),
         
        'name': property.createValuePropertyFlags(
            new string.String('Error'),
            property.WRITABLE | property.CONFIGURABLE)
    },
    true);

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        builtin_constructor.create('Error', 1,  error_builtin.ErrorPrototype,  error_builtin.Error.setValue(Error)),
        
        error_builtin.ErrorPrototype.setValue(ErrorPrototype));
};

var configure = function(mutableBinding, immutableBinding) {
    return mutableBinding('Error', error_builtin.Error);
};

var execute = function() {
    return evaluation.evaluateFile('atum/builtin/hosted/error.js');
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;
exports.configure = configure;
exports.execute = execute;

});