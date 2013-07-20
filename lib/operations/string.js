/**
 * @fileOverview String computations.
 */
define(['atum/compute',
        'atum/value/string'],
function(compute,
        string) {
"use strict";

var reduce = Function.prototype.call.bind(Array.prototype.reduce);

/* Creation
 ******************************************************************************/
/**
 * Create a new hosted string.
 * 
 * @param {string} x Host value to store in string.
 */
var create = function(x) {
    return compute.just(new string.String(x));
};

/* Operations
 ******************************************************************************/
/**
 * Concatenates `l` and `l` into a new hosted string.
 * 
 * @param l Computation resulting in string value.
 * @param r Computation resulting in string value.
 */
var concat = function(/*...*/) {
    return reduce(arguments, function(p, c) {
         return compute.binary(p, c, function(lVal, rVal) {
            return compute.just(string.concat(lVal, rVal)); 
        });
    }, create(""));
   
};

/* Export
 ******************************************************************************/
return {
// Creation
    'create': create,
    
// Operations
    'concat': concat
};

});