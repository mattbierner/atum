/**
 * @fileOverview Semantics for dealing with language level references.
 */
define(['atum/compute',
        'atum/reference'],
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
            return (!(x instanceof reference.Reference) ?
                compute.always(x) :
                x.dereference());
        }));
};

/**
 * 
 */
var putValue = function(value, w) {
    return compute.Computation('Put Value',
        compute.bind(value, function(x) {
            return (!x instanceof reference.Reference ?
                compute.never(new reference.ReferenceError()) :
                x.set(w));
        }));
};

/* Export
 ******************************************************************************/
return {
    'getValue': getValue,
    'putValue': putValue
};

});