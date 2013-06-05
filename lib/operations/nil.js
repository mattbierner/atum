/**
 * @fileOverview Computations for null value.
 */
define(['atum/compute',
        'atum/value/nil'],
function(compute,
        nil) {
"use strict";

var create = function() {
    return compute.always(new nil.Null());
};

/* Export
 ******************************************************************************/
return {
    'create': create
};

});