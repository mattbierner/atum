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
        'atum/operations/error',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/value_reference'],
function(exports,
        compute,
        args_ref,
        builtin_func,
        builtin_object,
        meta_arguments,
        meta_builtin_constructor,
        error,
        object,
        string,
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

Arguments.prototype.properties = { };

/**
 * 
 */
Arguments.prototype.call = function(ref, thisObj, args) {
    return this.construct(ref, args);
};

Arguments.prototype.construct = function(ref, thisObj, args) {
    return value_reference.create(new ArgumentsInstance());
};

/* ArgumentsInstance
 ******************************************************************************/
var ArgumentsInstance = function() {
    meta_arguments.Arguments.call(this, this.proto, this.properties);
};
ArgumentsInstance.prototype = new meta_arguments.Arguments;
ArgumentsInstance.prototype.constructor = ArgumentsInstance; 

ArgumentsInstance.prototype.proto = builtin_object.ObjectPrototype;

ArgumentsInstance.prototype.properties = { };

/* Strict Accessors
 ******************************************************************************/
var strictCalleeThrower = function(ref, thisObj, args) {
    return error.typeError(string.create('Cannot accesss arguments callee in strict mode'));
};

var strictCallerThrower = function(ref, thisObj, args) {
    return error.typeError(string.create('Cannot accesss arguments caller in strict mode'));
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    var builtin_function = require('atum/builtin/operations/builtin_function');

    return compute.sequence(
        args_ref.Arguments.setValue(new Arguments()),
        
        builtin_function.create(args_ref.strictCalleeThrower, '', 0, strictCalleeThrower),
        builtin_function.create(args_ref.strictCallerThrower, '', 0, strictCallerThrower));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

});