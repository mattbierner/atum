/**
 * @fileOverview Computations for null values.
 */
define(['atum/compute',
        'atum/value/nil'],
function(compute,
        nil) {
"use strict";

/* Operations
 ******************************************************************************/
var create = function() {
    return compute.always(nil.NULL);
};

/* Export
 ******************************************************************************/
return {
    'create': create
};

});