/**
 * @fileOverview Interface for reference objects.
 */
define(['atum/compute'],
function(compute) {
"use strict";

/* Reference
 ******************************************************************************/
/**
 * Interface / marker class for references.
 */
var Reference = function() { };

/**
 * Function that returns computation that yields value stored in reference.
 */
Reference.prototype.getValue = null;

/**
 * Function that takes one parameter, 'x', and returns a computation
 * that stores 'x' in the reference. Computation yields the reference.
 */
Reference.prototype.setValue = null;

/* Export
 ******************************************************************************/
return {
    'Reference': Reference
};
});