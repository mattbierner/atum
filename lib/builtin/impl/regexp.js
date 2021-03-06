/**
 * @fileOverview Builtin `RegExp` object implementation.
 */
// @TODO: Remove
var HostRegExp = RegExp;

define(['exports',
        'atum/compute',
        'atum/builtin/object',
        'atum/builtin/regexp',
        'atum/builtin/meta/object',
        'atum/builtin/meta/regexp',
        'atum/builtin/operations/array',
        'atum/builtin/operations/builtin_constructor',
        'atum/builtin/operations/builtin_function',
        'atum/operations/construct',
        'atum/operations/error',
        'atum/operations/evaluation',
        'atum/operations/nil',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/property',
        'atum/value/value',
        'text!atum/builtin/hosted/regexp.js'],
function(exports,
        compute,
        object_builtin,
        regexp_builtin,
        meta_object,
        meta_regexp,
        array,
        builtin_constructor,
        builtin_function,
        construct,
        error,
        evaluation,
        nil,
        number,
        object,
        string,
        type_conversion,
        value_reference,
        number_value,
        property,
        value){
"use strict";

/* RegExp
 ******************************************************************************/
var RegExpProperties = {
    'prototype': property.createValuePropertyFlags(
        regexp_builtin.RegExpPrototype)
};

/**
 * `RegExp(pattern, [flags])`
 */
var RegExpCall = function(ref, thisObj, args) {
    var self = this;
    var pattern = args.getArg(0),
        flags = args.getArg(1);
    
    return value_reference.dereference(pattern, function(pattern) {
        return (pattern instanceof meta_regexp.RegExp && value.isUndefined(flags) ?
            compute.just(pattern) :
            construct.constructForward(ref, args));
    });
};

/**
 * `new RegExp(pattern, flags)`
 */
var RegExpConstruct = function(ref, args) {
    var pattern = args.getArg(0),
        flags = args.getArg(1);
    return value_reference.dereference(pattern, function(pattern) {
        if (pattern instanceof meta_regexp.RegExp && !value.isUndefined(flags))
            return error.typeError();
        return compute.binary(
            value.isUndefined(pattern) ? string.EMPTY :  type_conversion.toString(pattern),
            value.isUndefined(flags) ? string.EMPTY :  type_conversion.toString(flags),
            function(pattern, flags) {
                // Check the regexp is valid.
                try {
                    new HostRegExp(pattern.value, flags.value);
                } catch(e) {
                    return error.syntaxError(string.create(e));
                }
                return value_reference.create(new RegExpInstance({
                    'body': pattern.value,
                    'flags': flags.value
                }));
            });
    });
};

/* RegExpInstance
 ******************************************************************************/
var RegExpInstance = function(pattern) {
    meta_regexp.RegExp.call(this, this.proto, this.properties, true, pattern);
};
RegExpInstance.prototype = new meta_regexp.RegExp;
RegExpInstance.prototype.constructor = RegExpPrototype; 

RegExpInstance.prototype.proto = regexp_builtin.RegExpPrototype;

RegExpInstance.prototype.properties = {};

/* RegExp Prototype
 ******************************************************************************/
var RegExpPrototype = new meta_object.Object(
    object_builtin.ObjectPrototype, {
        'constructor': {
            'value': regexp_builtin.RegExp
        },
        'exec': {
            'value': regexp_builtin.RegExpPrototypeExec
        },
        'toString': {
            'value': regexp_builtin.RegExpPrototypeToString
        },
        'valueOf': {
            'value': regexp_builtin.RegExpPrototypeValueOf
        }
    },
    true);

/**
 * `RegExp.prototype.toString()`
 */
var regexpPrototypeToString = function(ref, thisObj, args) {
    return value_reference.dereference(thisObj, function(pattern) {
            var pattern;
            if (t instanceof RegExpInstance)
                pattern = t.pattern;
            else if (value.isRegExp(t))
                pattern = t.value;
            else
                return error.typeError();
            
            return string.create('/' + pattern.body + '/' + pattern.flags);
        });
};

/**
 * `RegExp.prototype.exec(str)`
 */
var regexpPrototypeExec = function(ref, thisObj, args) {
    var self = this;
    return compute.binds(
        compute.enumeration(
            value_reference.getValue(thisObj),
            type_conversion.toString(args.getArg(0)),
            compute.bind(object.get(thisObj, 'lastIndex'), type_conversion.toInteger),
            compute.bind(object.get(thisObj, 'global'), type_conversion.toBoolean)),
        function(r, str, i, global) {
            if (!(r instanceof meta_regexp.RegExp))
                return error.typeError();
            var re = new HostRegExp(r.pattern.body, r.pattern.flags);
            var result = re.exec(str.value);
            if (!result)
                return nil.NULL;
            
            var s = (global ?
                self.defineProperty(thisObj, 'lastIndex', {
                    'value': new number_value.Number(re.lastIndex)
                }) :
                compute.just(thiObj));
            var props = {
                'index': {
                    'value': number.create(result.index),
                    'enumerable': true,
                    'writable': true,
                    'configurable': true
                },
                'input': {
                    'value': compute.just(str),
                    'enumerable': true,
                    'writable': true,
                    'configurable': true
                },
                'length': {
                    'value': number.create(result.length)
                }
            };
            
            result.forEach(function(x, i) {
                props[i] = {
                    'value': string.create(x),
                    'enumerable': true,
                    'writable': true,
                    'configurable': true
                }
            });
            
            return compute.sequence(
                s,
                array.create(Object.keys(props).map(function(x) { return props[x]; })));
        });
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        builtin_constructor.create(regexp_builtin.RegExp, 'RegExp', 1, RegExpProperties, RegExpCall, RegExpConstruct),

        regexp_builtin.RegExpPrototype.setValue(RegExpPrototype),
        builtin_function.create(regexp_builtin.RegExpPrototypeExec, 'exec', 1, regexpPrototypeExec),
        builtin_function.create(regexp_builtin.RegExpPrototypeToString, 'toString', 0, regexpPrototypeToString));
};

var configure = function(mutableBinding, immutableBinding) {
    return mutableBinding('RegExp', regexp_builtin.RegExp);
};

var execute = function() {
    return evaluation.evaluateFile('atum/builtin/hosted/regexp.js');
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;
exports.configure = configure;
exports.execute = execute;

});