define(['atum/compute', 'atum/value'],
function(compute, value) {
//"use strict";
    
/* Boolean
 ******************************************************************************/
var Boolean = function(v) {
    value.Value.call(this, 'boolean', v);
};
Boolean.prototype = new value.Value;


/* Boolean
 ******************************************************************************/
var logicalNot = function(argument) {
    return compute.bind(argument, function(oldValue) {
        return compute.always(new Boolean(!oldValue.value));
    });
};

/* Export
 ******************************************************************************/
return {
    'Boolean': Boolean,
    
    'logicalNot': logicalNot
};

});