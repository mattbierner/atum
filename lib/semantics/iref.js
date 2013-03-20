/**
 * @fileOverview Semantics for dealing with implementation level references.
 */
define(['atum/compute',
        'atum/reference',
        'atum/iref'],
function(compute,
        reference,
        iref){

/* Computations
 ******************************************************************************/
/**
 */
var create = function() {
    return compute.always(new iref.Iref());
};

/**
 */
var set = function(ir, value) {
    return compute.binda(
        compute.sequence(ir, value),
        function(i, v) {
            return i.set(v);
        });
};


var get = function(v) {
    return compute.Computation('Get Value',
        compute.bind(
            v,
            function(x) {
                return x.dereference();
            }));
};


return {
    'create': create,
    'set': set,
    'get': get
};

});