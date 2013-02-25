define(['atum/compute', 'atum/value'],
function(compute, value) {
//"use strict";

/* Undefined
 ******************************************************************************/
/**
 * 
 */
var Undefined = function() {
    value.Value.call(this, "undefined");
};
Undefined.prototype = new value.Value;


/* Export
 ******************************************************************************/
return {
    'Undefined': Undefined,
};

});