/**
 * @fileOverview Builtin `RegExp` object implementation.
 */
// @TODO: Remove
var HostRegExp = RegExp;

define(['exports',
        'atum/compute',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/regexp',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/object',
        'atum/builtin/meta/regexp',
        'atum/builtin/operations/array',
        'atum/builtin/operations/builtin_constructor',
        'atum/builtin/operations/builtin_function',
        'atum/operations/error',
        'atum/operations/evaluation',
        'atum/operations/nil',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/value',
        'text!atum/builtin/hosted/regexp.js'],
function(exports,
        compute,
        func_builtin,
        object_builtin,
        regexp_builtin,
        meta_builtin_constructor,
        meta_object,
        meta_regexp,
        array,
        builtin_constructor,
        builtin_function,
        error,
        evaluation,
        nil,
        number,
        object,
        string,
        type_conversion,
        value_reference,
        number_value,
        value){
"use strict";

/* RegExp
 ******************************************************************************/
/**
 * Hosted `RegExp` constructor.
 */
var RegExp = function() {
    meta_builtin_constructor.BuiltinConstructor.call(
        this,
        this.proto,
        this.properties,
        this.call,
        this.construct);
};
RegExp.prototype = new meta_builtin_constructor.BuiltinConstructor;
RegExp.prototype.constructor = RegExp;

RegExp.prototype.proto = func_builtin.FunctionPrototype;

RegExp.prototype.properties = {};

/**
 * `RegExp(pattern, [flags])`
 */
RegExp.prototype.call = function(ref, thisObj, args) {
    var self = this;
    var pattern = args.getArg(0),
        flags = args.getArg(1);
    
    return value_reference.dereference(pattern, function(pattern) {
        return (pattern instanceof meta_regexp.RegExp && value.isUndefined(flags) ?
            compute.just(pattern) :
            self.construct(null, args));
    });
};

/**
 * `new RegExp(pattern, flags)`
 */
RegExp.prototype.construct = function(ref, args) {
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
    meta_regexp.RegExp.call(this, this.proto, this.properties, pattern);
};
RegExpInstance.prototype = new meta_regexp.RegExp;
RegExpInstance.prototype.constructor = RegExpPrototype; 

RegExpInstance.prototype.proto = regexp_builtin.RegExpPrototype;

RegExpInstance.prototype.properties = {};

/* RegExp Prototype
 ******************************************************************************/
var RegExpPrototype = new meta_object.Object(object_builtin.ObjectPrototype, {
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
});

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
        builtin_constructor.create('RegExp', 1, regexp_builtin.RegExpPrototype, regexp_builtin.RegExp.setValue(new RegExp())),

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