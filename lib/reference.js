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
 * Function that takes one parameter, a computation 'x', and returns a computation
 * that stores result of 'x' in the reference and yields result of 'x'.
 */
Reference.prototype.setValue = null;

/* Export
 ******************************************************************************/
return {
    'Reference': Reference
};
});