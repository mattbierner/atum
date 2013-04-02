/**
 * @fileOverview Data structures and operations for creating and manipulating  
 * lexical environments.
 */
define(['amulet/object',
        'atum/compute',
        'atum/reference',
        'atum/value/undef'],
function(amulet_object,
        compute,
        reference,
        undef) {
//"use strict";

/* Environment Record
 ******************************************************************************/
/**
 * ECMAScript Environment record.
 * 
 * Environment records map identifier keys to values. An environment record is
 * an object whose enumerable properties are the bound values for the
 * environment record.
 */
var EnvironmentRecord = function() { };

/**
 * Create a new environment contain a new mutable binding for 'n'
 */
var _createBinding = function(env, n, props) {
    if (EnvironmentRecord.hasBinding(env, n)) {
        throw "";
    }
    return Object.create(env, props);
};


/**
 * Does given environment record store a binding for name 'n'.
 * 
 * @param env Environment record.
 * @param {string} n Identifier name to lookup binding for.
 */
var hasBinding = function(env, n) {
    return !!(env && env.hasOwnProperty(n));
};

/**
 * Create a new environment contain a new mutable binding for 'n'
 */
var createMutableBinding = function(env, n, d) {
    return _createBinding(env, n, {
        'value': undefined,
        'writable': true,
        'enumerable': true,
        'configurable': !!d
    });
};

var setMutableBinding = function(env, n, v, s) {
    return amulet_object.defineProperty(env, n, {
        'value': v,
        'enumerable': true,
        'configurable': true
    });
};

var getBindingValue = function(env, n, s) {
    return env[n];
};

var deleteBinding = function(n) { /* @TODO */ };

var createImmutableBinding = function(env, n) { /* @TODO */ };

var initializeImmutableBinding = function(n, v) { /* @TODO */ };


/* Export
 ******************************************************************************/
return {
// Environment Record
    'EnvironmentRecord': EnvironmentRecord,
    
    'hasBinding': hasBinding,
    'createMutableBinding': createMutableBinding,
    'setMutableBinding': setMutableBinding,
    'getBindingValue': getBindingValue,
    'deleteBinding': deleteBinding,
    'createImmutableBinding': createImmutableBinding,
    'initializeImmutableBinding': initializeImmutableBinding
};

});