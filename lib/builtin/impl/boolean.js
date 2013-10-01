/**
 * @fileOverview Builtin `Boolean` object implementation.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/boolean',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/boolean',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/object',
        'atum/builtin/operations/builtin_constructor',
        'atum/builtin/operations/builtin_function',
        'atum/operations/boolean',
        'atum/operations/error',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/property',
        'atum/value/value'],
function(exports,
        compute,
        boolean_builtin,
        func_builtin,
        object_builtin,
        meta_boolean,
        meta_builtin_constructor,
        meta_object,
        builtin_constructor,
        builtin_function,
        boolean,
        error,
        string,
        type_conversion,
        value_reference,
        property,
        value){
"use strict";

/* Boolean
 ******************************************************************************/
/**
 * `Boolean([value])`
 */
var BooleanCall = function(ref, thisObj, args) {
    return (args.length ?
        type_conversion.toBoolean(args.getArg(0)) :
        boolean.FALSE);
};

/**
 * `new Boolean([value])`
 */
var BooleanConstruct = function(ref, args) {
    return compute.bind(this.call(null, null, args), function(val) {
        return value_reference.create(new BooleanInstance(val));
    });
};

/**
 * `Boolean`
 */
var Boolean = new meta_builtin_constructor.BuiltinConstructor(
    func_builtin.FunctionPrototype, {
        'prototype': property.createValuePropertyFlags(boolean_builtin.BooleanPrototype)
    },
    BooleanCall,
    BooleanConstruct);

/* BooleanInstance
 ******************************************************************************/
var BooleanInstance = function(primitiveValue) {
    meta_boolean.Boolean.call(this, this.proto, this.properties, primitiveValue);
};
BooleanInstance.prototype = new meta_boolean.Boolean;
BooleanInstance.prototype.constructor = BooleanPrototype; 

BooleanInstance.prototype.proto = boolean_builtin.BooleanPrototype;

BooleanInstance.prototype.properties = {};

/* BooleanPrototype
 ******************************************************************************/
var BooleanPrototype = new meta_object.Object(object_builtin.ObjectPrototype, {
    'constructor': property.createValuePropertyFlags(
        boolean_builtin.Boolean),
    
    'toString': property.createValuePropertyFlags(
        boolean_builtin.BooleanPrototypeToString,
        property.WRITABLE | property.CONFIGURABLE),
    
    'valueOf': property.createValuePropertyFlags(
        boolean_builtin.BooleanPrototypeValueOf,
        property.WRITABLE | property.CONFIGURABLE),
});

/**
 * `Boolean.prototype.toString()`
 */
var booleanPrototypeToString = function(ref, thisObj, args) {
    return value_reference.dereference(thisObj, function(t) {
        if (t instanceof meta_boolean.Boolean)
            return string.create(t.primitiveValue ? 'true' : 'false');
        else if (value.isBoolean(t))
            return string.create(t.value ? ' true' : 'false');
        return error.typeError(string.create('Boolean.prototype.toString not called on Boolean'));
    });
};

/**
 * `Boolean.prototype.valueOf()`
 */
var booleanPrototypeValueOf = function(ref, thisObj, args) {
    return value_reference.dereference(thisObj, function(t) {
        if (t instanceof meta_boolean.Boolean)
            return t.defaultValue();
        else if (value.isBoolean(t))
            return compute.just(t);
        return error.typeError(string.create('Boolean.prototype.valueOf not called on Boolean'));
    });
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        builtin_constructor.create('Boolean', 1, boolean_builtin.BooleanPrototype, boolean_builtin.Boolean.setValue(Boolean)),

        boolean_builtin.BooleanPrototype.setValue(BooleanPrototype),
        builtin_function.create(boolean_builtin.BooleanPrototypeToString, 'toString', 0, booleanPrototypeToString),
        builtin_function.create(boolean_builtin.BooleanPrototypeValueOf, 'valueOf', 0, booleanPrototypeValueOf));
};

var configure = function(mutableBinding, immutableBinding) {
    return mutableBinding('Boolean', boolean_builtin.Boolean);
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