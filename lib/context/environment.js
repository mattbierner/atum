/**
 * @fileOverview Data structures and operations for creating and manipulating  
 * lexical environments.
 */
define(['amulet/object',
        'atum/context/environment_record',
        'atum/value/undef'],
function(amulet_object,
        environment_record,
        undef) {
"use strict";

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
    return undef.UNDEFINED;
}

/**
 * 
 */
var hasIdentifier = function(lex, name) {
    return (lex && environment_record.hasBinding(lex.record, name));
};

/**
 * 
 */
var getIdentifier = function(lex, name, strict) {
    return environment_record.getBindingValue(lex.record, name);
};

var putIdentifier = function(lex, name, value) {
    return new LexicalEnvironment(
        lex.outer,
        environment_record.setMutableBinding(lex.record, name, value));
}

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
};

/* Object Lexical Environment
 ******************************************************************************/
/**
 * Object Lexical environment.with a given set of bindings 'o' and parent 'outer'.
 * 
 * @param [outer] Parent of environment.
 * @param [provideThis] Does the environment provide a this value.
 */
var ObjectLexicalEnvironment = function(outer, provideThis) {
    LexicalEnvironment.call(this, (outer || null), {});
    this.provideThis = provideThis;
};
ObjectLexicalEnvironment.prototype = new LexicalEnvironment;

ObjectLexicalEnvironment.prototype.implicitThisValue = function() {
    return (providesThis ?
        record :
        undefined);
};

/* Export
 ******************************************************************************/
return {
// Lexical Environment
    'LexicalEnvironment': LexicalEnvironment,
    
    'hasIdentifier': hasIdentifier,
    'getIdentifier': getIdentifier,
    'putIdentifier': putIdentifier,

    'DeclarativeLexicalEnvironment': DeclarativeLexicalEnvironment,
    'ObjectLexicalEnvironment': ObjectLexicalEnvironment,

};

});