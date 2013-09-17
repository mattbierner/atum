/**
 * @fileOverview Builtin `RegExp` object.
 */
var HostRegExp = RegExp;

define(['exports',
        'atum/compute',
        'atum/builtin/array',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/regexp',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/func',
        'atum/builtin/meta/object',
        'atum/builtin/meta/regexp',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/nil',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/value'],
function(exports,
        compute,
        builtin_array,
        builtin_func,
        builtin_object,
        regexp_ref,
        meta_builtin_constructor,
        meta_func,
        meta_object,
        meta_regexp,
        error,
        func,
        nil,
        number,
        object_operations,
        string,
        type_conversion,
        value_reference,
        number_value,
        value){
//"use strict";

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

RegExp.prototype.proto = builtin_func.FunctionPrototype;

RegExp.prototype.properties = {};

/**
 * `RegExp(pattern, [flags])`
 */
RegExp.prototype.call = function(ref, thisObj, args) {
    var self = this;
    var pattern = args.getArg(0),
        flags = args.getArg(1);
    return compute.bind(
        value_reference.getValue(compute.just(pattern)),
        function(pattern) {
            return (pattern.cls === meta_regexp.RegExp.prototype.cls && value.isUndefined(flags) ?
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
    return compute.bind(
        value_reference.getValue(compute.just(pattern)),
        function(pattern) {
            if (pattern.cls === meta_regexp.RegExp.prototype.cls && !value.isUndefined(flags))
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

RegExpInstance.prototype.proto = regexp_ref.RegExpPrototype;

RegExpInstance.prototype.properties = {};

/* RegExpPrototype
 ******************************************************************************/
var RegExpPrototype = function() {
    meta_object.Object.call(this, this.proto, this.properties);
};
RegExpPrototype.prototype = new meta_object.Object;
RegExpPrototype.prototype.constructor = RegExpPrototype; 

RegExpPrototype.prototype.proto = builtin_object.ObjectPrototype;

RegExpPrototype.prototype.properties = {
    'constructor': {
        'value': regexp_ref.RegExp
    },
    'exec': {
        'value': regexp_ref.RegExpPrototypeExec
    },
    'toString': {
        'value': regexp_ref.RegExpPrototypeToString
    },
    'valueOf': {
        'value': regexp_ref.RegExpPrototypeValueOf
    }
};

/**
 * `RegExp.prototype.toString()`
 */
var numberPrototypeToString = function(ref, thisObj, args) {
    if (!args.length)
        return numberPrototypeToString(ref, thisObj, [new number.RegExp(10)]);
    
    return compute.binary(
        value_reference.getValue(compute.just(thisObj)),
        type_conversion.toInteger(args.getArg(0)),
        function(t, radix) {
            if (radix < 2 || radix > 36)
                return error.rangeError();
            
            if (t instanceof RegExpInstance)
                return string.create(t.primitiveValue.value.toString(radix.value));
            else if (value.isRegExp(t))
                return string.create(t.value.toString(radix.value));
            return error.typeError();
        });
};

/**
 * `RegExp.prototype.exec(str)`
 */
var regexpPrototypeExec = function(ref, thisObj, args) {
    var self = this;
    return compute.binds(
        compute.enumeration(
            value_reference.getValue(compute.just(thisObj)),
            type_conversion.toString(args.getArg(0)),
            compute.bind(object_operations.get(thisObj, 'lastIndex'), type_conversion.toInteger),
            compute.bind(object_operations.get(thisObj, 'global'), type_conversion.toBoolean)),
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
                Object.keys(props).reduce(function(p, c) {
                    return object_operations.defineProperty(p, c, props[c]);
                }, object_operations.construct(builtin_array.Array, [])));
        });
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function');
    return compute.sequence(
        func.createConstructor('RegExp', 1, regexp_ref.RegExpPrototype, regexp_ref.RegExp.setValue(new RegExp())),

        regexp_ref.RegExpPrototype.setValue(new RegExpPrototype()),
        builtin_function.create(regexp_ref.RegExpPrototypeExec, 'exec', 1, regexpPrototypeExec),
        builtin_function.create(regexp_ref.RegExpPrototypeToString, 'toString', 0, numberPrototypeToString));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.RegExp = regexp_ref.RegExp;
exports.RegExpPrototype = regexp_ref.RegExpPrototype;

});