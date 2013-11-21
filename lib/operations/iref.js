/**
 * @fileOverview
 */
define(['atum/compute',
        'atum/iref'],
function(compute,
        iref){

/* Creation
 ******************************************************************************/
/**
 * Create a computation that dereferences the result of computation 'v'.
 */
var create = function(value) {
    return compute.bind(compute.unique, function(key) {
        return iref.Iref.create(key).setValue(value);
    });
};

/* Export
 ******************************************************************************/
return {
    'create': create
};

});