/**
 * @fileOverview Computation state record.
 */
define(['bes/record',
        'hashtrie'],
function(record,
        hashtrie) {
"use strict";

/* Context
 ******************************************************************************/
/**
 * Computation state.
 * 
 * @param values Object that maps keys to values referenced in a computation.
 * @param userData User computation context.
 * @param unique Open unique identifier.
 * @param fail Prompt of enclosing failure computation.
 */
var ComputeContext = record.declare(null, [
    'values',
    'userData',
    'unique',
    'fail']);

/**
 * Empty computation context that stores no values and has no user data.
 */
ComputeContext.empty = ComputeContext.create(hashtrie.empty, null, 1, 0);

/* Export
 ******************************************************************************/
return {
    'ComputeContext': ComputeContext
};

});