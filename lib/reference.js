/**
 * @fileOverview Interface for reference objects.
 */
define(['atum/compute'],
function(compute) {
"use strict";

/* Reference
 ******************************************************************************/
/**
 * Interface / abstract base class for references.
 */
var Reference = function() { };

Reference.prototype.getValue = null;
Reference.prototype.setValue = null;
Reference.prototype.getBase = null;

/* Export
 ******************************************************************************/
return {
    'Reference': Reference
};
});