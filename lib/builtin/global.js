/**
 * @fileOverview
 */
define(['atum/compute',
        'atum/iref',
        'atum/context/environment',
        'atum/context/execution_context',
        'atum/value/number', 'atum/value/undef',
        'atum/builtin/object',
        'atum/operations/environment',],
function(compute,
        iref,
        environment,
        execution_context,
        number, undef,
        object,
        environment_semantics) {
//"use strict";

/* Values
 ******************************************************************************/
/**
 * 
 */
var globalNaN = new number.Number(NaN);

/**
 * 
 */
var globalInfinity = new number.Number(Infinity);

/**
 * 
 */
var globalUndefined = new undef.Undefined();

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
        'value': globalNaN,
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'Infinity': {
        'value': globalInfinity,
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'undefined': {
        'value': globalUndefined,
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
        environment_semantics.setMutableBinding('Object', false, compute.always(object.objectRef)));
};

/* Export
 ******************************************************************************/
return {
    'globalRef': globalRef,
    'globalEnvironment': globalEnvironment,
    
    'initialize': initialize
    
};
});