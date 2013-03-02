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


/* Operations
 ******************************************************************************/
/**
 * Joins two strings into a new string.
 */
var concat = function(a, b) {
    return new String(a.value + b.value);
};

/* Export
 ******************************************************************************/
return {
    'String': String,
    
    'concat': concat
};

});