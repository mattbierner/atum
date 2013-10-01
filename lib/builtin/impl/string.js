/**
 * @fileOverview Builtin `String` object implementation.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/string',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/regexp',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/object',
        'atum/builtin/meta/string',
        'atum/builtin/operations/array',
        'atum/builtin/operations/builtin_constructor',
        'atum/builtin/operations/builtin_function',
        'atum/operations/error',
        'atum/operations/evaluation',
        'atum/operations/func',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/regexp',
        'atum/value/string',
        'atum/value/value',
        'text!atum/builtin/hosted/string.js'],
function(exports,
        compute,
        string_builtin,
        func_builtin,
        object_builtin,
        regexp_builtin,
        meta_builtin_constructor,
        meta_object,
        meta_string,
        array,
        builtin_constructor,
        builtin_function,
        error,
        evaluation,
        func,
        number,
        object,
        string_op,
        type_conversion,
        value_reference,
        regexp,
        string,
        value){
"use strict";

/* String
 ******************************************************************************/
/**
 * `String([value])`
 */
var StringCall = function(ref, thisObj, args) {
    return (args.length ?
        type_conversion.toString(args.getArg(0)) :
        compute.just(string.EMPTY));
};

/**
 * `new String([value])`
 */
var StringConstruct = function(ref, args) {
    return compute.bind(this.call(null, null, args), function(val) {
        return value_reference.create(new StringInstance(val));
    });
};
    
/**
 * Hosted `String` constructor.
 */
var String = new meta_builtin_constructor.BuiltinConstructor(
    func_builtin.FunctionPrototype,
    {},
    StringCall,
    StringConstruct);

/* StringInstance
 ******************************************************************************/
var StringInstance = function(primitiveValue) {
    meta_string.String.call(this, this.proto, this.properties, primitiveValue);
};
StringInstance.prototype = new meta_string.String;
StringInstance.prototype.constructor = StringInstance; 

StringInstance.prototype.proto = string_builtin.StringPrototype;

StringInstance.prototype.properties = {};

/* StringPrototype
 ******************************************************************************/
var StringPrototype = new meta_object.Object(object_builtin.ObjectPrototype, {
    'constructor': {
        'value': string_builtin.String
    },
    'match': {
        'value': string_builtin.StringPrototypeMatch
    },
    'replace': {
        'value': string_builtin.StringPrototypeReplace
    },
    'split': {
        'value': string_builtin.StringPrototypeSplit
    },
    'toString': {
        'value': string_builtin.StringPrototypeToString
    },
    'valueOf': {
        'value': string_builtin.StringPrototypeValueOf
    }
});

/**
 * `String.prototype.charCodeAt(pos)`
 */
var stringPrototypeCharCodeAt = function(ref, thisObj, args) {
    return compute.binary(
        type_conversion.toString(thisObj),
        type_conversion.toInteger(args.getArg(0)),
        function(str, pos) {
            var len = string.length(str);
            if (pos.value < 0 || pos.value >= len)
                return number.NAN;
            return compute.just(string.charCodeAt(str, pos));
        });
};

/**
 * `String.prototype.match(regExp)`
 */
var stringPrototypeMatch = function(ref, thisObj, args) {
    var regExp = args.getArg(0);
    return compute.bind(
        type_conversion.toString(thisObj),
        function(str) {
            return value_reference.dereferenceFrom(
                value_reference.dereference(regExp, function(reg, regexpRef) {
                    return (value.isObject(reg) && reg.cls === 'RegExp' ?
                        compute.just(regexpRef) :
                        object.construct(regexp_builtin.RegExp, [regexpRef]));
                }),
                function(reg) {
                     return array.create(regexp.match(str, reg.regExp).map(string_op.create));
                });
        });
};

/**
 * `String.prototype.replace(searchValue, replaceValue)`
 */
var stringPrototypeReplace = function(ref, thisObj, args) {
    var searchValue = args.getArg(0),
        replaceValue = args.getArg(1);
    
    return compute.bind(
        type_conversion.toString(thisObj),
        function(str) {
            return value_reference.dereference(searchValue, function(search, searchRef) {
                var pattern = (value.isObject(search) && search.cls === 'RegExp' ?
                    compute.just(searchRef) :
                    type_conversion.toString(searchRef));
                
                return value_reference.dereference(replaceValue, function(replacement, replacementRef) {
                    var replace = (value.isObject(replacement) && value.isCallable(replacement) ?
                        compute.just(replacementRef) :
                        type_conversion.toString(replacementRef));
                    return compute.binary(
                        value_reference.getFrom(pattern),
                        value_reference.getFrom(replace),
                        function(pattern, replace) {
                            var arr = (value.isObject(pattern) && pattern.cls === 'RegExp' ?
                                regexp.splitRegexp(str, pattern.regExp) :
                                regexp.splitString(str, pattern));
                            
                            return arr.reduce(function(p, c, i) {
                                if (i % 2 === 0)
                                    return string_op.concat(p, string_op.create(c[0]));
                                if (value.isObject(replace) && value.isCallable(replace)) {
                                    var m = c.length - 3;
                                    return string_op.concat(p, func.call(
                                        compute.just(replacementRef),
                                        null,
                                        compute.enumerationa(c.slice(m).map(string_op.create), number.create(c[m + 1]), string_op.create(c[m + 2]))));
                                }
                                return string_op.concat(p, compute.just(replacementRef));
                            }, string_op.EMPTY);
                        });
                });
            });
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
            limit = limit ? limit.value : undefined;
            return value_reference.dereference(args.getArg(0), function(sep, sepRef) {
                 var result;
                 if (sep.cls === 'RegExp')
                     result = str.value.split(sep.regExp, limit);
                 else
                     result = str.value.split(sep.value, limit);
                 
                 return array.create(result.map(string_op.create));
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
    return compute.sequence(
        builtin_constructor.create('String', 1, string_builtin.StringPrototype, string_builtin.String.setValue(String)),

        string_builtin.StringPrototype.setValue(StringPrototype),
        builtin_function.create(string_builtin.StringPrototypeCharCodeAt, 'charCodeAt', 1, stringPrototypeCharCodeAt),
        builtin_function.create(string_builtin.StringPrototypeMatch, 'match', 1, stringPrototypeMatch),
        builtin_function.create(string_builtin.StringPrototypeReplace, 'replace', 2, stringPrototypeReplace),
        builtin_function.create(string_builtin.StringPrototypeSplit, 'split', 2, stringPrototypeSplit),
        builtin_function.create(string_builtin.StringPrototypeToString, 'toString', 0, stringPrototypeToString),
        builtin_function.create(string_builtin.StringPrototypeValueOf, 'valueOf', 0, stringPrototypeValueOf));
};

var configure = function(mutableBinding, immutableBinding) {
    return mutableBinding('String', string_builtin.String);
};

var execute = function() {
    return evaluation.evaluateFile('atum/builtin/hosted/string.js');
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;
exports.configure = configure;
exports.execute = execute;

});