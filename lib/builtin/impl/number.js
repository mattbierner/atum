/**
 * @fileOverview Builtin `Number` object implementation.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/number',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/number',
        'atum/builtin/meta/object',
        'atum/builtin/operations/builtin_constructor',
        'atum/builtin/operations/builtin_function',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/number',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/property',
        'atum/value/value'],
function(exports,
        compute,
        number_builtin,
        func_builtin,
        object_builtin,
        meta_builtin_constructor,
        meta_number,
        meta_object,
        builtin_constructor,
        builtin_function,
        error,
        func,
        number_operations,
        string,
        type_conversion,
        value_reference,
        number,
        property,
        value){
"use strict";

/* Number
 ******************************************************************************/
/**
 * `Number([value])`
 */
var NumberCall = function(ref, thisObj, args) {
    return (args.length ?
        type_conversion.toNumber(args.getArg(0)) :
        compute.just(number.ZERO));
};

/**
 * `new Number([value])`
 */
var NumberConstruct = function(ref, args) {
    return compute.bind(this.call(null, null, args), function(num) {
        return value_reference.create(new NumberInstance(num));
    });
};

/**
 * Hosted `Number` constructor.
 */
var Number = new meta_builtin_constructor.BuiltinConstructor(
    func_builtin.FunctionPrototype, {
        'MAX_VALUE': property.createValuePropertyFlags(number.MAX_VALUE),
        'MIN_VALUE': property.createValuePropertyFlags(number.MIN_VALUE),
        'NaN': property.createValuePropertyFlags(number.NaN),
        'NEGATIVE_INFINITY': property.createValuePropertyFlags(number.NEGATIVE_INFINITY),
        'POSITIVE_INFINITY': property.createValuePropertyFlags(number.POSITIVE_INFINITY)
    },
    NumberCall,
    NumberConstruct);

/* NumberInstance
 ******************************************************************************/
var NumberInstance = function(primitiveValue) {
    meta_number.Number.call(this, this.proto, this.properties, primitiveValue);
};
NumberInstance.prototype = new meta_number.Number;
NumberInstance.prototype.constructor = NumberPrototype; 

NumberInstance.prototype.proto = number_builtin.NumberPrototype;

NumberInstance.prototype.properties = {};

/* NumberPrototype
 ******************************************************************************/
var NumberPrototype = new meta_object.Object(object_builtin.ObjectPrototype, {
    'toExponential': {
        'value': number_builtin.NumberPrototypeToExponential
    },
    'toFixed': {
        'value': number_builtin.NumberPrototypeToFixed
    },
    'toPrecision': {
        'value': number_builtin.NumberPrototypeToPrecision
    },
    'toString': {
        'value': number_builtin.NumberPrototypeToString
    },
    'valueOf': {
        'value': number_builtin.NumberPrototypeValueOf
    },
    'constructor': {
        'value': number_builtin.Number
    }
});

var numberPrototypeToExponential = function(ref, thisObj, args) {
    var fractionDigits = args.getArg(0);
    if (value.isUndefined(fractionDigits)) {
        return value_reference.dereference(thisObj, function(t) {
            if (t instanceof NumberInstance)
                return number_operations.toExponential(t.primitiveValue);
            else if (value.isNumber(t))
                return number_operations.toExponential(t);
            return error.typeError();
        });
    }
    
    return compute.binary(
        value_reference.getValue(thisObj),
        type_conversion.toInteger(fractionDigits),
        function(t, fractionDigits) {
            if (fractionDigits.value < 0 || fractionDigits.value > 20)
                return error.rangeError();
            
            if (t instanceof NumberInstance)
                return number_operations.toExponential(t.primitiveValue, fractionDigits.value);
            else if (value.isNumber(t))
                return number_operations.toExponential(t, fractionDigits.value);
            return error.typeError();
        });
};

/**
 * `Number.prototype.toFixed([fractionDigits])`
 */
var numberPrototypeToFixed = function(ref, thisObj, args) {
    var fractionDigits = args.getArg(0);
    if (value.isUndefined(fractionDigits))
        return func.call(compute.just(ref), compute.just(thisObj), compute.enumeration(number_operations.create(0)));
    
    return compute.binary(
        value_reference.getValue(thisObj),
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

/**
 * `Number.prototype.toPrecision ([precision])`
 */
var numberPrototypeToPrecision = function(ref, thisObj, args) {
    var precision = args.getArg(0);
    if (value.isUndefined(precision))
        return func.call(
            compute.just(number_builtin.NumberPrototypeToString),
            compute.just(thisObj),
            compute.enumeration());
    
    return compute.binary(
        value_reference.getValue(thisObj),
        type_conversion.toInteger(precision),
        function(t, precision) {
            if (precision.value < 1 || precision.value > 21)
                return error.rangeError();
            
            if (t instanceof NumberInstance)
                return number_operations.toPrecision(t.primitiveValue, precision.value);
            else if (value.isNumber(t))
                return number_operations.toPrecision(t, precision.value);
            return error.typeError();
        });
};

/**
 * `Number.prototype.toString([radix])`
 */
var numberPrototypeToString = function(ref, thisObj, args) {
    if (!args.length)
        return numberPrototypeToString(ref, thisObj, [new number.Number(10)]);
    
    return compute.binary(
        value_reference.getValue(thisObj),
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
    return value_reference.dereference(thisObj, function(t) {
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
    return compute.sequence(
        builtin_constructor.create('Number', 1, number_builtin.NumberPrototype, number_builtin.Number.setValue(Number)),

        number_builtin.NumberPrototype.setValue(NumberPrototype),
        builtin_function.create(number_builtin.NumberPrototypeToExponential, 'toExponential', 1, numberPrototypeToExponential),
        builtin_function.create(number_builtin.NumberPrototypeToFixed, 'toFixed', 1, numberPrototypeToFixed),
        builtin_function.create(number_builtin.NumberPrototypeToPrecision, 'toPrecision', 1, numberPrototypeToPrecision),
        builtin_function.create(number_builtin.NumberPrototypeToString, 'toString', 0, numberPrototypeToString),
        builtin_function.create(number_builtin.NumberPrototypeValueOf, 'valueOf', 0, numberPrototypeValueOf));
};

var configure = function(mutableBinding, immutableBinding) {
    return mutableBinding('Number', number_builtin.Number);
};

var execute = function() {
    return compute.empty;
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;
exports.configure = configure;
exports.execute = execute;

});