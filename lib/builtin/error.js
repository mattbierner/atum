/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/object',
        'atum/builtin/builtin_function',
        'atum/builtin/meta/error',
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
        meta_error,
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
var errorRef = new value_reference.ValueReference();

var errorPrototypeRef = new value_reference.ValueReference();
var toStringRef = new value_reference.ValueReference();

/* ErrorPrototype
 ******************************************************************************/
var ErrorPrototype = function(message) {
    meta_error.ErrorPrototype.call(this, this.proto, this.properties);
    this.properties.toString = {'value': toStringRef };
    this.properties.message = {'value': message };

};
ErrorPrototype.prototype = new meta_error.ErrorPrototype;
ErrorPrototype.prototype.constructor = ErrorPrototype;

ErrorPrototype.prototype.proto = object.objectPrototypeRef;
ErrorPrototype.prototype.cls = "Error";

ErrorPrototype.prototype.properties = {
    'toString': {
        'value': toStringRef
    },
    
    'name': {'value': new string_value.String('dfasf')}
};

/**
 * 
 */
var errorPrototypeToString = function(ref, thisObj, args) {
    return compute.bind(thisObj.getValue(), function(self) {
        if (!value.type(self) === type.OBJECT_TYPE)
            return compute.error('');
        
        return compute.bind(self.get(ref, "name"), function(name) {
            return compute.bind(
                (name.type === type.UNDEFINED_TYPE ?
                    string.create("Error") :
                    type_conversion.toString(compute.just(name))),
                function(name) {
                    return compute.bind(self.get(ref, "message"), function(msg) {
                        return compute.bind(
                            (msg === undefined || msg.type === type.UNDEFINED_TYPE ?
                                string.create("") :
                                type_conversion.toString(compute.just(msg))),
                            function(msg) {
                                debugger;
                                if (name.value === "")
                                    return compute.just(msg);
                                else if (msg.value === "")
                                    return compute.just(name);
                                return string.concat(compute.just(name), string.concat(string.create(": "), compute.just(msg)));
                            });
                    });
                });
        });
    });
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
        
        errorPrototypeRef.setValue(new ErrorPrototype()),
        toStringRef.setValue(builtin_function.create('toString', 0, errorPrototypeToString)));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.errorRef = errorRef;

exports.Error = Error;
exports.ErrorPrototype =  ErrorPrototype;

});