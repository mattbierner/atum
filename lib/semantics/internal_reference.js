/**
 * @fileOverview Semantics for dealing with language level references.
 */
define(['atum/compute',
        'atum/internal_reference',
        'atum/semantics/reference'],
function(compute,
        internal_reference,
        reference_semantics){

/* Computations
 ******************************************************************************/
/**
 * Create computation that gets value stored for ref.
 */
var getValue = function(ref) {
    return compute.bind(ref, function(x) {
        return (x instanceof internal_reference.InternalReference ? 
            x.getValue() :
            (console.log(x) , compute.never("sd")));
    });
};

/**
 * Create computation that changes ref's value to result of 'f' called with ref's current value.
 */
var modifyValue = function(ref, f) {
    return compute.bind(ref, function(r) {
         return compute.bind(getValue(compute.always(r)), function(x) {
            return r.setValue(compute.always(f(x)));
        });
    });
};

/**
 * Create computation that changes ref's value to value.
 */
var setValue = function(ref, value) {
    return modifyValue(ref, function() { return value; });
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