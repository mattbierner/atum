/**
 * @fileOverview Builtin `String` object.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/string',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/func',
        'atum/builtin/meta/string',
        'atum/builtin/meta/object',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/string',
        'atum/value/value'],
function(exports,
        compute,
        string_ref,
        builtin_func,
        builtin_object,
        meta_builtin_constructor,
        meta_func,
        meta_string,
        meta_object,
        error,
        func,
        string_op,
        type_conversion,
        value_reference,
        number,
        string,
        value){
//"use strict";

/* String
 ******************************************************************************/
/**
 * Hosted `String` constructor.
 */
var String = function() {
    meta_builtin_constructor.BuiltinConstructor.call(
        this,
        this.proto,
        this.properties,
        this.call,
        this.construct);
};
String.prototype = new meta_builtin_constructor.BuiltinConstructor;
String.prototype.constructor = String;

String.prototype.proto = builtin_func.FunctionPrototype;

String.prototype.properties = {
    'length': {
        'value': new number.Number(1),
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'prototype': {
        'value': string_ref.StringPrototype,
        'writable': false,
        'enumerable': false,
        'configurable': false
    }
};

/**
 * `String([value])`
 */
String.prototype.call = function(ref, thisObj, args) {
    return (args.length ?
        type_conversion.toString(args.getArg(0)) :
        compute.just(number.ZERO));
};

/**
 * `new String([value])`
 */
String.prototype.construct = function(ref, args) {
    return compute.bind(this.call(null, null, args), function(num) {
        return value_reference.create(new StringInstance(num));
    });
};

/* StringInstance
 ******************************************************************************/
var StringInstance = function(primitiveValue) {
    meta_string.String.call(this, this.proto, this.properties, primitiveValue);
};
StringInstance.prototype = new meta_string.String;
StringInstance.prototype.constructor = StringPrototype; 

StringInstance.prototype.proto = string_ref.StringPrototype;

StringInstance.prototype.properties = {};

/* StringPrototype
 ******************************************************************************/
var StringPrototype = function() {
    meta_object.Object.call(this, this.proto, this.properties);
};
StringPrototype.prototype = new meta_object.Object;
StringPrototype.prototype.constructor = StringPrototype; 

StringPrototype.prototype.proto = builtin_object.ObjectPrototype;

StringPrototype.prototype.properties = {
    'toString': {
        'value': string_ref.StringPrototypeToString
    },
    'valueOf': {
        'value': string_ref.StringPrototypeValueOf
    },
    'constructor': {
        'value': string_ref.String
    }
};

/**
 * `String.prototype.toString([radix])`
 */
var numberPrototypeToString = function(ref, thisObj, args) {
    if (!args.length)
        return numberPrototypeToString(ref, thisObj, [new number.String(10)]);
    
    return compute.binary(
        value_reference.getValue(compute.just(thisObj)),
        type_conversion.toInteger(args.getArg(0)),
        function(t, radix) {
            if (radix < 2 || radix > 36)
                return error.rangeError();
            
            if (t instanceof StringInstance)
                return string_op.create(t.primitiveValue.value.toString(radix.value));
            else if (value.isString(t))
                return string_op.create(t.value.toString(radix.value));
            return error.typeError();
        });
};

/**
 * `String.prototype.valueOf()`
 */
var numberPrototypeValueOf = function(ref, thisObj, args) {
    return compute.bind(
        value_reference.getValue(compute.just(thisObj)),
        function(t) {
            if (t instanceof meta_string.String)
                return t.defaultValue();
            else if (value.isString(t))
                return compute.just(t);
            return error.typeError();
        });
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function');
    return compute.sequence(
        func.createConstructor('String', 1, string_ref.StringPrototype, string_ref.String.setValue(new String())),

        string_ref.StringPrototype.setValue(new StringPrototype()),
        builtin_function.create(string_ref.StringPrototypeToString, 'toString', 0, numberPrototypeToString),
        builtin_function.create(string_ref.StringPrototypeValueOf, 'valueOf', 0, numberPrototypeValueOf));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.String = string_ref.String;
exports.StringPrototype = string_ref.StringPrototype;

});