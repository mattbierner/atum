/**
 * @fileOverview The builtin Number object.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/object',
        'atum/builtin/meta/number',
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
        number_meta,
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
    number_meta.NumberPrototype.call(this, this.proto, this.properties);
    this.primitiveValue = primitiveValue || new number.Number(0);
};
NumberPrototype.prototype = new number_meta.NumberPrototype;
NumberPrototype.prototype.constructor = NumberPrototype; 

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
        'value': number.POSITIVE_INFINITY,
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

/* Initilization
 ******************************************************************************/
var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function');
    return compute.sequence(
        numberRef.setValue(new Number()),
        numberPrototypeRef.setValue(new NumberPrototype()),
        numberPrototypeToStringRef.setValue(builtin_function.create('toString', 0, numberPrototypeToString)),
        numberPrototypeValueOfRef.setValue(builtin_function.create('valueOf', 0, numberPrototypeValueOf)),
        numberPrototypeConstructorRef.setValue(builtin_function.create('constructor', 1, numberPrototypeConstructor)));
};

/* Export
 ******************************************************************************/
exports.Number = Number;
exports.numberRef = numberRef;

exports.initialize = initialize;

});