/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/error',
        'atum/builtin/object',
        'atum/builtin/builtin_function',
        'atum/builtin/meta/error',
        'atum/builtin/meta/func',
        'atum/operations/error',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/object',
        'atum/value/string',
        'atum/value/value'],
function(exports,
        compute,
        value_reference,
        error_ref,
        object,
        builtin_function,
        meta_error,
        meta_func,
        error,
        string,
        type_conversion,
        value_reference_operations,
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
    return this.construct(args);
};

Error.prototype.construct = function(args) {
    return value_reference_operations.create(
        new ErrorPrototype(args.getArg(0)));
};


/* ErrorPrototype
 ******************************************************************************/
var ErrorPrototype = function() {
    meta_error.Error.call(this, this.proto, this.properties);

};
ErrorPrototype.prototype = new meta_error.Error;
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
        value_reference.getValue(thisObj),
        function(self) {
            if (!value.isObject(self))
                return error.typeError();
            
            return compute.bind(self.get(ref, "name"), function(name) {
                return compute.bind(
                    (name.type === type.UNDEFINED_TYPE ?
                        string.create("Error") :
                        type_conversion.toString(compute.just(name))),
                    function(name) {
                        return compute.bind(self.get(ref, "message"), function(msg) {
                            return compute.bind(
                                (msg === undefined || value.isUndefined(msg) ?
                                    string.empty :
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
    return compute.enumeration(
        error_ref.Error.setValue(new Error()),
        
        error_ref.ErrorPrototype.setValue(new ErrorPrototype()),
        error_ref.ErrorPrototypeToString.setValue(builtin_function.create('toString', 0, errorPrototypeToString)));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.Error = error_ref.Error;
exports.ErrorPrototype =  error_ref.ErrorPrototype;

});