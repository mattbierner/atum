/**
 * @fileOverview Data structures and operations for creating and manipulating  
 * lexical environments.
 */
define(['amulet/object',
        'atum/compute',
        'atum/context/environment_record',
        'atum/operations/object',
        'atum/value/undef'],
function(amulet_object,
        compute,
        environment_record,
        object,
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
    this.outer = outer;
    this.record = record;
};

LexicalEnvironment.prototype.implicitThisValue = function() {
    return undef.UNDEFINED;
};

/**
 * 
 */
LexicalEnvironment.prototype.setMutableBinding = function(name, value) {
    return new LexicalEnvironment(
        this.outer,
        environment_record.setMutableBinding(this.record, name, value));
};

LexicalEnvironment.prototype.putImmutableBinding = function(name, value) {
    return new LexicalEnvironment(
        this.outer,
        environment_record.putImmutableBinding(this.record, name, value));
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
 * @param [record] Environment record for the environment,
 */
var DeclarativeLexicalEnvironment = function(outer, record) {
    LexicalEnvironment.call(this, (outer || null), (record || {}));
};
DeclarativeLexicalEnvironment.prototype = new LexicalEnvironment;

DeclarativeLexicalEnvironment.prototype.implicitThisValue = function() {
    return undefined;
};

DeclarativeLexicalEnvironment.prototype.setMutableBinding = function(name, value) {
    return new DeclarativeLexicalEnvironment(
        this.outer,
        environment_record.setMutableBinding(this.record, name, value));
};

/* Object Lexical Environment
 ******************************************************************************/
/**
 * Object Lexical environment.with a given set of bindings 'o' and parent 'outer'.
 * 
 * @param [outer] Parent of environment.
 * @param [object]
 * @param [provideThis] Does the environment provide a this value.
 */
var ObjectLexicalEnvironment = function(outer, object, provideThis) {
    LexicalEnvironment.call(this, (outer || null), object);
    this.provideThis = provideThis;
};
ObjectLexicalEnvironment.prototype = new LexicalEnvironment;

ObjectLexicalEnvironment.prototype.implicitThisValue = function() {
    return (providesThis ?
        record :
        undefined);
};

ObjectLexicalEnvironment.prototype.hasBinding = function(name) {
    return object.hasProperty(compute.just(this.record), name);
};

ObjectLexicalEnvironment.prototype.getBindingValue = function(name, strict) {
    return object.get(compute.just(this.record), name);
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