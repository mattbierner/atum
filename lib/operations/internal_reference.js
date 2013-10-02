/**
 * @fileOverview Implementation level reference computations.
 */
define(['atum/compute',
        'atum/internal_reference'],
function(compute,
        internal_reference){
"use strict";

/* Computations
 ******************************************************************************/
/**
 * Get the value stored for ref.
 */
var getValue = function(ref) {
    return (ref instanceof internal_reference.InternalReference ? 
        ref.getValue() :
        compute.just(ref));
};

/**
 * Get the value stored from the result of c.
 */
var getFrom = function(c) {
    return compute.bind(c, getValue);
};

/**
 * Attempt to dereference a internal reference, continuing execution with the result of `f`.
 * 
 * Calls `f` with unmodified value if `ref` is not an internal reference.
 * 
 * @param ref Potential internal reference.
 * @param f Function called with the dereferenced result and the original reference.
 */
var dereference = function(ref, f) {
    return compute.bind(getValue(ref), function(o) {
        return f(o, ref);
    });
};

/**
 * Attempt to dereference the result of computation `c`.
 * 
 * @see dereference
 */
var dereferenceFrom = function(c, f) {
    return compute.bind(c, function(ref) {
        return dereference(ref, f);
    });
};

/**
 * Sets the value stored for ref value to value.
 * 
 * @param ref Internal reference.
 * @param value New value.
 */
var setValue = function(ref, value) {
    return ref.setValue(value);
};

/**
 * Set ref to `f` called with ref's current value.
 * 
 * @param ref Internal reference to modify.
 * @param f Function mapping current value to new value.
 */
var modifyValue = function(ref, f) {
    return dereference(ref, function(val, ref) {
        return setValue(ref, f(val));
    });
};


/* Export
 ******************************************************************************/
return {
    'getValue': getValue,
    'getFrom': getFrom,
    
    'dereference': dereference,
    'dereferenceFrom': dereferenceFrom,
    
    'modifyValue': modifyValue,
    'setValue': setValue
};

});