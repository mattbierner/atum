/**
 * @fileOverview Data structures and operations for creating and manipulating  
 * lexical environments.
 */
define(['bes/record',
        'atum/compute',
        'atum/context/environment_record',
        'atum/operations/object',
        'atum/operations/undef'],
function(record,
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
var LexicalEnvironment = record.declare(null, [
    'outer',
    'record']);

/**
 * Computation that returns the this value for the environment,
 */
LexicalEnvironment.prototype.implicitThisValue = undef.UNDEFINED;

/**
 * Computation returning if the environment contains an own binding for `name`.
 */
LexicalEnvironment.prototype.hasOwnBinding = null;

/**
 * Computation that returns the bound value for `name`.
 * 
 * This does not handled lookups for bindings that do not exist in the current
 * environment, use `hasOwnBinding` to ensure the binding exists.
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


/* Declarative Lexical Environment
 ******************************************************************************/
/**
 * Declarative lexical environment.
 * 
 * @param [outer] Reference to enclosing environment.
 * @param [record] Environment record for the environment.
 */
var DeclarativeLexicalEnvironment = record.extend(LexicalEnvironment,
    [],
    function(outer, record) {
        this.outer = outer;
        this.record = (record || environment_record.empty);
    });

DeclarativeLexicalEnvironment.prototype.hasOwnBinding = function(name) {
    return compute.bool(environment_record.hasBinding(name, this.record));
};

DeclarativeLexicalEnvironment.prototype.getBindingValue = function(name) {
    return compute.just(
        environment_record.getBindingValue(this.record, name));
};

DeclarativeLexicalEnvironment.prototype.setMutableBinding = function(ref, name, value) {
    return ref.setValue(
        this.setRecord(
            environment_record.setMutableBinding(this.record, name, value)));
};

DeclarativeLexicalEnvironment.prototype.putImmutableBinding = function(ref, name, value) {
    return ref.setValue(
        this.setRecord(
            environment_record.putImmutableBinding(this.record, name, value)));
};

DeclarativeLexicalEnvironment.prototype.deleteBinding = function(ref, name) {
    return ref.setValue(
        this.setRecord(
            environment_record.deleteBinding(name, this.record)));
};

/* Object Lexical Environment
 ******************************************************************************/
/**
 * Object Lexical environment.with a given set of bindings 'o' and parent 'outer'.
 * 
 * @param [outer] Reference to enclosing environment.
 * @param [object] Reference to object that stores binding.
 * @param [provideThis] Does the environment provide a this value?
 */
var ObjectLexicalEnvironment = record.extend(LexicalEnvironment, [
    'provideThis'],
    function(outer, object, provideThis) {
        this.outer = outer;
        this.record = object;
        
        this.provideThis = !!provideThis;
        
        this.implicitThisValue = (this.provideThis ?
            compute.just(this.record) :
            undef.UNDEFINED);
    });

ObjectLexicalEnvironment.prototype.hasOwnBinding = function(name) {
    return object.hasProperty(this.record, name);
};

ObjectLexicalEnvironment.prototype.getBindingValue = function(name) {
    return object.get(this.record, name);
};

ObjectLexicalEnvironment.prototype.setMutableBinding = function(ref, name, value) {
    return object.set(this.record, name, value);
};

ObjectLexicalEnvironment.prototype.putImmutableBinding = ObjectLexicalEnvironment.prototype.setMutableBinding;

ObjectLexicalEnvironment.prototype.deleteBinding = function(ref, name) {
    return object.deleteProperty(this.record, name);
};

/* Export
 ******************************************************************************/
return {
    'LexicalEnvironment': LexicalEnvironment,
    
    'DeclarativeLexicalEnvironment': DeclarativeLexicalEnvironment,
    'ObjectLexicalEnvironment': ObjectLexicalEnvironment,

};

});