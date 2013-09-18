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
        'atum/operations/evaluation',
        'atum/operations/func',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/string',
        'atum/value/value',
        'text!atum/builtin/hosted/string.js'],
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
        evaluation,
        func,
        number,
        object,
        string_op,
        type_conversion,
        value_reference,
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

String.prototype.properties = { };

/**
 * `String([value])`
 */
String.prototype.call = function(ref, thisObj, args) {
    return (args.length ?
        type_conversion.toString(args.getArg(0)) :
        string.EMPTY);
};

/**
 * `new String([value])`
 */
String.prototype.construct = function(ref, args) {
    return compute.bind(this.call(null, null, args), function(val) {
        return value_reference.create(new StringInstance(val));
    });
};

/* StringInstance
 ******************************************************************************/
var StringInstance = function(primitiveValue) {
    meta_string.String.call(this, this.proto, this.properties, primitiveValue);
};
StringInstance.prototype = new meta_string.String;
StringInstance.prototype.constructor = StringInstance; 

StringInstance.prototype.proto = string_ref.StringPrototype;

StringInstance.prototype.properties = {};

/* StringPrototype
 ******************************************************************************/
var StringPrototype = new meta_object.Object(builtin_object.ObjectPrototype, {
    'toString': {
        'value': string_ref.StringPrototypeToString
    },
    'valueOf': {
        'value': string_ref.StringPrototypeValueOf
    },
    'constructor': {
        'value': string_ref.String
    }
});

/**
 * `String.prototype.toString()`
 */
var stringPrototypeToString = function(ref, thisObj, args) {
    return compute.bind(
        value_reference.getValue(compute.just(thisObj)),
        function(t) {
            if (t instanceof StringInstance)
                return compute.just(t.primitiveValue);
            else if (value.isString(t))
                return compute.just(t);
            return error.typeError();
        });
};

/**
 * `String.prototype.valueOf()`
 */
var stringPrototypeValueOf = function(ref, thisObj, args) {
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

        string_ref.StringPrototype.setValue(StringPrototype),
        builtin_function.create(string_ref.StringPrototypeToString, 'toString', 0, stringPrototypeToString),
        builtin_function.create(string_ref.StringPrototypeValueOf, 'valueOf', 0, stringPrototypeValueOf),
        
        evaluation.evaluateFile('atum/builtin/hosted/string.js'));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.String = string_ref.String;
exports.StringPrototype = string_ref.StringPrototype;

});