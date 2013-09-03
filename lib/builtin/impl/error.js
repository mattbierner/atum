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
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/object',
        'atum/value/string',
        'atum/value/value'],
function(exports,
        compute,
        error_ref,
        object,
        builtin_function,
        meta_error,
        meta_func,
        meta_object,
        error,
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

ErrorPrototype.prototype.properties = {
    'toString': {
        'value': error_ref.ErrorPrototypeToString
    }
};

/**
 * 
 */
var errorPrototypeToString = function(ref, thisObj, args) {
    return compute.bind(
        value_reference.getValue(compute.just(thisObj)),
        function(self) {
            if (!value.isObject(self))
                return error.typeError();
            
            return compute.bind(self.get(ref, "name"), function(name) {
                return compute.bind(
                    (value.isUndefined(name)?
                        string.create("Error") :
                        type_conversion.toString(compute.just(name))),
                    function(name) {
                        return compute.bind(self.get(ref, "message"), function(msg) {
                            return compute.bind(
                                (msg === undefined || value.isUndefined(msg) ?
                                    string.EMPTY :
                                    type_conversion.toString(compute.just(msg))),
                                function(msg) {
                                    if (name.value === "")
                                        return compute.just(msg);
                                    else if (msg.value === "")
                                        return compute.just(name);
                                    return string.concat(
                                        compute.just(name),
                                        string.concat(string.create(": "),
                                        compute.just(msg)));
                                });
                        });
                    });
            });
        });
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        error_ref.Error.setValue(new Error()),
        
        error_ref.ErrorPrototype.setValue(new ErrorPrototype()),
        builtin_function.create(error_ref.ErrorPrototypeToString, 'toString', 0, errorPrototypeToString));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.Error = error_ref.Error;
exports.ErrorPrototype =  error_ref.ErrorPrototype;

});