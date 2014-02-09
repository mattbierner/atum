/**
 * @fileOverview Data structures and operations for creating and manipulating
 * environment records.
 */
define(['bes/object',
        'bes/record'],
function(bes_object,
        record) {
"use strict";

/* Binding
 ******************************************************************************/
/**
 * Environment binding.
 * 
 * @param value Value bound.
 * @param mutable Is the binding mutable?
 */
var Binding = record.declare(null,[
    'value',
    'mutable']);

/* Environment Record
 ******************************************************************************/
/**
 * Does the given environment record have a binding for `name`.
 * 
 * @param env Environment record.
 * @param {string} name Binding name to check.
 */
var hasBinding = function(record, name) {
    return !!(record && record[name]);
};

/**
 * Get the binding for `name` in `record`.
 */
var getBinding = function(record, name) {
    return record[name];
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
 * Get the value bound for `name` in `record`.
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
    return bes_object.setProperty(
        record,
        name, 
        Binding.create(v, true),
        true);
};

/**
 * Create a new environment record from 'record' with immutable binding for 'n' to 'v'.
 * 
 * @param record Environment record.
 * @param {string} name Binding name
 * @param v Binding value.
 */
var putImmutableBinding = function(record, name, v) { 
    return bes_object.setProperty(
        record,
        name,
        Binding.create(v, false),
        true);
};

/**
 * Create a new environment record from `record` with the binding for `name`
 * removed.
 * 
 * @param record Environment record.
 * @param {string} name Binding name.
 */
var deleteBinding = bes_object.deleteProperty;

/* Export
 ******************************************************************************/
return {
    'hasBinding': hasBinding,
    'hasMutableBinding': hasMutableBinding,
    'getBinding': getBinding,
    'getBindingValue': getBindingValue,
    'setMutableBinding': setMutableBinding,
    'putImmutableBinding': putImmutableBinding,
    'deleteBinding': deleteBinding
};

});