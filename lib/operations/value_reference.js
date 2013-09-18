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
 * @param ref Value Reference
 */
var getValue = function(ref) {
    return (ref instanceof value_reference.ValueReference ?
        ref.getValue() :
        compute.just(ref));
};

/**
 * Attempt to dereference a value reference.
 *
 * @param c Computation that may result in a value reference to be dereferences.
 */
var getFrom = function(c) {
    return compute.bind(c, getValue);
};

var dereference = function(c, f) {
    return compute.bind(c, function(ref) {
        return compute.bind(getFrom(compute.just(ref)), function(o) {
            return f(ref, o);
        });
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
    'modifyValue': modifyValue,
    'setValue': setValue
};

});