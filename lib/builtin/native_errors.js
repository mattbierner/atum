/**
 * @fileOverview Hosted native error objects.
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
var evalErrorRef = new value_reference.ValueReference();
var evalErrorPrototypeRef = new value_reference.ValueReference();

var rangeErrorRef = new value_reference.ValueReference();
var rangeErrorPrototypeRef = new value_reference.ValueReference();

var referenceErrorRef = new value_reference.ValueReference();
var referenceErrorPrototypeRef = new value_reference.ValueReference();

var syntaxErrorRef = new value_reference.ValueReference();
var syntaxErrorPrototypeRef = new value_reference.ValueReference();

var typeErrorRef = new value_reference.ValueReference();
var typeErrorPrototypeRef = new value_reference.ValueReference();

var uriErrorRef = new value_reference.ValueReference();
var uriErrorPrototypeRef = new value_reference.ValueReference();

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
            'value': type_conversion.toString(compute.just(args.getArg(0)))
        }) : 
        create);
};


/* EvalError
 ******************************************************************************/
var EvalError = function() {
    NativeError.call(this, EvalErrorPrototype);
};
EvalError.prototype = new NativeError;
EvalError.prototype.constructor = ReferenceError;

EvalError.prototype.proto = func.FunctionPrototype;

EvalError.prototype.properties = {
    'prototype': {
        'value': evalErrorPrototypeRef,
        'writable': false,
        'configurable': false,
        'enumerable': false
    }
};

/* EvalErrorPrototype
 ******************************************************************************/
/**
 * `EvalError.prototype`
 */
var EvalErrorPrototype = function() {
    meta_error.Error.call(this, this.proto, this.properties);
};
EvalErrorPrototype.prototype = new meta_error.Error;
EvalErrorPrototype.prototype.constructor = EvalErrorPrototype;

EvalErrorPrototype.prototype.proto = builtin_error.ErrorPrototype;

EvalErrorPrototype.prototype.properties = {
    'constructor': {
        'value': evalErrorRef
    },
    'name': {
        'value': new string_value.String('EvalError')
    },
    'message': {
        'value': string_value.EMPTY
    }
};

/* RangeError
 ******************************************************************************/
var RangeError = function() {
    NativeError.call(this, RangeErrorPrototype);
};
RangeError.prototype = new NativeError;
RangeError.prototype.constructor = ReferenceError;

RangeError.prototype.proto = func.FunctionPrototype;

RangeError.prototype.properties = {
    'prototype': {
        'value': rangeErrorPrototypeRef,
        'writable': false,
        'configurable': false,
        'enumerable': false
    }
};

/* RangeErrorPrototype
 ******************************************************************************/
/**
 * `RangeError.prototype`
 */
var RangeErrorPrototype = function() {
    meta_error.Error.call(this, this.proto, this.properties);
};
RangeErrorPrototype.prototype = new meta_error.Error;
RangeErrorPrototype.prototype.constructor = RangeErrorPrototype;

RangeErrorPrototype.prototype.proto = builtin_error.ErrorPrototype;

RangeErrorPrototype.prototype.properties = {
    'constructor': {
        'value': rangeErrorRef
    },
    'name': {
        'value': new string_value.String('RangeError')
    },
    'message': {
        'value': string_value.EMPTY
    }
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
ReferenceErrorPrototype.prototype = new meta_error.Error;
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

/* SyntaxError
 ******************************************************************************/
var SyntaxError = function() {
    NativeError.call(this, SyntaxErrorPrototype);
};
SyntaxError.prototype = new NativeError;
SyntaxError.prototype.constructor = ReferenceError;

SyntaxError.prototype.proto = func.FunctionPrototype;

SyntaxError.prototype.properties = {
    'prototype': {
        'value': syntaxErrorPrototypeRef,
        'writable': false,
        'configurable': false,
        'enumerable': false
    }
};

/* SyntaxErrorPrototype
 ******************************************************************************/
/**
 * `SyntaxError.prototype`
 */
var SyntaxErrorPrototype = function() {
    meta_error.Error.call(this, this.proto, this.properties);
};
SyntaxErrorPrototype.prototype = new meta_error.Error;
SyntaxErrorPrototype.prototype.constructor = SyntaxErrorPrototype;

SyntaxErrorPrototype.prototype.proto = builtin_error.ErrorPrototype;

ReferenceErrorPrototype.prototype.properties = {
    'constructor': {
        'value': syntaxErrorRef
    },
    'name': {
        'value': new string_value.String('SyntaxError')
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
TypeErrorPrototype.prototype = new meta_error.Error;
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

/* UriError
 ******************************************************************************/
var UriError = function() {
    NativeError.call(this, UriErrorPrototype);
};
UriError.prototype = new NativeError;
UriError.prototype.constructor = ReferenceError;

UriError.prototype.proto = func.FunctionPrototype;

UriError.prototype.properties = {
    'prototype': {
        'value': uriErrorPrototypeRef,
        'writable': false,
        'configurable': false,
        'enumerable': false
    }
};

/* UriErrorPrototype
 ******************************************************************************/
/**
 * `UriError.prototype`
 */
var UriErrorPrototype = function() {
    meta_error.Error.call(this, this.proto, this.properties);
};
UriErrorPrototype.prototype = new meta_error.Error;
UriErrorPrototype.prototype.constructor = UriErrorPrototype;

UriErrorPrototype.prototype.proto = builtin_error.ErrorPrototype;

ReferenceErrorPrototype.prototype.properties = {
    'constructor': {
        'value': uriErrorRef
    },
    'name': {
        'value': new string_value.String('UriError')
    },
    'message': {
        'value': string_value.EMPTY
    }
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        evalErrorRef.setValue(new EvalError()),
        evalErrorPrototypeRef.setValue(new EvalErrorPrototype()),
        
        rangeErrorRef.setValue(new RangeError()),
        rangeErrorPrototypeRef.setValue(new RangeErrorPrototype()),
            
        referenceErrorRef.setValue(new ReferenceError()),
        referenceErrorPrototypeRef.setValue(new ReferenceErrorPrototype()),
        
        syntaxErrorRef.setValue(new SyntaxError()),
        syntaxErrorPrototypeRef.setValue(new SyntaxErrorPrototype()),
        
        typeErrorRef.setValue(new TypeError()),
        typeErrorPrototypeRef.setValue(new TypeErrorPrototype()),
        
        uriErrorRef.setValue(new UriError()),
        uriErrorPrototypeRef.setValue(new UriErrorPrototype()));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.EvalError = evalErrorRef;
exports.EvalErrorPrototype = evalErrorPrototypeRef;

exports.RangeError = rangeErrorRef;
exports.RangeErrorPrototype = rangeErrorPrototypeRef;

exports.ReferenceError = referenceErrorRef;
exports.ReferenceErrorPrototype = referenceErrorPrototypeRef;

exports.SyntaxError = syntaxErrorRef;
exports.SyntaxErrorPrototype = syntaxErrorPrototypeRef;

exports.TypeError = typeErrorRef;
exports.TypeErrorPrototype = typeErrorPrototypeRef;

exports.UriError = uriErrorRef;
exports.UriErrorPrototype = uriErrorPrototypeRef;

});