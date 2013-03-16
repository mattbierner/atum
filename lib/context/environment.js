/**
 * @fileOverview Data structures and operations for creating and manipulating  
 * lexical environments.
 */
define(['amulet/object',
        'atum/reference',
        'atum/value/undef',
        'atum/iref'],
function(amulet_object,
        reference,
        undef,
        iref) {
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
EnvironmentRecord.hasBinding = function(env, n) {
    return !!(env && env.hasOwnProperty(n));
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
};

LexicalEnvironment.prototype.implicitThisValue = function() {
    return undefined;
}

/**
 * 
 */
var hasIdentifierReference = function(lex, name) {
    if (lex === null) {
        return null;
    }
    return EnvironmentRecord.hasBinding(lex.record, name);
};

/**
 * 
 */
var getIdentifierReference = function(ctx, lex, name, strict) {
    if (lex === null) {
        return null;
    }
    return (EnvironmentRecord.hasBinding(lex.record, name) ?
        new reference.Reference(name, lex, strict) :
        getIdentifierReference(ctx, iref.getValue(lex.outer, ctx), name, strict));
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

/* Declarative Lexical Environment
 ******************************************************************************/
/**
 * Declarative lexical environment.
 * 
 * @param [outer] Parent of environment.
 */
var DeclarativeLexicalEnvironment = function(outer) {
    LexicalEnvironment.call(this, (outer || null), {});
};
DeclarativeLexicalEnvironment.prototype = new LexicalEnvironment;

DeclarativeLexicalEnvironment.prototype.implicitThisValue = function() {
    return undefined;
}

/* Object Lexical Environment
 ******************************************************************************/
/**
 * Object Lexical environment.with a given set of bindings 'o' and parent 'outer'.
 * 
 * @param [outer] Parent of environment.
 * @param [record] Environment record with bindings for environment.
 */
var ObjectLexicalEnvironment = function(outer, record) {
    LexicalEnvironment.call(this, (outer || null), (record || {}));
};
ObjectLexicalEnvironment.prototype = new LexicalEnvironment;

ObjectLexicalEnvironment.prototype.implicitThisValue = function() {
    return undefined;
}

/* Export
 ******************************************************************************/
return {
// Environment Record
    'EnvironmentRecord': EnvironmentRecord,
    
// Lexical Environment
    'LexicalEnvironment': LexicalEnvironment,
    
    'hasIdentifierReference': hasIdentifierReference,
    'getIdentifierReference': getIdentifierReference,
    'putIdentifierReference': putIdentifierReference,
    'setIdentifierReference': setIdentifierReference,

    'DeclarativeLexicalEnvironment': DeclarativeLexicalEnvironment,
    'ObjectLexicalEnvironment': ObjectLexicalEnvironment,

};

});