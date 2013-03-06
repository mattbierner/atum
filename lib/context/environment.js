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
 * Environment records map identifier keys to values.
 * 
 * @param {object} bindings Object whose enumerable properties are the bound
 *     values for the environment record.
 */
var EnvironmentRecord = function(bindings) {
    this.bindings = bindings;
};

/**
 * Does this environment record store a binding for name 'n'.
 * 
 * @param {string} n Identifier name to lookup binding for.
 */
EnvironmentRecord.prototype.hasBinding = function(n) {
    var bindings = this.bindings;
    return !!(bindings && Object.getOwnPropertyDescriptor(bindings, n));
};

/**
 * Create a new environment contain a new mutable binding for 'n'
 */
EnvironmentRecord.prototype._createBinding = function(n, props) {
    if (this.hasBinding(n)) {
        throw "";
    }
    var bindings = this.bindings;
    return new EnvironmentRecord(Object.create(bindings, props));
};

/**
 * Create a new environment contain a new mutable binding for 'n'
 */
EnvironmentRecord.prototype.createMutableBinding = function(n, d) {
    var configValue = !!d;
    return this._createBinding(n, {
        'value': undefined,
        'writable': true,
        'enumerable': true,
        'configurable': configValue
    });
};

EnvironmentRecord.prototype.setMutableBinding = function(n, v, s) {
    return new EnvironmentRecord(amulet_object.defineProperty(this.bindings, n, {'value': v, 'enumerable': true}));
};

EnvironmentRecord.prototype.getBindingValue = function(n, s) {
    return this.bindings[n];
};

var deleteBinding = function(n) {};

var implicitThisValue = function() {};

var createImmutableBinding = function(env, n) { };


var initializeImmutableBinding = function(n, v) {
    
};

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
    return (lex.record.hasBinding(name) ?
        new reference.Reference(name, lex.record, strict) :
        getIdentifierReference(lex.outer, name, strict));
};

/**
 * 
 */
var putIdentifierReference = function(lex, name, value) {
    return new LexicalEnvironment(lex.outer, lex.record.setMutableBinding(name, value));
};

/**
 * 
 */
var setIdentifierReference = function(lex, name, value) {
    if (lex === null) {
        return new LexicalEnvironment(null, (new EnvironmentRecord({})).setMutableBinding(name, value))
    }
    return (lex.record.hasBinding(name) ?
        new LexicalEnvironment(null, lex.record.setMutableBinding(name, value)) :
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
    return new LexicalEnvironment(outer, new EnvironmentRecord({}));
};

/**
 * Create an new empty Object Lexical environment with a given set of
 * bindings 'o' and a parent 'outer'.
 * 
 * @param [o] Object that defines bindings for new environment.
 * @param [outer] Parent of new environment.
 */
var newObjectEnvironment = function(o, outer) {
    return new LexicalEnvironment(outer, new EnvironmentRecord(o));
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