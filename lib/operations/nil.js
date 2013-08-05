/**
 * @fileOverview Null value computations.
 */
define(['atum/compute',
        'atum/value/nil'],
function(compute,
        nil) {
"use strict";

/* Constants
 ******************************************************************************/
/**
 * Hosted language null value.
 */
var NULL = compute.just(nil.NULL);

/* Export
 ******************************************************************************/
return {
    'NULL': NULL
};

});