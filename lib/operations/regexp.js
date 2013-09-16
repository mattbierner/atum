/**
 * @fileOverview String computations.
 */
define(['atum/compute',
        'atum/value/regexp'],
function(compute,
        regexp) {
"use strict";

/* Creation
 ******************************************************************************/
/**
 * Create a new hosted string.
 * 
 * @param {string} x Host value to store in string.
 */
var create = function(value) {
    return compute.just(new regexp.RegExp(value));
};

/* Export
 ******************************************************************************/
return {
// Creation
    'create': create
};

});