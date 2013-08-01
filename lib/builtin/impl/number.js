/**
 * @fileOverview The builtin Number object.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/number',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/func',
        'atum/builtin/meta/number',
        'atum/operations/error',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/object',
        'atum/value/value'],
function(exports,
        compute,
        value_reference,
        number_ref,
        builtin_func,
        builtin_object,
        meta_func,
        meta_number,
        error,
        string,
        type_conversion,
        value_reference_operations,
        number,
        object,
        value){
//"use strict";

/* Number
 ******************************************************************************/
/**
 * Hosted `Number` constructor.
 */
var Number = function() {
    meta_func.Function.call(this, this.proto, this.properties);
};
Number.prototype = new meta_func.Function;
Number.prototype.constructor = Number;

Number.prototype.proto = builtin_func.FunctionPrototype;

Number.prototype.properties = {
    'length': {
        'value': new number.Number(1),
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'MAX_VALUE': {
        'value': number.MAX_VALUE,
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'MIN_VALUE': {
        'value': number.MIN_VALUE,
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'NaN': {
        'value': number.NaN,
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'NEGATIVE_INFINITY': {
        'value': number.NEGATIVE_INFINITY,
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'POSITIVE_INFINITY': {
        'value': number.POSITIVE_INFINITY,
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'prototype': {
        'value': number_ref.NumberPrototype,
        'writable': false,
        'enumerable': false,
        'configurable': false
    }
};

/**
 * 
 */
Number.prototype.call = function(ref, thisObj, args) {
    return (args.length ?
        type_conversion.toNumber(compute.just(args.getArg(0))) :
        compute.just(number.ZERO));
};

/**
 * Builtin Number constructor.
 */
Number.prototype.construct = function(args) {
    return compute.bind(this.call(null, null, args), function(num) {
        return value_reference_operations.create(new NumberPrototype(num));
    });
};

/* NumberPrototype
 ******************************************************************************/
var NumberPrototype = function(primitiveValue) {
    meta_number.Number.call(this, this.proto, this.properties, primitiveValue);
};
NumberPrototype.prototype = new meta_number.Number;
NumberPrototype.prototype.constructor = NumberPrototype; 

NumberPrototype.prototype.proto = builtin_object.ObjectPrototype;

NumberPrototype.prototype.properties = {
    'toString': {
        'value': number_ref.NumberPrototypeToString
    },
    'valueOf': {
        'value': number_ref.NumberPrototypeValueOf
    },
    'constructor': {
        'value': number_ref.Number
    }
};

/**
 * `Number.prototype.toString`
 */
var numberPrototypeToString = function(ref, thisObj, args) {
    if (!args.length)
        return numberPrototypeToString(ref, thisObj, [new number.Number(10)]);
    return compute.bind(
        value_reference_operations.getValue(compute.just(thisObj)),
        function(t) {
            return compute.bind(type_conversion.toInteger(compute.just(args.getArg(0))), function(radix) {
                if (t instanceof NumberPrototype)
                    return string.create(t.primitiveValue.value.toString(radix.value));
                else if (value.isNumber(t))
                    return string.create(t.value.toString(radix.value));
                return error.typeError();
            });
        });
};

/**
 * `Number.prototype.valueOf`
 */
var numberPrototypeValueOf = function(ref, thisObj, args) {
    return compute.bind(
        value_reference_operations.getValue(compute.just(thisObj)),
        function(t) {
            if (t instanceof meta_number.Number)
                return t.defaultValue();
            else if (value.isNumber(t))
                return compute.just(t);
            return error.typeError();
        });
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function');
    return compute.sequence(
        number_ref.Number.setValue(new Number()),
        number_ref.NumberPrototype.setValue(new NumberPrototype()),
        number_ref.NumberPrototypeToString.setValue(builtin_function.create('toString', 0, numberPrototypeToString)),
        number_ref.NumberPrototypeValueOf.setValue(builtin_function.create('valueOf', 0, numberPrototypeValueOf)));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.Number = number_ref.Number;
exports.NumberPrototype = number_ref.NumberPrototype;

});