/**
 * @fileOverview Hosted native error objects.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/error',
        'atum/builtin/func',
        'atum/builtin/meta/func',
        'atum/builtin/meta/error',
        'atum/builtin/native_errors',
        'atum/operations/object',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/string',
        'atum/value/value'],
function(exports,
        compute,
        error_builtin,
        func_builtin,
        meta_func,
        meta_error,
        native_error_refs,
        object,
        type_conversion,
        value_reference_operations,
        string_value,
        value){
"use strict";

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
    return this.construct(ref, args);
};

/**
 * `new ReferenceError(message)`
 */
NativeError.prototype.construct = function(ref, args) {
    var create = value_reference_operations.create(new this.ctor());
    return (args.length ?
        compute.bind(type_conversion.toString(args.getArg(0)), function(msg) {
            return object.defineProperty(create, 'message', {
                'value': msg
            });
        }) :
        create);
};

var defineNativeError = function(ctor, proto) {
    var Error = function() {
        NativeError.call(this, ctor);
    };
    Error.prototype = new NativeError;
    Error.prototype.constructor = Error;
    
    Error.prototype.proto = func_builtin.FunctionPrototype;
    
    Error.prototype.properties = {
        'prototype': {
            'value': proto,
            'writable': false,
            'configurable': false,
            'enumerable': false
        }
    };
    return Error;
};

var defineNativeErrorPrototype = function(name, ctor) {
    var ErrorPrototype = function() {
        meta_error.Error.call(this, this.proto, this.properties);
    };
    ErrorPrototype.prototype = new meta_error.Error;
    ErrorPrototype.prototype.constructor = ErrorPrototype;
    
    ErrorPrototype.prototype.proto = error_builtin.ErrorPrototype;
    
    ErrorPrototype.prototype.properties = {
        'constructor': {
            'value': ctor
        },
        'name': {
            'value': new string_value.String(name)
        },
        'message': {
            'value': string_value.EMPTY
        }
    };
    return ErrorPrototype;
};


/* Errors
 ******************************************************************************/
/**
 * `EvalError.prototype`
 */
var EvalErrorPrototype = defineNativeErrorPrototype('EvalError', native_error_refs.EvalError);

/**
 * `EvalError`
 */
var EvalError = defineNativeError(EvalErrorPrototype, native_error_refs.EvalErrorPrototype);

/**
 * `EvalError.prototype`
 */
var RangeErrorPrototype = defineNativeErrorPrototype('RangeError', native_error_refs.RangeError);


/**
 * `RangeError`
 */
var RangeError = defineNativeError(RangeErrorPrototype, native_error_refs.RangeErrorPrototype);

/**
 * `EvalError.prototype`
 */
var ReferenceErrorPrototype = defineNativeErrorPrototype('ReferenceError', native_error_refs.ReferenceError);

/**
 * `ReferenceError`
 */
var ReferenceError = defineNativeError(ReferenceErrorPrototype, native_error_refs.ReferenceErrorPrototype);

/**
 * `SyntaxError.prototype`
 */
var SyntaxErrorPrototype = defineNativeErrorPrototype('SyntaxError', native_error_refs.SyntaxError);

/**
 * `SyntaxError`
 */
var SyntaxError = defineNativeError(SyntaxErrorPrototype, native_error_refs.SyntaxErrorPrototype);

/**
 * `TypeError.prototype`
 */
var TypeErrorPrototype = defineNativeErrorPrototype('TypeError', native_error_refs.TypeError);

/**
 * `TypeError`
 */
var TypeError = defineNativeError(TypeErrorPrototype, native_error_refs.TypeErrorPrototype);

/**
 * `UriError.prototype`
 */
var UriErrorPrototype = defineNativeErrorPrototype('UriError', native_error_refs.UriError);

/**
 * `UriError`
 */
var UriError = defineNativeError(UriErrorPrototype, native_error_refs.UriErrorPrototype);

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        native_error_refs.EvalError.setValue(new EvalError()),
        native_error_refs.EvalErrorPrototype.setValue(new EvalErrorPrototype()),
        
        native_error_refs.RangeError.setValue(new RangeError()),
        native_error_refs.RangeErrorPrototype.setValue(new RangeErrorPrototype()),
            
        native_error_refs.ReferenceError.setValue(new ReferenceError()),
        native_error_refs.ReferenceErrorPrototype.setValue(new ReferenceErrorPrototype()),
        
        native_error_refs.SyntaxError.setValue(new SyntaxError()),
        native_error_refs.SyntaxErrorPrototype.setValue(new SyntaxErrorPrototype()),
        
        native_error_refs.TypeError.setValue(new TypeError()),
        native_error_refs.TypeErrorPrototype.setValue(new TypeErrorPrototype()),
        
        native_error_refs.UriError.setValue(new UriError()),
        native_error_refs.UriErrorPrototype.setValue(new UriErrorPrototype()));
};

var configure = function(mutableBinding, immutableBinding) {
    return compute.sequence(
        mutableBinding('EvalError', native_error_refs.EvalError),
        mutableBinding('RangeError', native_error_refs.RangeError),
        mutableBinding('ReferenceError', native_error_refs.ReferenceError),
        mutableBinding('SyntaxError', native_error_refs.SyntaxError),
        mutableBinding('TypeError', native_error_refs.TypeError),
        mutableBinding('UriError', native_error_refs.UriError));
};


/* Export
 ******************************************************************************/
exports.initialize = initialize;
exports.configure = configure;

});