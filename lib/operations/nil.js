/**
 * @fileOverview Null computations.
 */
define(['atum/compute',
        'atum/value/nil'],
function(compute,
        nil) {
"use strict";

/* Creation
 ******************************************************************************/
/**
 * Create a hosted language null value.
 */
var create = function() {
    return compute.just(nil.NULL);
};

/* Export
 ******************************************************************************/
return {
    'create': create
};

});