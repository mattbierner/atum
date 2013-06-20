/**
 * @fileOverview
 */
define(['atum/compute',
        'atum/iref',
        'atum/context/environment',
        'atum/context/execution_context',
        'atum/value/number', 'atum/value/undef',
        'atum/builtin/func',
        'atum/builtin/number',
        'atum/builtin/object',
        'atum/operations/environment',],
function(compute,
        iref,
        environment,
        execution_context,
        number, undef,
        func,
        number,
        object,
        environment_semantics) {
//"use strict";

/* Operations
 ******************************************************************************/
var globalEval = function(x) {
    if (type(x) !== 'String') {
        return x;
    };
};

var globalParseInt;

var globalParseFloat;

var globalIsNaN;

var globalIsFinite;

var decodeURI;

var decodeURIComponent;

var encodeURI;

var encodeURIComponent;

/* Environment
 ******************************************************************************/
var globalRef = iref.Iref.create();

/**
 * 
 */
var globalEnvironment = new environment.ObjectLexicalEnvironment(null, Object.create(Object, {
    'NaN': {
        'value': number.NaN,
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'Infinity': {
        'value': number.POSITVE_INFINITY,
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'undefined': {
        'value': undef.UNDEFINED,
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'eval': {
        'value': globalEval
    }
}));

var initializeGlobal = function() {
    return compute.bind(
        globalRef.setValue(globalEnvironment),
        function(ref) {
            var ctx = new execution_context.ExecutionContext(
                execution_context.ExecutionContextType.GLOBAL,
                false,
                ref,
                ref,
                ref,
                ref);
            return function(_, v, ok, err) {
                return ok(ctx, ctx, v);
            };
        });
};

var initialize = function() {
    return compute.sequence(
        initializeGlobal(),
        object.initialize(),
        func.initialize(),
        number.initialize(),
        environment_semantics.setMutableBinding('undefined', false, compute.just(undef.UNDEFINED)),
        environment_semantics.setMutableBinding('Number', false, compute.just(number.numberRef)),
        environment_semantics.setMutableBinding('Object', false, compute.just(object.objectRef)));
};

/* Export
 ******************************************************************************/
return {
    'globalRef': globalRef,
    'globalEnvironment': globalEnvironment,
    
    'initialize': initialize
    
};
});