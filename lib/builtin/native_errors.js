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

var typeErrorRef = new value_reference.ValueReference();
var typeErrorPrototypeRef = new value_reference.ValueReference();

/* NativeError
 ******************************************************************************/
var NativeError = function(ctor) {
    meta_func.Function.call(this, this.proto, this.properties);
    this.ctor = ctor;
};
NativeError.prototype = new meta_func.Function;
NativeError.prototype.constructor = NativeError;

/**
 * `ReferenceError(message)`
 */
NativeError.prototype.call = function(ref, thisObj, args) {
    return this.construct(args);
};

/**
 * `new ReferenceError(message)`
 */
NativeError.prototype.construct = function(args) {
    var create = value_reference_operations.create(new this.ctor());
    return (args.length ?
        object.defineProperty(create, 'message', {
            'value': type_conversion.toString(compute.just(args[0]))
        }) : 
        create);
};

/* ReferenceError
 ******************************************************************************/
var ReferenceError = function() {
    NativeError.call(this, ReferenceErrorPrototype);
};
ReferenceError.prototype = new NativeError;
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

/* TypeError
 ******************************************************************************/
var TypeError = function() {
    NativeError.call(this, TypeErrorPrototype);
};
TypeError.prototype = new NativeError;
TypeError.prototype.constructor = TypeError;

ReferenceError.prototype.proto = func.FunctionPrototype;

TypeError.prototype.properties = {
    'prototype': {
        'value': typeErrorPrototypeRef,
        'writable': false,
        'configurable': false,
        'enumerable': false
    }
};

/* TypeErrorPrototype
 ******************************************************************************/
/**
 * `TypeError.prototype`
 */
var TypeErrorPrototype = function() {
    meta_error.Error.call(this, this.proto, this.properties);
};
TypeErrorPrototype.prototype = new meta_error.Error();
TypeErrorPrototype.prototype.constructor = TypeErrorPrototype;

TypeErrorPrototype.prototype.proto = builtin_error.ErrorPrototype;

TypeErrorPrototype.prototype.properties = {
    'constructor': {
        'value': typeErrorRef
    },
    'name': {
        'value': new string_value.String('TypeError')
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
        referenceErrorPrototypeRef.setValue(new ReferenceErrorPrototype()),
        
        typeErrorRef.setValue(new TypeError()),
        typeErrorPrototypeRef.setValue(new TypeErrorPrototype()));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.ReferenceError = referenceErrorRef;
exports.ReferenceErrorPrototype = referenceErrorPrototypeRef;

exports.TypeError = typeErrorRef;
exports.TypeErrorPrototype = typeErrorPrototypeRef;

});