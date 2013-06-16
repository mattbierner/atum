/**
 * @fileOverview Computations for undefined valued.
 */
define(['atum/compute',
        'atum/value/undef'],
function(compute,
        undef) {
"use strict";

/* Operations
 ******************************************************************************/
var create = function() {
    return compute.always(undef.UNDEFINED);
};

/* Export
 ******************************************************************************/
return {
    'create': create
};

});