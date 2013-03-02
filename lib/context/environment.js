define(['atum/reference',
        'atum/value/undef'],
function(reference,
        undef) {
//"use strict";

// not functional here!
var copy = function(obj) {
    return Object.keys(obj).reduce(function(p, c) {
        p[c] = obj[c];
        return p;
    }, {});
};
    

/* Environment Record
 ******************************************************************************/
var EnvironmentRecord = function(bindings) {
    this.bindings = bindings;
};

EnvironmentRecord.prototype.hasBinding = function(n) {
    var bindings = this.bindings;
    return bindings && Object.getOwnPropertyDescriptor(bindings, n);
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
    var bindings = this.bindings;
    var current = Object.getOwnPropertyDescriptor(bindings, n) || null;
    var props = Object.defineProperty(copy(bindings), n, {'value': v, 'enumerable': true});
    return new EnvironmentRecord(props);
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
        //return new reference.Reference(name, undefined, strict);
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
 * 
 */
var newDeclarativeEnvironment = function(outer) {
    return new LexicalEnvironment(outer, new EnvironmentRecord({}));
};

/**
 * 
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