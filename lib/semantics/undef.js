/**
 * @fileOverview Computations for boolean value.
 */
define(['atum/compute',
        'atum/value/undef'],
function(compute,
        undef) {
//"use strict";

var create = function() {
    return compute.always(new undef.Undefined());
};

/* Export
 ******************************************************************************/
return {
    'create': create
};

});