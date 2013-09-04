/**
 * @fileOverview Builtin Number object.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/number',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/func',
        'atum/builtin/meta/number',
        'atum/builtin/meta/object',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/number',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/value'],
function(exports,
        compute,
        number_ref,
        builtin_func,
        builtin_object,
        meta_builtin_constructor,
        meta_func,
        meta_number,
        meta_object,
        error,
        func,
        number_operations,
        string,
        type_conversion,
        value_reference,
        number,
        value){
//"use strict";

/* Number
 ******************************************************************************/
/**
 * Hosted `Number` constructor.
 */
var Number = function() {
    meta_builtin_constructor.BuiltinConstructor.call(
        this,
        this.proto,
        this.properties,
        this.call,
        this.construct);
};
Number.prototype = new meta_builtin_constructor.BuiltinConstructor;
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
    }
};

/**
 * `Number([value])`
 */
Number.prototype.call = function(ref, thisObj, args) {
    return (args.length ?
        type_conversion.toNumber(args.getArg(0)) :
        compute.just(number.ZERO));
};

/**
 * `new Number([value])`
 */
Number.prototype.construct = function(ref, args) {
    return compute.bind(this.call(null, null, args), function(num) {
        return value_reference.create(new NumberInstance(num));
    });
};

/* NumberInstance
 ******************************************************************************/
var NumberInstance = function(primitiveValue) {
    meta_number.Number.call(this, this.proto, this.properties, primitiveValue);
};
NumberInstance.prototype = new meta_number.Number;
NumberInstance.prototype.constructor = NumberPrototype; 

NumberInstance.prototype.proto = number_ref.NumberPrototype;

NumberInstance.prototype.properties = {};

/* NumberPrototype
 ******************************************************************************/
var NumberPrototype = function() {
    meta_object.Object.call(this, this.proto, this.properties);
};
NumberPrototype.prototype = new meta_object.Object;
NumberPrototype.prototype.constructor = NumberPrototype; 

NumberPrototype.prototype.proto = builtin_object.ObjectPrototype;

NumberPrototype.prototype.properties = {
    'toExponential': {
        'value': number_ref.NumberPrototypeToExponential
    },
    'toFixed': {
        'value': number_ref.NumberPrototypeToFixed
    },
    'toPrecision': {
        'value': number_ref.NumberPrototypeToPrecision
    },
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

var numberPrototypeToExponential = function(ref, thisObj, args) {};

/**
 * `Number.prototype.toFixed([fractionDigits])`
 */
var numberPrototypeToFixed = function(ref, thisObj, args) {
    var fractionDigits = args.getArg(0);
    if (value.isUndefined(args))
        return func.call(comute.just(ref), compute.just(thisObj), compute.enumeration(number.create(0)));
    
    return compute.binary(
        value_reference.getValue(compute.just(thisObj)),
        type_conversion.toInteger(fractionDigits),
        function(t, fractionDigits) {
            if (fractionDigits.value < 0 || fractionDigits.value > 20)
                return error.rangeError();
            
            if (t instanceof NumberInstance)
                return number_operations.toFixed(t.primitiveValue, fractionDigits.value);
            else if (value.isNumber(t))
                return number_operations.toFixed(t, fractionDigits.value);
            return error.typeError();
        });
};

var numberPrototypeToPrecision = function(ref, thisObj, args) {};


/**
 * `Number.prototype.toString([radix])`
 */
var numberPrototypeToString = function(ref, thisObj, args) {
    if (!args.length)
        return numberPrototypeToString(ref, thisObj, [new number.Number(10)]);
    
    return compute.binary(
        value_reference.getValue(compute.just(thisObj)),
        type_conversion.toInteger(args.getArg(0)),
        function(t, radix) {
            if (radix.value < 2 || radix.value > 36)
                return error.rangeError();
            
            if (t instanceof NumberInstance)
                return string.create(t.primitiveValue.value.toString(radix.value));
            else if (value.isNumber(t))
                return string.create(t.value.toString(radix.value));
            return error.typeError();
        });
};

/**
 * `Number.prototype.valueOf()`
 */
var numberPrototypeValueOf = function(ref, thisObj, args) {
    return compute.bind(
        value_reference.getValue(compute.just(thisObj)),
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
        func.createConstructor('Number', 1, number_ref.NumberPrototype, number_ref.Number.setValue(new Number())),

        number_ref.NumberPrototype.setValue(new NumberPrototype()),
        builtin_function.create(number_ref.NumberPrototypeToExponential, 'toExponential', 1, numberPrototypeToExponential),
        builtin_function.create(number_ref.NumberPrototypeToFixed, 'toFixed', 1, numberPrototypeToFixed),
        builtin_function.create(number_ref.NumberPrototypeToPrecision, 'toPrecision', 1, numberPrototypeToPrecision),
        builtin_function.create(number_ref.NumberPrototypeToString, 'toString', 0, numberPrototypeToString),
        builtin_function.create(number_ref.NumberPrototypeValueOf, 'valueOf', 0, numberPrototypeValueOf));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.Number = number_ref.Number;
exports.NumberPrototype = number_ref.NumberPrototype;

});