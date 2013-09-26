/**
 * @fileOverview Builtin `String` object.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/array',
        'atum/builtin/string',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/regexp',
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
        array_builtin,
        string_ref,
        builtin_func,
        builtin_object,
        regexp_builtin,
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
    'constructor': {
        'value': string_ref.String
    },
    'match': {
        'value': string_ref.StringPrototypeMatch
    },
    'replace': {
        'value': string_ref.StringPrototypeReplace
    },
    'split': {
        'value': string_ref.StringPrototypeSplit
    },
    'toString': {
        'value': string_ref.StringPrototypeToString
    },
    'valueOf': {
        'value': string_ref.StringPrototypeValueOf
    }
});

/**
 * `String.prototype.match(regExp)`
 */
var stringPrototypeMatch = function(ref, thisObj, args) {
    return compute.binary(
        type_conversion.toString(thisObj),
        value_reference.getValue(args.getArg(0)),
        function(str, regexp) {
             var rx;
             if (regexp.cls === 'RegExp')
                 rx = compute.just(args.getArg(0));
             else
                 rx = object.construct(regexp_builtin.RegExp, [regexp])
          
             return value_reference.dereferenceFrom(rx, function(regexp, regexpRef) {
                 var result = str.value.match(regexp.regExp) || [];
                 
                 return result.reduce(function(p, c, i) {
                    return (c ? object.defineProperty(
                        p,
                        i + "", {
                            'value': string_op.create(c),
                            'writable': true,
                            'enumerable': true,
                            'configurable': true
                        }) : p);
                    }, object.construct(array_builtin.Array, []));
              });
        });
};

/**
 * `String.prototype.replace(searchValue, replaceValue)`
 */
var stringPrototypeReplace = function(ref, thisObj, args) {
    var searchValue = args.getArg(0),
        replaceValue = args.getArg(1);
    return compute.binds(
        compute.enumeration(
            type_conversion.toString(thisObj),
            value_reference.getValue(searchValue),
            type_conversion.toString(replaceValue)),
        function(str, searchValue, replaceValue) {
             var result;
             if (searchValue.cls === 'RegExp')
                 result = str.value.replace(searchValue.regExp, replaceValue.value);
             else
                 result = str.value.replace(searchValue.value, replaceValue.value);
             
             return string_op.create(result);
        });
};


/**
 * `String.prototype.split(separator, limit)`
 */
var stringPrototypeSplit = function(ref, thisObj, args) {
    return compute.binary(
        type_conversion.toString(thisObj),
        (value.isUndefined(args.getArg(1)) ? compute.empty : type_conversion.toUint32(args.getArg(1))),
        function(str, limit) {
            return value_reference.dereference(args.getArg(0), function(sep, sepRef) {
                 limit = limit ? limit.value : undefined;
                 var result;
                 if (sep.cls === 'RegExp')
                     result = str.value.split(sep.regExp, limit);
                 else
                     result = str.value.split(sep.value, limit);
                 
                 return result.reduce(function(p, c, i) {
                    return (c ? object.defineProperty(
                        p,
                        i + "", {
                            'value': string_op.create(c),
                            'writable': true,
                            'enumerable': true,
                            'configurable': true
                        }) : p);
                    }, object.construct(array_builtin.Array, []));
            });
        });
};

/**
 * `String.prototype.toString()`
 */
var stringPrototypeToString = function(ref, thisObj, args) {
    return value_reference.dereference(thisObj, function(t) {
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
    return value_reference.dereference(thisObj, function(t) {
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
    var builtin_function = require('atum/builtin/operations/builtin_function');
    return compute.sequence(
        func.createConstructor('String', 1, string_ref.StringPrototype, string_ref.String.setValue(new String())),

        string_ref.StringPrototype.setValue(StringPrototype),
        builtin_function.create(string_ref.StringPrototypeMatch, 'match', 1, stringPrototypeMatch),
        builtin_function.create(string_ref.StringPrototypeReplace, 'replace', 2, stringPrototypeReplace),
        builtin_function.create(string_ref.StringPrototypeSplit, 'split', 2, stringPrototypeSplit),
        builtin_function.create(string_ref.StringPrototypeToString, 'toString', 0, stringPrototypeToString),
        builtin_function.create(string_ref.StringPrototypeValueOf, 'valueOf', 0, stringPrototypeValueOf));
};

var configure = function(mutableBinding, immutableBinding) {
    return mutableBinding('String', string_ref.String);
};

var execute = function() {
    return evaluation.evaluateFile('atum/builtin/hosted/string.js');
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;
exports.configure = configure;
exports.execute = execute;

exports.String = string_ref.String;
exports.StringPrototype = string_ref.StringPrototype;

});