/**
 * @fileOverview
 */
define(['atum/compute',
        'atum/value/value'],
function(compute,
        value) {
//"use strict";
    
/* String
 ******************************************************************************/
var String = function(v) {
    value.Value.call(this, 'string', v);
};
String.prototype = new value.Value;

/* Operation Computations
 ******************************************************************************/
var concat = function(a, b) {
    return compute.bind(a, function(aResult) {
        return compute.bind(b, function(bResult) {
            return compute.always(new String(aResult.value + bResult.value));
        }); 
    });
};

/* Export
 ******************************************************************************/
return {
    'String': String,
    
    'concat': concat
};

});