define(['atum/reference',
        'atum/undef'],
function(reference,
        undef) {
//"use strict";


/* 
 ******************************************************************************/
var EnvironmentRecord = function(bindings) {
    this.bindings = bindings;
};

EnvironmentRecord.prototype.hasBinding = function(n) {
    var bindings = this.bindings;
    return bindings && bindings[n];
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
    var props = Object.defineProperty(Object.create(bindings, {}), n, {'value': v});
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
};

/**
 * 
 */
var getIdentifierReference = function(lex, name, strict) {
    if (lex === null) {
        return new reference.Reference(name, undefined, strict);
    }
    return (lex.record.hasBinding(name) ?
        new reference.Reference(name, lex.record, strict) :
        getIdentifierReference(lex.outer, name, strict));
};

var putIdentifierReference = function(lex, name, value) {
    return new LexicalEnvironment(lex.outer, lex.record.setMutableBinding(name, value));
};

var newDeclarativeEnvironment = function(outer) {
    return new LexicalEnvironment(outer, new EnvironmentRecord({}));
};

var newObjectEnvironment = function(o, outer) {
    return new LexicalEnvironment(outer, new EnvironmentRecord(o));
};


return {
// Environment Record
    'EnvironmentRecord': EnvironmentRecord,
    
// Lexical Environment
    'LexicalEnvironment': LexicalEnvironment,
    
    'getIdentifierReference': getIdentifierReference,
    'putIdentifierReference': putIdentifierReference,
    'newDeclarativeEnvironment': newDeclarativeEnvironment,
    'newObjectEnvironment': newObjectEnvironment
};

});