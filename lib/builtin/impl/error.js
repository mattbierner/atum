/**
 * @fileOverview Error object builtin.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/error',
        'atum/builtin/object',
        'atum/builtin/builtin_function',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/error',
        'atum/builtin/meta/func',
        'atum/builtin/meta/object',
        'atum/operations/object',
        'atum/operations/error',
        'atum/operations/evaluation',
        'atum/operations/func',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/value',
        'text!atum/builtin/hosted/error.js'],
function(exports,
        compute,
        error_ref,
        object_builtin,
        builtin_function,
        meta_builtin_constructor,
        meta_error,
        meta_func,
        meta_object,
        object,
        error,
        evaluation,
        func,
        type_conversion,
        value_reference,
        value){
//"use strict";

/* Error
 ******************************************************************************/
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
    
    return object.defineProperty(
        value_reference.create(new ErrorInstance()), 
        'message', {
            'value': type_conversion.toString(msg)
        });
};

/**
 * `Error`
 */
var Error = new meta_builtin_constructor.BuiltinConstructor(
    builtin_function.FunctionPrototype,
    {},
    ErrorCall,
    ErrorConstruct);

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
var ErrorPrototype = new meta_object.Object(object_builtin.ObjectPrototype, {});

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        func.createConstructor('Error', 1,  error_ref.ErrorPrototype,  error_ref.Error.setValue(Error)),
        
        error_ref.ErrorPrototype.setValue(ErrorPrototype),
        evaluation.evaluateFile('atum/builtin/hosted/error.js'));
};

var configure = function(mutableBinding, immutableBinding) {
    return mutableBinding('Error', error_ref.Error);
};


/* Export
 ******************************************************************************/
exports.initialize = initialize;
exports.configure =configure;

exports.Error = error_ref.Error;
exports.ErrorPrototype =  error_ref.ErrorPrototype;

});