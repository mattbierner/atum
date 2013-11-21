/**
 * @fileOverview Computation state record.
 */
define(['amulet/record'],
function(record) {
"use strict";

/* Context
 ******************************************************************************/
/**
 * Computation state.
 * 
 * @param values Object that maps keys to values referenced in a computation.
 * @param userData User computation context.
 * @param now Current time of the context.
 * @param prompt Index of current prompt.
 * @param fail Prompt of enclosing failure computation.
 * @param uniqe Open unique identifier.
 */
var ComputeContext = record.declare(null, [
    'values',
    'userData',
    'now',
    'prompt',
    'fail',
    'unique']);

/**
 * Empty computation context that stores no values and has no user data.
 */
ComputeContext.empty = ComputeContext.create({}, null, null, 1, null, 0);

/* Export
 ******************************************************************************/
return {
    'ComputeContext': ComputeContext
};

});