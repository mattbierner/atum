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
 * Create computation that gets value stored for ref.
 */
var getValue = function(ref) {
    return compute.bind(ref, function(x) {
        return (x instanceof internal_reference.InternalReference ? 
            x.getValue() :
            compute.just(x));
    });
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
    return compute.bind(getValue(compute.just(ref)), function(o) {
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
 * Create computation that changes ref's value to result of 'f' called with ref's current value.
 */
var modifyValue = function(ref, f) {
    return compute.bind(ref, function(r) {
         return compute.bind(getValue(compute.just(r)), function(x) {
            return r.setValue(f(x));
        });
    });
};

/**
 * Create computation that changes ref's value to value.
 */
var setValue = function(ref, value) {
    return compute.bind(value, function(x) {
        return compute.bind(ref, function(r) {
            return r.setValue(x);
        });
    });
};

/* Export
 ******************************************************************************/
return {
    'getValue': getValue,
    
    'dereference': dereference,
    'dereferenceFrom': dereferenceFrom,
    
    'modifyValue': modifyValue,
    'setValue': setValue
};

});