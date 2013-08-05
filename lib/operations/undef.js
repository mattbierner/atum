/**
 * @fileOverview Undefined value computations.
 */
define(['atum/compute',
        'atum/value/undef'],
function(compute,
        undef) {
"use strict";

/* Constants
 ******************************************************************************/
/**
 * Hosted language undefined value.
 */
var UNDEFINED = compute.just(undef.UNDEFINED);

/* Export
 ******************************************************************************/
return {
    'UNDEFINED': UNDEFINED
};

});