/**
 * @fileOverview Data structures and operations for creating and manipulating
 * environment records.
 */
define(['amulet/object',
        'atum/reference',
        'atum/value/undef'],
function(amulet_object,
        reference,
        undef) {
"use strict";

/* Binding
 ******************************************************************************/
/**
 * Binding in an environment.
 * 
 * @param value Value bound.
 * @param mutable Is the binding mutable.
 */
var Binding = function(value, mutable) {
    this.value = value;
    this.mutable = mutable;
};

Binding.prototype.toString = function() {
    return "{" + (this.mutable ? "{MutableBinding" : "ImmutableBinding") + " " + this.value + "}";
};

/* Environment Record
 ******************************************************************************/
/**
 * Does the given environment record have a binding for `name`.
 * 
 * @param env Environment record.
 * @param {string} name Binding name to check.
 */
var hasBinding = function(record, name) {
    return !!(record && record.hasOwnProperty(name) && record[name]);
};

/**
 * Does the given environment record have a mutable binding for `name`.
 * 
 * @param env Environment record.
 * @param {string} name Binding name to check.
 */
var hasMutableBinding = function(record, name) {
    return !!(hasBinding(record, name) && getBinding(record, name).mutable);
};

/**
 * Return the binding for 'name' in 'record'
 */
var getBinding = function(record, name) {
    return record[name];
};

/**
 * Return bound value for 'name' in 'record'
 */
var getBindingValue = function(record, name) {
    return getBinding(record, name).value;
};

/**
 * Create a new environment record from 'record' with mutable binding for 'n' to 'v'.
 * 
 * @param record Environment record.
 * @param {string} name Binding name
 * @param v Binding value.
 */
var setMutableBinding = function(record, name, v) {
    return amulet_object.defineProperty(record, name, {
        'value': new Binding(v, true),
        'enumerable': true
    });
};

/**
 * Create a new environment record from 'record' with immutable binding for 'n' to 'v'.
 * 
 * @param record Environment record.
 * @param {string} name Binding name
 * @param v Binding value.
 */
var putImmutableBinding = function(record, name, v) { 
    return amulet_object.defineProperty(record, name, {
        'value': new Binding(v, false),
        'enumerable': true
    });
};

/**
 * Create a new environment record from 'record' with the binding for 'name'
 * removed.
 */
var deleteBinding = function(record, name) {
     return amulet_object.deleteProperty(record, name);
};

/* Export
 ******************************************************************************/
return {
// Environment Record
    'hasBinding': hasBinding,
    'hasMutableBinding': hasMutableBinding,
    'getBinding': getBinding,
    'getBindingValue': getBindingValue,
    'setMutableBinding': setMutableBinding,
    'putImmutableBinding': putImmutableBinding,
    'deleteBinding': deleteBinding
};

});