/**
 * @fileOverview Implementation level reference computations.
 */
define(['atum/compute',
        'atum/value_reference'],
function(compute,
        value_reference){
"use strict";

/* Creation
 ******************************************************************************/
/**
 * Create a new value reference.
 * 
 * @param [initial] Value to store in new reference.
 */
var create = function(initial) {
    return setValue(
        compute.just(new value_reference.ValueReference()),
        compute.just(initial));
};

/**
 * Create a new value reference, storing the result of computation p as the
 * initial value.
 */
var from = function(p) {
    return compute.bind(p, create);
};

/**
 * Create a new value reference from an existing reference.
 */
var forReference = function(ref) {
    return compute.just(new value_reference.ValueReference(ref));
};

/* Operations
 ******************************************************************************/
/**
 * Attempt to dereference a value reference.
 *
 * Returns the input if `ref` is not a value reference.
 *
 * @param ref Potential value reference
 */
var getValue = function(ref) {
    return (ref instanceof value_reference.ValueReference ?
        ref.getValue() :
        compute.just(ref));
};

/**
 * Dereference the result of a computation.
 *
 * @param c Computation resulting in value reference to dereference.
 */
var getFrom = function(c) {
    return compute.bind(c, getValue);
};

/**
 * 
 */
var dereference = function(ref, f) {
    return compute.bind(getValue(ref), function(o) {
        return f(o, ref);
    });
};

var dereferenceFrom = function(c, f) {
    return compute.bind(c, function(ref) {
        return dereference(ref, f);
    });
};


/**
 * 
 */
var modifyValue = function(ref, f) {
    return compute.bind(ref, function(r) {
        return compute.bind(r.getValue(), function(x) {
            return r.setValue(f(x));
        });
    });
};

/**
 * 
 */
var setValue = function(ref, value) {
    return compute.bind(value, function(x){
        return modifyValue(ref, function(){ return x; });
    });
};

/* Export
 ******************************************************************************/
return {
// Creation
    'create': create,
    'from': from,
    'forReference': forReference,
    
// Operations
    'getValue': getValue,
    'getFrom': getFrom,
    
    'dereference': dereference,
    'dereferenceFrom': dereferenceFrom,
    
    'modifyValue': modifyValue,
    'setValue': setValue
};

});