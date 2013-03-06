/**
 * @fileOverview Data structures and operations for creating and manipulating  
 * lexical environments.
 */
define(['amulet/object',
        'atum/reference',
        'atum/value/undef'],
function(amulet_object,
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
var EnvironmentRecord = {};

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
EnvironmentRecord.hasBinding = function(env, n) {
    return !!(env && Object.getOwnPropertyDescriptor(env, n));
};

/**
 * Create a new environment contain a new mutable binding for 'n'
 */
EnvironmentRecord.createMutableBinding = function(env, n, d) {
    return _createBinding(env, n, {
        'value': undefined,
        'writable': true,
        'enumerable': true,
        'configurable': !!d
    });
};

EnvironmentRecord.setMutableBinding = function(env, n, v, s) {
    return amulet_object.defineProperty(env, n, {
        'value': v,
        'enumerable': true
    });
};

EnvironmentRecord.getBindingValue = function(env, n, s) {
    return env[n];
};

var deleteBinding = function(n) { /* @TODO */ };

var implicitThisValue = function() { /* @TODO */ };

var createImmutableBinding = function(env, n) { /* @TODO */ };

var initializeImmutableBinding = function(n, v) { /* @TODO */ };

/* Lexical Environment
 ******************************************************************************/
/**
 * ECMAscript lexical environment.
 * 
 * Lexical environments store a binding record and a parent environment.
 */
var LexicalEnvironment = function(outer, record) {
    this.record = record;
    this.outer = outer;
    Object.freeze(this);
};

/**
 * 
 */
var getIdentifierReference = function(lex, name, strict) {
    if (lex === null) {
        return null;
    }
    return (EnvironmentRecord.hasBinding(lex.record, name) ?
        new reference.Reference(name, lex.record, strict) :
        getIdentifierReference(lex.outer, name, strict));
};

/**
 * 
 */
var putIdentifierReference = function(lex, name, value) {
    return new LexicalEnvironment(
        lex.outer,
        EnvironmentRecord.setMutableBinding(lex.record, name, value));
};

/**
 * 
 */
var setIdentifierReference = function(lex, name, value) {
    if (lex === null) {
        return new LexicalEnvironment(null, EnvironmentRecord.setMutableBinding({}, name, value))
    }
    return (EnvironmentRecord.hasBinding(lex.record, name) ?
        new LexicalEnvironment(null, EnvironmentRecord.setMutableBinding(lex.record, name, value)) :
        new LexicalEnvironment(setIdentifierReference(lex.outer, name, value), lex.record));
};

/* Lexical Environment Factories 
 ******************************************************************************/
/**
 * Create an new empty declarative lexical environment with parent 'outer'.
 * 
 * @param [outer] Parent of new environment.
 */
var newDeclarativeEnvironment = function(outer) {
    return new LexicalEnvironment(outer, {});
};

/**
 * Create an new empty Object Lexical environment with a given set of
 * bindings 'o' and a parent 'outer'.
 * 
 * @param [o] Object that defines bindings for new environment.
 * @param [outer] Parent of new environment.
 */
var newObjectEnvironment = function(o, outer) {
    return new LexicalEnvironment(outer, o);
};

/* Export
 ******************************************************************************/
return {
// Environment Record
    'EnvironmentRecord': EnvironmentRecord,
    
// Lexical Environment
    'LexicalEnvironment': LexicalEnvironment,
    
    'getIdentifierReference': getIdentifierReference,
    'putIdentifierReference': putIdentifierReference,
    'setIdentifierReference': setIdentifierReference,

// Lexical Environment Factories 
    'newDeclarativeEnvironment': newDeclarativeEnvironment,
    'newObjectEnvironment': newObjectEnvironment
};

});