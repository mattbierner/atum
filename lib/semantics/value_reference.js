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
var setValue = function(ir, value) {
    return compute.bind(ir, function(i) {
        return compute.bind(value, function(x) {
            return i.setValue(x);
        });
    });
};

/**
 * 
 */
var create = function(initial) {
    return (initial !== undefined ?
        setValue(create(), initial) :
        compute.always(new value_reference.ValueReference()));
};

/**
 * 
 */
var getValue = function(v) {
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
    'setValue': setValue,
    'getValue': getValue
};

});