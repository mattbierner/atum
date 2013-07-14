/**
 * @fileOverview Undefined value computations.
 */
define(['atum/compute',
        'atum/value/undef'],
function(compute,
        undef) {
"use strict";

/* Creation
 ******************************************************************************/
/**
 * Create a undefined value.
 */
var create = function() {
    return compute.just(undef.UNDEFINED);
};

/* Export
 ******************************************************************************/
return {
    'create': create
};

});