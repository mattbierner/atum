/**
 * @fileOverview Semantics for dealing with implementation level references.
 */
define(['atum/compute',
        'atum/value_reference'],
function(compute,
        value_reference){

/* Computations
 ******************************************************************************/
/**
 */
var create = function() {
    return compute.always(new value_reference.ValueReference());
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