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
 * 
 */
var getValue = function(ref) {
    return compute.Computation('Get Value',
        compute.bind(ref, function(x) {
            return (x instanceof value_reference.ValueReference ?
                x.getValue() :
                compute.just(x));
        }));
};

var modifyValue = function(ref, f) {
    return compute.bind(ref, function(r) {
        return (r instanceof value_reference.ValueReference ?
            compute.bind(r.getValue(), function(x) {
                return r.setValue(f(x));
            }) :
            compute.error(null));
    });
};

/**
 */
var setValue = function(ref, value) {
    return compute.bind(value, function(x){
        return modifyValue(ref, function(){ return x; });
    });
};

/**
 * 
 */
var create = function(initial) {
    return (initial !== undefined ?
        setValue(create(), compute.just(initial)) :
        compute.just(new value_reference.ValueReference()));
};

/* Export
 ******************************************************************************/
return {
    'create': create,
    'modifyValue': modifyValue,
    'setValue': setValue,
    'getValue': getValue
};

});