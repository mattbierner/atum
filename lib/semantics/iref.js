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


return {
    'create': create
};

});