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
        'atum/builtin/operations/builtin_function',
        'atum/operations/error',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/value_reference'],
function(exports,
        compute,
        args_ref,
        func_builtin,
        object_builtin,
        meta_arguments,
        meta_builtin_constructor,
        func_builtin,
        error,
        object,
        string,
        value_reference){
//"use strict";

/* Arguments
 ******************************************************************************/
/**
 * 
 */
var ArgumentsCall = function(ref, thisObj, args) {
    return this.construct(ref, args);
};

/**
 * 
 */
var ArgumentsConstruct = function(ref, thisObj, args) {
    return value_reference.create(new ArgumentsInstance());
};

/**
 * Hosted `Arguments` constructor.
 */
var Arguments = new meta_builtin_constructor.BuiltinConstructor(
    func_builtin.FunctionPrototype,
    {},
    ArgumentsCall,
    ArgumentsConstruct);

/* ArgumentsInstance
 ******************************************************************************/
var ArgumentsInstance = function() {
    meta_arguments.Arguments.call(this, this.proto, this.properties);
};
ArgumentsInstance.prototype = new meta_arguments.Arguments;
ArgumentsInstance.prototype.constructor = ArgumentsInstance; 

ArgumentsInstance.prototype.proto = object_builtin.ObjectPrototype;

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
    return compute.sequence(
        args_ref.Arguments.setValue(Arguments),
        
        func_builtin.create(args_ref.strictCalleeThrower, '', 0, strictCalleeThrower),
        func_builtin.create(args_ref.strictCallerThrower, '', 0, strictCallerThrower));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

});