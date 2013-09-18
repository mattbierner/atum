/**
 * @fileOverview The global builtin environment.
 */
var hostParseInt = parseInt;

define(['atum/compute',
        'atum/value_reference',
        'atum/builtin/array',
        'atum/builtin/boolean',
        'atum/builtin/error',
        'atum/builtin/func',
        'atum/builtin/global',
        'atum/builtin/math',
        'atum/builtin/native_errors',
        'atum/builtin/number',
        'atum/builtin/object',
        'atum/builtin/regexp',
        'atum/builtin/string',
        'atum/builtin/impl/args',
        'atum/builtin/impl/array',
        'atum/builtin/impl/boolean',
        'atum/builtin/impl/error',
        'atum/builtin/impl/func',
        'atum/builtin/impl/math',
        'atum/builtin/impl/native_errors',
        'atum/builtin/impl/number',
        'atum/builtin/impl/object',
        'atum/builtin/impl/regexp',
        'atum/builtin/impl/string',
        'atum/context/execution_context',
        'atum/context/execution_settings',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/evaluation',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/value/number',
        'atum/value/undef',
        'atum/value/value',
        'text!atum/builtin/hosted/global.js'],
function(compute,
        value_reference,
        array,
        builtin_boolean,
        builtin_error,
        func,
        global_builtin,
        math_builtin,
        native_errors,
        number_builtin,
        object,
        regexp,
        builtin_string,
        impl_args,
        impl_array,
        impl_boolean,
        impl_error,
        impl_func,
        impl_math,
        impl_native_errors,
        impl_number_builtin,
        impl_object,
        impl_regexp,
        impl_string,
        execution_context,
        execution_settings,
        environment_semantics,
        error,
        execution_context_operations,
        evaluation,
        number_operations,
        object_operations,
        string,
        type_conversion,
        number,
        undef,
        value) {
//"use strict";

/* Global Functions
 ******************************************************************************/
/**
 * `eval(x)`
 */
var globalEval = function(ref, thisBinding, args) {
    var x = args.getArg(0);
    if (!value.isString(x))
        return compute.just(x);
    return evaluation.evaluate(x.value);
};

/**
 * `parseInt(str, radix)`
 */
var globalParseInt = function(ref, thisBinding, args) {
    var str = args.getArg(0),
        radix = args.getArg(1);
    return compute.binary(
        type_conversion.toString(str),
        type_conversion.toInt32(radix),
        function(str, r) {
            var stripPrefix = true;
            var rad = r.value, input = str.value.trim();
            if (r.value === 0) {
                rad = 10;
            } else if (r.value < 2 || r.value > 36) {
                return number_operations.NAN;
            } else if (r.value !== 16) {
                stripPrefix = false;
            }
            if (stripPrefix) {
                if (input.indexOf('0x') === 0 || input.indexOf('0X') === 0) {
                    input = input.slice(2);
                    rad = 16;
                }
            }
            
            return number_operations.create(hostParseInt(input, rad));
        });
};

var globalParseFloat;

var decodeURI;

var decodeURIComponent;

var encodeURI;

var encodeURIComponent;

/* Execution Context
 ******************************************************************************/
var globalExecutionContext = function(env, obj) {
    return new execution_context.createGlobalContext(
        execution_settings.DEFAULTS,
        env,
        obj);
};

/* Environment
 ******************************************************************************/
var createGlobalObject = function() {
    return object_operations.create(null, {
        'Infinity': {
            'value': number.POSITIVE_INFINITY,
            'enumerable': false,
            'writable': false,
            'configurable': false
        },
        'NaN': {
            'value': number.NaN,
            'enumerable': false,
            'writable': false,
            'configurable': false
        },
        'undefined': {
            'value': undef.UNDEFINED,
            'enumerable': false,
            'writable': false,
            'configurable': false
        }
    });
};

var createGlobalBindings = function() {
    var immutableBinding = function(name, value) {
        return environment_semantics.putStrictnessImmutableBinding(name, false, compute.just(value));
    };
    var mutableBinding = function(name, value) {
        return environment_semantics.putStrictnessMutableBinding(name, false, compute.just(value));
    };
    
    return compute.sequence(
        mutableBinding('Array', array.Array),
        mutableBinding('Boolean', builtin_boolean.Boolean),
        mutableBinding('Error', builtin_error.Error),
        mutableBinding('eval', global_builtin.globalEval),
        mutableBinding('EvalError', native_errors.EvalError),
        mutableBinding('Function', func.Function),
        mutableBinding('Math', math_builtin.Math),
        mutableBinding('Number', number_builtin.Number),
        mutableBinding('Object', object.Object),
        mutableBinding('parseInt', global_builtin.globalParseInt),
        mutableBinding('RangeError', native_errors.RangeError),
        mutableBinding('ReferenceError', native_errors.ReferenceError),
        mutableBinding('RegExp', regexp.RegExp),
        mutableBinding('String', builtin_string.String),
        mutableBinding('SyntaxError', native_errors.SyntaxError),
        mutableBinding('TypeError', native_errors.TypeError),
        mutableBinding('UriError', native_errors.UriError));
};


/* Global
 ******************************************************************************/
var createGlobal = function() {
    return compute.bind(createGlobalObject(), function(obj) {
        return compute.bind(
            environment_semantics.createObjectEnvironment(null, obj),
            function(lex) {
                return compute.just(globalExecutionContext(lex, obj));
            });
    });
};

/**
 * Sets the current execution context to a new global execution context.
 */
var enterGlobal = function() {
    return compute.sequence(
        compute.bind(createGlobal(), compute.setContext),
        createGlobalBindings());

};

var initializeGlobal = function() {
    var builtin_function = require('atum/builtin/builtin_function');
    return compute.sequence(
        builtin_function.create(global_builtin.globalEval, 'eval', 1, globalEval),
        builtin_function.create(global_builtin.globalParseInt, 'parseInt', 1, globalParseInt),
        
        evaluation.evaluateFile('atum/builtin/hosted/global.js'));
};

/* Initialize
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        impl_object.initialize(),
        impl_args.initialize(),
        impl_boolean.initialize(),
        impl_array.initialize(),
        impl_error.initialize(),
        impl_native_errors.initialize(),
        impl_func.initialize(),
        impl_math.initialize(),
        impl_number_builtin.initialize(),
        impl_string.initialize(),
        impl_regexp.initialize(),
        initializeGlobal());
};

/* Export
 ******************************************************************************/
return {
    'initialize': initialize,
    
    'enterGlobal': enterGlobal
};

});