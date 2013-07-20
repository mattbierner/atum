/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/error',
        'atum/builtin/func',
        'atum/builtin/meta/func',
        'atum/builtin/meta/error',
        'atum/operations/string',
        'atum/operations/object',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/string',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        compute,
        value_reference,
        builtin_error,
        func,
        meta_func,
        meta_error,
        string,
        object,
        type_conversion,
        value_reference_operations,
        string_value,
        type,
        value){
//"use strict";

/* Refs
 ******************************************************************************/
var referenceErrorRef = new value_reference.ValueReference();

var referenceErrorPrototypeRef = new value_reference.ValueReference();

/* ReferenceError
 ******************************************************************************/
var ReferenceError = function() {
    meta_func.Function.call(this, this.proto, this.properties);
};
ReferenceError.prototype = new meta_func.Function;
ReferenceError.prototype.constructor = ReferenceError;

ReferenceError.prototype.proto = func.FunctionPrototype;

ReferenceError.prototype.properties = {
    'prototype': {
        'value': referenceErrorPrototypeRef,
        'writable': false,
        'configurable': false,
        'enumerable': false
    }
};

/**
 * `ReferenceError(message)`
 */
ReferenceError.prototype.call = function(ref, thisObj, args) {
    return this.construct(args);
};

/**
 * `new ReferenceError(message)`
 */
ReferenceError.prototype.construct = function(args) {
    var create = value_reference_operations.create(new ReferenceErrorPrototype());
    return (args.length ?
        object.defineProperty(create, 'message', {
            'value': type_conversion.toString(compute.just(args[0]))
        }) : 
        create);
};


/* ReferenceErrorPrototype
 ******************************************************************************/
/**
 * `ReferenceError.prototype`
 */
var ReferenceErrorPrototype = function() {
    meta_error.Error.call(this, this.proto, this.properties);
};
ReferenceErrorPrototype.prototype = new meta_error.Error();
ReferenceErrorPrototype.prototype.constructor = ReferenceErrorPrototype;

ReferenceErrorPrototype.prototype.proto = builtin_error.ErrorPrototype;

ReferenceErrorPrototype.prototype.properties = {
    'constructor': {
        'value': referenceErrorRef
    },
    'name': {
        'value': new string_value.String('ReferenceError')
    },
    'message': {
        'value': string_value.EMPTY
    }
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        referenceErrorRef.setValue(new ReferenceError()),
        
        referenceErrorPrototypeRef.setValue(new ReferenceErrorPrototype()));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.ReferenceError = referenceErrorRef;
exports.ReferenceErrorPrototype = referenceErrorPrototypeRef;

});