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
 * Computation that concatenates  computations 'a' and 'b' which result in strings values,
 * and returns new string value.
 */
var concat = function(a, b) {
    return compute.binds(
        compute.sequence(a, b),
        function(aResult, bResult) {
            return compute.always(string.concat(aResult, bResult)); 
    });
};

/* Export
 ******************************************************************************/
return {
    'create': create,
    
    'concat': concat
};

});