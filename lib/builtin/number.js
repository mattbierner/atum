/**
 * @fileOverview The builtin Number object.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/object',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        compute,
        value_reference,
        builtin_object,
        string,
        type_conversion,
        value_reference_operations,
        number,
        object,
        type,
        value){
//"use strict";

/* Refs
 ******************************************************************************/
var numberRef = new value_reference.ValueReference();

var numberPrototypeRef = new value_reference.ValueReference();
var numberPrototypeToStringRef = new value_reference.ValueReference();
var numberPrototypeConstructorRef = new value_reference.ValueReference();
var numberPrototypeValueOfRef = new value_reference.ValueReference();

/* NumberPrototype
 ******************************************************************************/
var NumberPrototype = function(primitiveValue) {
    object.Object.call(this, this.proto, this.properties);
    this.primitiveValue = primitiveValue || new number.Number(0);
};
NumberPrototype.prototype = new object.Object;
NumberPrototype.prototype.constructor = NumberPrototype; 

NumberPrototype.prototype.cls = "Number";
NumberPrototype.prototype.proto = builtin_object.objectPrototypeRef;

NumberPrototype.prototype.properties = {
    'toString': {
        'value': numberPrototypeToStringRef
    },
    'valueOf': {
        'value': numberPrototypeValueOfRef
    },
    'constructor': {
        'value': numberPrototypeConstructorRef
    }
};

/**
 * Internal function object construction
 * 
 * @TODO: hookup default object prototype.
 */
NumberPrototype.prototype.construct = function(args) {
};

NumberPrototype.prototype.defaultValue = function() {
    return compute.just(this.primitiveValue);
};

var numberPrototypeToString = function(ref, thisObj, args) {
    if (!args.length)
        return numberPrototypeToString(ref, thisObj, [new number.Number(10)]);
    return compute.bind(
        value_reference_operations.getValue(compute.just(thisObj)),
        function(t) {
            return compute.bind(type_conversion.toInteger(compute.just(args[0])), function(radix) {
                if (t instanceof NumberPrototype) {
                    return string.create(t.primitiveValue.value.toString(radix.value));
                } else if (t.type === type.NUMBER_TYPE) {
                    return string.create(t.value.toString(radix.value));
                } else {
                    return compute.error("TODO");
                }
            });
        });
};

var numberPrototypeValueOf = function(ref, thisObj, args) {
    return compute.bind(
        value_reference_operations.getValue(compute.just(thisObj)),
        function(t) {
            if (t instanceof NumberPrototype) {
                return compute.just(t.primitiveValue);
            } else if (t.type === type.NUMBER_TYPE) {
                return compute.just(t);
            } else {
                return compute.error("TODO");
            }
        });
};


var numberPrototypeConstructor = function(ref, thisObj, args) {
    return compute.bind(numberRef.getValue(), function(Number) {
        return Number.construct(args);
    });
};

/* Number
 ******************************************************************************/
/**
 * 
 */
var Number = function() {
    object.Object.call(this, this.proto, this.properties);
};

Number.prototype = new object.Object;
Number.prototype.constructor = Number;

Number.prototype.proto = builtin_object.objectRef;

Number.prototype.properties = {
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
        'value': number.NEGATIVE_INFINITY,
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'prototype': {
        'value': numberPrototypeRef,
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
        type_conversion.toNumber(compute.just(args[0])) :
        compute.just(new number.Number(0)));
};

/**
 * Builtin Number constructor.
 */
Number.prototype.construct = function(args) {
    return compute.bind(this.call(null, null, args), function(num) {
        return value_reference_operations.create(new NumberPrototype(num));
    });
};

var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function');
    return compute.sequence(
        numberRef.setValue(new Number()),
        numberPrototypeRef.setValue(new NumberPrototype()),
        numberPrototypeToStringRef.setValue(new builtin_function.BuiltinFunction('toString', numberPrototypeToString)),
        numberPrototypeValueOfRef.setValue(new builtin_function.BuiltinFunction('valueOf', numberPrototypeValueOf)),
        numberPrototypeConstructorRef.setValue(new builtin_function.BuiltinFunction('constructor', numberPrototypeConstructor)));
};

/* Export
 ******************************************************************************/
exports.Number = Number;
exports.numberRef = numberRef;

exports.NumberPrototype = NumberPrototype;

exports.initialize = initialize;

});