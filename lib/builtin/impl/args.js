/**
 * @fileOverview Builtin arguments object.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/args',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/args',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/object',
        'atum/operations/object',
        'atum/operations/value_reference'],
function(exports,
        compute,
        args_ref,
        builtin_func,
        builtin_object,
        meta_arguments,
        meta_builtin_constructor,
        meta_object,
        object,
        value_reference){
//"use strict";

/* Arguments
 ******************************************************************************/
/**
 * Hosted `Arguments` constructor.
 */
var Arguments = function() {
    meta_builtin_constructor.BuiltinConstructor.call(
        this,
        this.proto,
        this.properties,
        this.call,
        this.construct);
};
Arguments.prototype = new meta_builtin_constructor.BuiltinConstructor;
Arguments.prototype.constructor = Arguments;

Arguments.prototype.proto = builtin_func.FunctionPrototype;

Arguments.prototype.properties = {
    'prototype': {
        'value': args_ref.ArgumentsPrototype
    }
};

/**
 * 
 */
Arguments.prototype.call = function(ref, thisObj, args) {
    return this.construct(ref, args);
};

Arguments.prototype.construct = function(ref, thisObj, args) {
    return value_reference.create(new ArgumentsInstance());
};


/* ArgumentsPrototype
 ******************************************************************************/
var ArgumentsPrototype = function() {
    meta_object.Object.call(this, this.proto, this.properties);
};
ArgumentsPrototype.prototype = new meta_object.Object;
ArgumentsPrototype.prototype.constructor = ArgumentsPrototype; 

ArgumentsPrototype.prototype.proto = builtin_object.ObjectPrototype;

ArgumentsPrototype.prototype.properties = { };

/* ArgumentsInstance
 ******************************************************************************/
var ArgumentsInstance = function() {
    meta_arguments.Arguments.call(this, this.proto, this.properties);
};
ArgumentsInstance.prototype = new meta_arguments.Arguments;
ArgumentsInstance.prototype.constructor = ArgumentsInstance; 

ArgumentsInstance.prototype.proto = builtin_object.ObjectPrototype;

ArgumentsInstance.prototype.properties = { };

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        args_ref.Arguments.setValue(new Arguments()),
        
        args_ref.ArgumentsPrototype.setValue(new ArgumentsPrototype()));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

});