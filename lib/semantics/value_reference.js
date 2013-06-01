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
var set = function(ir, value) {
    return compute.bind(ir, function(i) {
        return i.setValue(value);
    });
};

/**
 * 
 */
var create = function(initial) {
    return (initial !== undefined ?
        set(create(), initial) :
        compute.always(new value_reference.ValueReference()));
};

/**
 * 
 */
var get = function(v) {
    return compute.Computation('Get Value',
        compute.bind(
            v,
            function(x) {
                return (x instanceof value_reference.ValueReference ?
                    x.getValue() :
                    compute.always(x));
            }));
};


return {
    'create': create,
    'set': set,
    'get': get
};

});