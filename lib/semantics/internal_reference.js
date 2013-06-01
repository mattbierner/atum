/**
 * @fileOverview Semantics for dealing with language level references.
 */
define(['atum/compute',
        'atum/internal_reference'],
function(compute,
        reference){

/* Computations
 ******************************************************************************/
/**
 * Create a computation that dereferences the result of computation 'v'.
 */
var getValue = function(v) {
    return compute.Computation('Get Value',
        compute.bind(v, function(x) {
            return (!(x instanceof reference.InternalReference) ?
                compute.always(x) :
                x.getValue());
        }));
};

/**
 * 
 */
var putValue = function(value, w) {
    return compute.Computation('Put Value',
        compute.bind(value, function(x) {
            return (!(x instanceof reference.InternalReference) ?
                compute.never() :
                x.setValue(w));
        }));
};

/**
 * 
 */
var getBase = function(v) {
    return compute.Computation('Put Value',
        compute.bind(v, function(x) {
            return (x instanceof reference.InternalReference ? 
                x.getBase() :
                compute.always(x));
        }));
};

/* Export
 ******************************************************************************/
return {
    'getValue': getValue,
    'putValue': putValue,
    'getBase': getBase
};

});