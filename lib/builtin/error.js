/**
 * @fileOverview
 */
define(['atum/compute',
        'atum/builtin/object'
        'atum/value/type',
        'atum/value/value',
        'atum/operations/value_reference'],
function(compute,
        object,
        type,
        value,
        value_reference){
//"use strict";

/* ErrorPrototype
 ******************************************************************************/
var ErrorPrototype = function() {
    
};
ErrorPrototype.prototype = new object.ObjectPrototype;
ErrorPrototype.prototype.constructor = ErrorPrototype;
ErrorPrototype.prototype.cls = "Error";


/* Function
 ******************************************************************************/
/**
 * 
 */
var Error = function() {
    object.Object.call(this);
};

Error.prototype = new object.Object;



/* Export
 ******************************************************************************/
return {
    'Error': Error,
    'ErrorPrototype': ErrorPrototype
};

});