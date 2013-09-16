/**
 * @fileOverview Builtin `RegExp` object.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/regexp',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/func',
        'atum/builtin/meta/object',
        'atum/builtin/meta/regexp',
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
        builtin_func,
        builtin_object,
        regexp_ref,
        meta_builtin_constructor,
        meta_func,
        meta_object,
        meta_regexp,
        error,
        func,
        string,
        type_conversion,
        value_reference,
        boolean,
        number,
        value){
//"use strict";

/* RegExp
 ******************************************************************************/
/**
 * Hosted `RegExp` constructor.
 */
var RegExp = function() {
    meta_builtin_constructor.BuiltinConstructor.call(
        this,
        this.proto,
        this.properties,
        this.call,
        this.construct);
};
RegExp.prototype = new meta_builtin_constructor.BuiltinConstructor;
RegExp.prototype.constructor = RegExp;

RegExp.prototype.proto = builtin_func.FunctionPrototype;

RegExp.prototype.properties = {
    'length': {
        'value': new number.Number(1),
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'prototype': {
        'value': regexp_ref.RegExpPrototype,
        'writable': false,
        'enumerable': false,
        'configurable': false
    }
};

/**
 * `RegExp([value])`
 */
RegExp.prototype.call = function(ref, thisObj, args) {
    return (args.length ?
        type_conversion.toRegExp(args.getArg(0)) :
        compute.just(boolean.FALSE));
};

/**
 * `new RegExp([value])`
 */
RegExp.prototype.construct = function(ref, args) {
    return compute.bind(this.call(null, null, args), function(num) {
        return value_reference.create(new RegExpInstance(num));
    });
};

/* RegExpInstance
 ******************************************************************************/
var RegExpInstance = function(primitiveValue) {
    meta_regexp.RegExp.call(this, this.proto, this.properties, primitiveValue);
};
RegExpInstance.prototype = new meta_regexp.RegExp;
RegExpInstance.prototype.constructor = RegExpPrototype; 

RegExpInstance.prototype.proto = regexp_ref.RegExpPrototype;

RegExpInstance.prototype.properties = {};

/* RegExpPrototype
 ******************************************************************************/
var RegExpPrototype = function() {
    meta_object.Object.call(this, this.proto, this.properties);
};
RegExpPrototype.prototype = new meta_object.Object;
RegExpPrototype.prototype.constructor = RegExpPrototype; 

RegExpPrototype.prototype.proto = builtin_object.ObjectPrototype;

RegExpPrototype.prototype.properties = {
    'toString': {
        'value': regexp_ref.RegExpPrototypeToString
    },
    'valueOf': {
        'value': regexp_ref.RegExpPrototypeValueOf
    },
    'constructor': {
        'value': regexp_ref.RegExp
    }
};

/**
 * `RegExp.prototype.toString([radix])`
 */
var numberPrototypeToString = function(ref, thisObj, args) {
    if (!args.length)
        return numberPrototypeToString(ref, thisObj, [new number.RegExp(10)]);
    
    return compute.binary(
        value_reference.getValue(compute.just(thisObj)),
        type_conversion.toInteger(args.getArg(0)),
        function(t, radix) {
            if (radix < 2 || radix > 36)
                return error.rangeError();
            
            if (t instanceof RegExpInstance)
                return string.create(t.primitiveValue.value.toString(radix.value));
            else if (value.isRegExp(t))
                return string.create(t.value.toString(radix.value));
            return error.typeError();
        });
};

/**
 * `RegExp.prototype.valueOf()`
 */
var numberPrototypeValueOf = function(ref, thisObj, args) {
    return compute.bind(
        value_reference.getValue(compute.just(thisObj)),
        function(t) {
            if (t instanceof meta_boolean.RegExp)
                return t.defaultValue();
            else if (value.isRegExp(t))
                return compute.just(t);
            return error.typeError();
        });
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function');
    return compute.sequence(
        func.createConstructor('RegExp', 1, regexp_ref.RegExpPrototype, regexp_ref.RegExp.setValue(new RegExp())),

        regexp_ref.RegExpPrototype.setValue(new RegExpPrototype()),
        builtin_function.create(regexp_ref.RegExpPrototypeToString, 'toString', 0, numberPrototypeToString));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.RegExp = regexp_ref.RegExp;
exports.RegExpPrototype = regexp_ref.RegExpPrototype;

});