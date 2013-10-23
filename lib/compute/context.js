/**
 * @fileOverview
 */
define(['amulet/record'],
function(record) {
"use strict";

/* Context
 ******************************************************************************/
/**
 * A computation state.
 * 
 * @param values Object that maps keys to values referenced in a computation.
 * @param userData User computation context.
 * @param now Current time of the context.
 * @param prompt Index of current prompt.
 */
var ComputeContext = record.declare(null, [
    'values',
    'userData',
    'now',
    'prompt',
    'fail']);

/**
 * Empty computation context that stores no values and has no user data.
 */
ComputeContext.empty = new ComputeContext({}, null, null, 1, null);

/* Export
 ******************************************************************************/
return {
    'ComputeContext': ComputeContext
};

});