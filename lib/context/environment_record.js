/**
 * @fileOverview Data structures and operations for creating and manipulating
 * environment records.
 */
define(['hamt',
        'bes/record'],
function(hamt,
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
 * Get the binding for `name` in `record`.
 */
var getBinding = hamt.get;

/**
 * Does the given environment record have a binding for `name`.
 * 
 * @param env Environment record.
 * @param {string} name Binding name to check.
 */
var hasBinding = hamt.has;

/**
 * Does the given environment record have a mutable binding for `name`.
 * 
 * @param env Environment record.
 * @param {string} name Binding name to check.
 */
var hasMutableBinding = function(record, name) {
    return (hasBinding(record, name) && getBinding(name, record).mutable);
};

/**
 * Get the value bound for `name` in `record`.
 */
var getBindingValue = function(record, name) {
    return getBinding(name, record).value;
};

/**
 * Create a new environment record from 'record' with mutable binding for 'n' to 'v'.
 * 
 * @param record Environment record.
 * @param {string} name Binding name
 * @param v Binding value.
 */
var setMutableBinding = function(record, name, v) {
    return hamt.set(
        name,
        Binding.create(v, true),
        record);
};

/**
 * Create a new environment record from 'record' with immutable binding for 'n' to 'v'.
 * 
 * @param record Environment record.
 * @param {string} name Binding name
 * @param v Binding value.
 */
var putImmutableBinding = function(record, name, v) { 
    return hamt.set(
        name,
        Binding.create(v, false),
        record);
};

/**
 * Create a new environment record from `record` with the binding for `name`
 * removed.
 * 
 * @param {string} name Binding name.
 * @param record Environment record.
 */
var deleteBinding = hamt.remove;

/* Export
 ******************************************************************************/
return {
    'empty': hamt.empty,
    
    'hasBinding': hasBinding,
    'hasMutableBinding': hasMutableBinding,

    'getBindingValue': getBindingValue,
    'setMutableBinding': setMutableBinding,
    'putImmutableBinding': putImmutableBinding,
    'deleteBinding': deleteBinding
};

});