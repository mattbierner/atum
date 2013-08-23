/**
 * @fileOverview Data structures and operations for creating and manipulating  
 * lexical environments.
 */
define(['amulet/object',
        'atum/compute',
        'atum/context/environment_record',
        'atum/value/undef'],
function(amulet_object,
        compute,
        environment_record,
        undef) {
//"use strict";

/* Lexical Environment
 ******************************************************************************/
/**
 * ECMAscript lexical environment.
 * 
 * Lexical environments store a binding record and a parent environment.
 */
var LexicalEnvironment = function(outer, record) {
    this.outer = outer;
    this.record = record;
};

LexicalEnvironment.prototype.implicitThisValue = function() {
    return undef.UNDEFINED;
};

/**
 * Computation returning if the environment contains an own binding for `name`.
 */
LexicalEnvironment.prototype.hasBinding = function(name) {
    return (environment_record.hasBinding(this.record, name) ?
        compute.yes :
        compute.no);
};

/**
 * Computation that returns the bound value for `name`.
 * 
 * This does not handled lookups for bindings that do not exist in the current
 * environment, use `hasBinding` to ensure the binding exists.
 */
LexicalEnvironment.prototype.getBindingValue = function(name, strict) {
    return compute.just(environment_record.getBindingValue(this.record, name, strict));
};

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
};

/**
 * 
 */
var deleteIdentifier = function(lex, name) {
    return new LexicalEnvironment(
        lex.outer,
        environment_record.deleteBinding(lex.record, name));
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
};

/* Object Lexical Environment
 ******************************************************************************/
/**
 * Object Lexical environment.with a given set of bindings 'o' and parent 'outer'.
 * 
 * @param [outer] Parent of environment.
 * @param [provideThis] Does the environment provide a this value.
 */
var ObjectLexicalEnvironment = function(outer, object, provideThis) {
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
    'deleteIdentifier': deleteIdentifier,
    
    'DeclarativeLexicalEnvironment': DeclarativeLexicalEnvironment,
    'ObjectLexicalEnvironment': ObjectLexicalEnvironment,

};

});