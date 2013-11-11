/**
 * @fileOverview Builtin arguments object.
 */
define(['exports',
        'amulet/record',
        'atum/compute',
        'atum/builtin/args',
        'atum/builtin/object',
        'atum/builtin/meta/args',
        'atum/builtin/operations/builtin_constructor',
        'atum/builtin/operations/builtin_function',
        'atum/operations/construct',
        'atum/operations/error',
        'atum/operations/string',
        'atum/operations/value_reference'],
function(exports,
        record,
        compute,
        args_builtin,
        object_builtin,
        meta_arguments,
        builtin_constructor,
        builtin_function,
        construct,
        error,
        string,
        value_reference){
"use strict";

/* Arguments
 ******************************************************************************/
var Arguments = {
    'call': function(ref, _, args) {
        return construct.constructForward(ref, args);
    },
    
    'construct': function(ref, thisObj, args) {
        return value_reference.create(new ArgumentsInstance());
    },
    
    'properties': {}
};

/* ArgumentsInstance
 ******************************************************************************/
var ArgumentsInstance = record.extend(meta_arguments.Arguments,
    [],
    function() {
        meta_arguments.Arguments.call(this, this.proto, this.properties, true);
    });

ArgumentsInstance.prototype.proto = object_builtin.ObjectPrototype;

ArgumentsInstance.prototype.properties = {};

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
        builtin_constructor.create(args_builtin.Arguments, '', 0, Arguments.properties, Arguments.call, Arguments.construct),
        
        builtin_function.create(args_builtin.strictCalleeThrower, '', 0, strictCalleeThrower),
        builtin_function.create(args_builtin.strictCallerThrower, '', 0, strictCallerThrower));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

});