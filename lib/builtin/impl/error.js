/**
 * @fileOverview Error object builtin.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/error',
        'atum/builtin/object',
        'atum/builtin/meta/error',
        'atum/builtin/meta/object',
        'atum/builtin/operations/builtin_constructor',
        'atum/operations/construct',
        'atum/operations/error',
        'atum/operations/evaluation',
        'atum/operations/execution_context',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/string',
        'atum/value/property',
        'atum/value/value',
        'text!atum/builtin/hosted/error.js'],
function(exports,
        compute,
        error_builtin,
        object_builtin,
        meta_error,
        meta_object,
        builtin_constructor,
        construct,
        error,
        evaluation,
        execution_context,
        number,
        object,
        type_conversion,
        value_reference,
        string,
        property,
        value){
"use strict";

/* Error
 ******************************************************************************/
/**
 * `Error([msg])`
 */
var ErrorCall = function(ref, thisObj, args) {
    return construct.constructForward(ref, args);
};

/**
 * `new Error([msg])`
 * 
 * NON-STANDARD - Sets `lineNumber` and `fileName`
 */
var ErrorConstruct = function(ref, args) {
    var msg = args.getArg(0);
    return compute.binary(
        value_reference.create(new ErrorInstance()),
        execution_context.loc,
        function(obj, loc) {
            return compute.sequence(
                (loc && loc.start ?
                    compute.bind(
                        number.create(loc.start.line),
                        function(num) {
                            return object.set(obj, 'lineNumber', num);
                        }) :
                    compute.empty),
                
                (value.isUndefined(msg) ?
                    compute.empty : 
                    compute.bind(
                        type_conversion.toString(msg),
                        function(msg) {
                            return object.set(obj, 'message', msg);
                        })),
                
                compute.just(obj));
        });
};

var ErrorProperties = {
    'prototype': property.createValuePropertyFlags(
        error_builtin.ErrorPrototype)
};

/* ErrorInstance
 ******************************************************************************/
var ErrorInstance = function() {
    meta_error.Error.call(this, this.proto, this.properties, true);
};
ErrorInstance.prototype = new meta_error.Error;
ErrorInstance.prototype.constructor = ErrorInstance; 

ErrorInstance.prototype.proto = error_builtin.ErrorPrototype;

ErrorInstance.prototype.properties = {};

/* ErrorPrototype
 ******************************************************************************/
var ErrorPrototype = new meta_object.Object(
    object_builtin.ObjectPrototype, {
        'constructor': property.createValuePropertyFlags(
            error_builtin.Error),
        
        'message': property.createValuePropertyFlags(
             string.EMPTY,
             property.WRITABLE | property.CONFIGURABLE),
         
        'name': property.createValuePropertyFlags(
            new string.String('Error'),
            property.WRITABLE | property.CONFIGURABLE)
    },
    true);

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        builtin_constructor.create(error_builtin.Error, 'Error', 1, ErrorProperties, ErrorCall, ErrorConstruct),
        
        error_builtin.ErrorPrototype.setValue(ErrorPrototype));
};

var configure = function(mutableBinding, immutableBinding) {
    return mutableBinding('Error', error_builtin.Error);
};

var execute = function() {
    return evaluation.evaluateFile('atum/builtin/hosted/error.js');
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;
exports.configure = configure;
exports.execute = execute;

});