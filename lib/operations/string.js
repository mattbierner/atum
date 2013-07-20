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

var empty = compute.just(string.EMPTY);

/* Operations
 ******************************************************************************/
/**
 * Concatenates `l` and `l` into a new hosted string.
 * 
 * @param l Computation resulting in string value.
 * @param r Computation resulting in string value.
 */
var binaryConcat = function(l, r) {
    return compute.binary(l, r, function(lVal, rVal) {
        return compute.just(string.concat(lVal, rVal));
    });
}


/**
 * Concatenates all arguments into a new hosted string.
 */
var concat = function(/*...*/) {
    return reduce(arguments, binaryConcat);
};

/* Export
 ******************************************************************************/
return {
    
// Creation
    'create': create,
    'empty': empty,
    
// Operations
    'concat': concat
};

});