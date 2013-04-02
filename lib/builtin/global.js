/**
 * @fileOverview
 */
define(['atum/compute',
        'atum/iref',
        'atum/context/environment',
        'atum/context/execution_context',
        'atum/value/number', 'atum/value/undef',
        'atum/builtin/object',
        'atum/semantics/environment',],
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

var createGlobal = function() {
    return compute.bind(
        (new iref.Iref()).set(compute.always(globalEnvironment)),
        function(lexRef) {
            var ctx = new execution_context.ExecutionContext(
                execution_context.GLOBAL,
                false,
                lexRef,
                lexRef,
                null);
            return function(_, v, ok, err) {
                return ok(null, ctx, v);
            };
        });
};


var create = function() {
    return compute.sequence(
        createGlobal(),
        environment_semantics.setMutableBinding('Object', false, object.create()));
};


/* Export
 ******************************************************************************/
return {
    'globalEnvironment': globalEnvironment,
    
    'createGlobal': create
    
};

});