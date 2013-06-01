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
var getValue = function(ref) {
    return compute.Computation('Get Value',
        compute.bind(ref, function(x) {
            return (!(x instanceof reference.Reference) ?
                compute.never('') :
                x.getValue());
        }));
};

/**
 * Create a computation that dereferences the result of computation 'v'.
 */
var tryGetValue = function(ref) {
    return compute.Computation('Get Value',
        compute.bind(ref, function(x) {
            return (!(x instanceof reference.Reference) ?
                compute.always(x) :
                getValue(compute.always(x)));
        }));
};

/**
 * 
 */
var modifyValue = function(value, w) {
    return compute.Computation('Put Value',
        compute.bind(value, function(x) {
            return (!x instanceof reference.Reference ?
                compute.never("") :
                x.setValue(w));
        }));
};

/**
 * 
 */
var setValue = function(value, w) {
    return compute.Computation('Put Value',
        compute.bind(value, function(x) {
            return (!x instanceof reference.Reference ?
                compute.never("") :
                x.setValue(w));
        }));
};

/* Export
 ******************************************************************************/
return {
    'getValue': getValue,
    'tryGetValue': tryGetValue,
    
    'setValue': setValue
};

});