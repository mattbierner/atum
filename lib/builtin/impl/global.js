/**
 * @fileOverview The global builtin environment.
 */
var hostParseInt = parseInt;

define(['atum/compute',
        'atum/fun',
        'atum/builtin/global',
        'atum/builtin/impl/args',
        'atum/builtin/impl/array',
        'atum/builtin/impl/boolean',
        'atum/builtin/impl/date',
        'atum/builtin/impl/error',
        'atum/builtin/impl/func',
        'atum/builtin/impl/math',
        'atum/builtin/impl/native_errors',
        'atum/builtin/impl/number',
        'atum/builtin/impl/object',
        'atum/builtin/impl/regexp',
        'atum/builtin/impl/string',
        'atum/builtin/operations/builtin_function',
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
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/undef',
        'atum/value/value',
        'atum/external/importScripts',
        'text!atum/builtin/hosted/global.js'],
function(compute,
        fun,
        global_builtin,
        impl_args,
        impl_array,
        impl_boolean,
        impl_date,
        impl_error,
        impl_func,
        impl_math,
        impl_native_errors,
        impl_number,
        impl_object,
        impl_regexp,
        impl_string,
        builtin_function,
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
        value_reference,
        number,
        undef,
        value,
        importScripts) {
"use strict";

/* Global Functions
 ******************************************************************************/
/**
 * `eval(x)`
 */
var globalEval = function(ref, thisBinding, args) {
    var x = args.getArg(0);
    if (!value.isString(x))
        return compute.just(x);
    return evaluation.evaluateText(x.value);
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
var createGlobalObject = object_operations.create(null, {
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


var createGlobalBindings = function() {
    var immutableBinding = fun.curry(
        environment_semantics.putStrictnessImmutableBinding,
        false);
    var mutableBinding = fun.curry(
        environment_semantics.putStrictnessMutableBinding,
        false);
    
    var configure = function(x) {
        return x.configure(mutableBinding, immutableBinding);
    };
    
    return compute.sequence(
        mutableBinding('eval', global_builtin.globalEval),
        mutableBinding('parseInt', global_builtin.globalParseInt),

        configure(impl_array),
        configure(impl_boolean),
        configure(impl_date),
        configure(impl_error),
        configure(impl_native_errors),
        configure(impl_func),
        configure(impl_math),
        configure(impl_number),
        configure(impl_object),
        configure(impl_string),
        configure(impl_regexp),
        importScripts.configure(mutableBinding, immutableBinding));
};


/* Global
 ******************************************************************************/
var createGlobal = compute.bind(
    environment_semantics.createObjectEnvironment(global_builtin.global, null),
    function(lex) {
        return compute.just(globalExecutionContext(lex, global_builtin.global));
    });


/**
 * Sets the current execution context to a new global execution context.
 */
var enterGlobal = function() {
    return compute.sequence(
        value_reference.dereferenceFrom(createGlobalObject, function(x) {
            return global_builtin.global.setValue(x);
        }),
        compute.bind(createGlobal, compute.setContext),
        createGlobalBindings());
};

/* Initialize
 ******************************************************************************/
var initializeGlobal = function() {
    return compute.sequence(
        builtin_function.create(global_builtin.globalEval, 'eval', 1, globalEval),
        builtin_function.create(global_builtin.globalParseInt, 'parseInt', 1, globalParseInt),
        
        evaluation.evaluateFile('atum/builtin/hosted/global.js'));
};

var initilizeBuiltins = function() {
    return compute.sequence(
        impl_object.initialize(),
        impl_args.initialize(),
        impl_boolean.initialize(),
        impl_date.initialize(),
        impl_array.initialize(),
        impl_error.initialize(),
        impl_native_errors.initialize(),
        impl_func.initialize(),
        impl_math.initialize(),
        impl_number.initialize(),
        impl_string.initialize(),
        impl_regexp.initialize());
};

var initializeExternal = function() {
    return compute.sequence(
        importScripts.execute());
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        initilizeBuiltins(),
        initializeGlobal(),
        importScripts.initialize(),
        execute(),
        initializeExternal());
};

var configure = function() {
    
};

var execute = function() {
    return compute.sequence(
        impl_object.execute(),
        impl_math.execute(),
        impl_array.execute(),
        impl_regexp.execute(),
        impl_number.execute(),
        impl_string.execute(),
        impl_boolean.execute());
};


/* Export
 ******************************************************************************/
return {
    'initialize': initialize,
    
    'enterGlobal': enterGlobal
};

});