/**
 * @fileOverview Builtin `String` object.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/string',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/regexp',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/string',
        'atum/builtin/meta/object',
        'atum/builtin/operations/array',
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
        string_ref,
        builtin_func,
        builtin_object,
        regexp_builtin,
        meta_builtin_constructor,
        meta_string,
        meta_object,
        array,
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
//"use strict";

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
    builtin_func.FunctionPrototype,
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
    var regExp = args.getArg(0);
    return compute.bind(
        type_conversion.toString(thisObj),
        function(str) {
            return value_reference.dereference(regExp, function(regexp, regexpRef) {
                var rx = (value.isObject(regexp) && regexp.cls === 'RegExp' ?
                    compute.just(regexpRef) :
                    object.construct(regexp_builtin.RegExp, [regexpRef]));
                 return value_reference.dereferenceFrom(rx, function(regexp) {
                     return array.create(regexp.match(str, regexp.regExp).map(string_op.create));
                 });
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
    var builtin_function = require('atum/builtin/operations/builtin_function');
    return compute.sequence(
        func.createConstructor('String', 1, string_ref.StringPrototype, string_ref.String.setValue(String)),

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