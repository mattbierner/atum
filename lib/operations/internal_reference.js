/**
 * @fileOverview Semantics for dealing with language level references.
 */
define(['atum/compute',
        'atum/internal_reference'],
function(compute,
        internal_reference){

/* Computations
 ******************************************************************************/
/**
 * Create computation that gets value stored for ref.
 */
var getValue = function(ref) {
    return compute.bind(ref, function(x) {
        return (x instanceof internal_reference.InternalReference ? 
            x.getValue() :
            compute.always(x));
    });
};

/**
 * Create computation that changes ref's value to result of 'f' called with ref's current value.
 */
var modifyValue = function(ref, f) {
    return compute.bind(ref, function(r) {
         return compute.bind(getValue(compute.always(r)), function(x) {
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

/**
 * 
 */
var getBase = function(v) {
    return compute.Computation('Put Value',
        compute.bind(v, function(x) {
            return (x instanceof internal_reference.InternalReference ? 
                x.getBase() :
                compute.always(x));
        }));
};

/* Export
 ******************************************************************************/
return {
    'getValue': getValue,
    
    'modifyValue': modifyValue,
    
    'setValue': setValue,
    
    'getBase': getBase
};

});