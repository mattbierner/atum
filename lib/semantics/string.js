/**
 * @fileOverview Computations for string values.
 */
define(['atum/compute',
        'atum/value/string'],
function(compute,
        string) {
//"use strict";

/**
 * Computation to create a new string with a given value.
 */
var create = function(value) {
    return compute.always(new string.String(value));
};

/* Operation Computations
 ******************************************************************************/
/**
 * Computation that concatenates  computations 'l' and 'l' which result in strings values,
 * and returns new string value.
 */
var concat = function(l, r) {
    return compute.binary(l, r, function(lVal, rVal) {
        return compute.always(string.concat(lVal, rVal)); 
    });
};

/* Export
 ******************************************************************************/
return {
    'create': create,
    
    'concat': concat
};

});