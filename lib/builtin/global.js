/**
 * @fileOverview
 */
define(['atum/context/environment',
        'atum/value/number',
        'atum/value/undef'],
function(environment,
        number,
        undef) {
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

/* Export
 ******************************************************************************/
return {
    'globalEnvironment': globalEnvironment
    
};

});