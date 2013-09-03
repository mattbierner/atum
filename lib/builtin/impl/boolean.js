/**
 * @fileOverview Builtin `Boolean` object.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/boolean',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/func',
        'atum/builtin/meta/boolean',
        'atum/builtin/meta/object',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/boolean',
        'atum/value/number',
        'atum/value/value'],
function(exports,
        compute,
        boolean_ref,
        builtin_func,
        builtin_object,
        meta_builtin_constructor,
        meta_func,
        meta_boolean,
        meta_object,
        error,
        func,
        string,
        type_conversion,
        value_reference,
        boolean,
        number,
        value){
//"use strict";

/* Boolean
 ******************************************************************************/
/**
 * Hosted `Boolean` constructor.
 */
var Boolean = function() {
    meta_builtin_constructor.BuiltinConstructor.call(
        this,
        this.proto,
        this.properties,
        this.call,
        this.construct);
};
Boolean.prototype = new meta_builtin_constructor.BuiltinConstructor;
Boolean.prototype.constructor = Boolean;

Boolean.prototype.proto = builtin_func.FunctionPrototype;

Boolean.prototype.properties = {
    'length': {
        'value': new number.Number(1),
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'prototype': {
        'value': boolean_ref.BooleanPrototype,
        'writable': false,
        'enumerable': false,
        'configurable': false
    }
};

/**
 * `Boolean([value])`
 */
Boolean.prototype.call = function(ref, thisObj, args) {
    return (args.length ?
        type_conversion.toBoolean(args.getArg(0)) :
        compute.just(boolean.FALSE));
};

/**
 * `new Boolean([value])`
 */
Boolean.prototype.construct = function(ref, args) {
    return compute.bind(this.call(null, null, args), function(num) {
        return value_reference.create(new BooleanInstance(num));
    });
};

/* BooleanInstance
 ******************************************************************************/
var BooleanInstance = function(primitiveValue) {
    meta_boolean.Boolean.call(this, this.proto, this.properties, primitiveValue);
};
BooleanInstance.prototype = new meta_boolean.Boolean;
BooleanInstance.prototype.constructor = BooleanPrototype; 

BooleanInstance.prototype.proto = boolean_ref.BooleanPrototype;

BooleanInstance.prototype.properties = {};

/* BooleanPrototype
 ******************************************************************************/
var BooleanPrototype = function() {
    meta_object.Object.call(this, this.proto, this.properties);
};
BooleanPrototype.prototype = new meta_object.Object;
BooleanPrototype.prototype.constructor = BooleanPrototype; 

BooleanPrototype.prototype.proto = builtin_object.ObjectPrototype;

BooleanPrototype.prototype.properties = {
    'toString': {
        'value': boolean_ref.BooleanPrototypeToString
    },
    'valueOf': {
        'value': boolean_ref.BooleanPrototypeValueOf
    },
    'constructor': {
        'value': boolean_ref.Boolean
    }
};

/**
 * `Boolean.prototype.toString([radix])`
 */
var numberPrototypeToString = function(ref, thisObj, args) {
    if (!args.length)
        return numberPrototypeToString(ref, thisObj, [new number.Boolean(10)]);
    
    return compute.binary(
        value_reference.getValue(compute.just(thisObj)),
        type_conversion.toInteger(args.getArg(0)),
        function(t, radix) {
            if (radix < 2 || radix > 36)
                return error.rangeError();
            
            if (t instanceof BooleanInstance)
                return string.create(t.primitiveValue.value.toString(radix.value));
            else if (value.isBoolean(t))
                return string.create(t.value.toString(radix.value));
            return error.typeError();
        });
};

/**
 * `Boolean.prototype.valueOf()`
 */
var numberPrototypeValueOf = function(ref, thisObj, args) {
    return compute.bind(
        value_reference.getValue(compute.just(thisObj)),
        function(t) {
            if (t instanceof meta_boolean.Boolean)
                return t.defaultValue();
            else if (value.isBoolean(t))
                return compute.just(t);
            return error.typeError();
        });
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function');
    return compute.sequence(
        func.createConstructor('Boolean', 1, boolean_ref.BooleanPrototype, boolean_ref.Boolean.setValue(new Boolean())),

        boolean_ref.BooleanPrototype.setValue(new BooleanPrototype()),
        builtin_function.create(boolean_ref.BooleanPrototypeToString, 'toString', 0, numberPrototypeToString),
        builtin_function.create(boolean_ref.BooleanPrototypeValueOf, 'valueOf', 0, numberPrototypeValueOf));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.Boolean = boolean_ref.Boolean;
exports.BooleanPrototype = boolean_ref.BooleanPrototype;

});