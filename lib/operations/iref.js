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
    var ref = iref.Iref.create();
    return (value ?
        compute.bind(value, function(x) {
            return ref.setValue(x);
        }) :
        compute.just(ref));
};

/* Export
 ******************************************************************************/
return {
    'create': create
};

});