/**
 * @fileOverview Data structures and operations for creating and manipulating  
 * lexical environments.
 */
define(['amulet/object',
        'atum/compute',
        'atum/context/environment_record',
        'atum/operations/object',
        'atum/operations/undef',
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
 * Abstract base lexical environment.
 * 
 * Lexical environments store a binding record and a parent environment.
 */
var LexicalEnvironment = function(outer, record) {
    this.outer = outer;
    this.record = record;
};

/**
 * Computation that returns the this value for the environment,
 */
LexicalEnvironment.prototype.implicitThisValue = function() {
    return undef.UNDEFINED;
};

/**
 * Computation returning if the environment contains an own binding for `name`.
 */
LexicalEnvironment.prototype.hasBinding = null;

/**
 * Computation that returns the bound value for `name`.
 * 
 * This does not handled lookups for bindings that do not exist in the current
 * environment, use `hasBinding` to ensure the binding exists.
 */
LexicalEnvironment.prototype.getBindingValue = null;

/**
 * Computation to set a binding for name in this environment.
 * 
 * Updates the existing binding or creates a new one if one does not exist.
 * 
 * @param ref Reference to this environment
 * @param {string} name Name of binding.
 * @param value Value to store.
 */
LexicalEnvironment.prototype.setMutableBinding = null;

/**
 * Computation to create a new immutable binding for `name` in the environment.
 * 
 * A binding for `name` must not already exist in this environment.
 * 
 * @param ref Reference to this environment
 * @param {string} name Name of binding.
 * @param value Value to store.
 */
LexicalEnvironment.prototype.putImmutableBinding = null;

/**
 * Computation to delete the binding for `name` in the environment.
 * 
 * @param ref Reference to this environment
 * @param {string} name Name of binding.
 */
LexicalEnvironment.prototype.deleteBinding = null;




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
DeclarativeLexicalEnvironment.prototype.constructor = DeclarativeLexicalEnvironment;

DeclarativeLexicalEnvironment.prototype.hasBinding = function(name) {
    return compute.bool(environment_record.hasBinding(this.record, name));
};

DeclarativeLexicalEnvironment.prototype.getBindingValue = function(name, strict) {
    return compute.just(environment_record.getBindingValue(this.record, name, strict));
};

DeclarativeLexicalEnvironment.prototype.setMutableBinding = function(ref, name, value) {
    return ref.setValue(
        new DeclarativeLexicalEnvironment(
            this.outer,
            environment_record.setMutableBinding(this.record, name, value)));
};

DeclarativeLexicalEnvironment.prototype.putImmutableBinding = function(ref, name, value) {
    return ref.setValue(
        new DeclarativeLexicalEnvironment(
            this.outer,
            environment_record.putImmutableBinding(this.record, name, value)));
};

DeclarativeLexicalEnvironment.prototype.deleteBinding = function(ref, name) {
    return ref.setValue(
        new DeclarativeLexicalEnvironment(
            this.outer,
            environment_record.deleteBinding(this.record, name)));
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
    this.provideThis = !!provideThis;
};
ObjectLexicalEnvironment.prototype = new LexicalEnvironment;
ObjectLexicalEnvironment.prototype.constructor = ObjectLexicalEnvironment;

ObjectLexicalEnvironment.prototype.implicitThisValue = function() {
    return (this.providesThis ?
        compute.just(this.record) :
        undef.UNDEFINED);
};

ObjectLexicalEnvironment.prototype.hasBinding = function(name) {
    return object.hasProperty(this.record, name);
};

ObjectLexicalEnvironment.prototype.getBindingValue = function(name, strict) {
    return object.get(this.record, name);
};

ObjectLexicalEnvironment.prototype.setMutableBinding = function(ref, name, value) {
    return object.set(this.record, name, value);
};

ObjectLexicalEnvironment.prototype.putImmutableBinding = function(ref, name, value) {
    return this.setMutableBinding(ref, name, value);
};

ObjectLexicalEnvironment.prototype.deleteBinding = function(ref, name) {
    return object.deleteProperty(this.record, name);
};


/* Export
 ******************************************************************************/
return {
// Lexical Environment
    'LexicalEnvironment': LexicalEnvironment,
    
    'hasIdentifier': hasIdentifier,
    'getIdentifier': getIdentifier,
    'deleteIdentifier': deleteIdentifier,
    
    'DeclarativeLexicalEnvironment': DeclarativeLexicalEnvironment,
    'ObjectLexicalEnvironment': ObjectLexicalEnvironment,

};

});