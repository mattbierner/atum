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

var errorPrototypeRef;
    
/* ErrorPrototype
 ******************************************************************************/
var ErrorPrototype = function(message) {
    
};
ErrorPrototype.prototype = new object.ObjectPrototype;
ErrorPrototype.prototype.constructor = ErrorPrototype;

ErrorPrototype.prototype.proto = object.objectPrototypeRef;
ErrorPrototype.prototype.cls = "Error";

ErrorPrototype.prototype.properties = {
    
};

/* Error
 ******************************************************************************/
/**
 * 
 */
var Error = function() {
    object.Object.call(this);
};
Error.prototype = new object.Object;

Error.prototype.properties = {
    'prototype': {
        'value': errorPrototypeRef,
        'writable': false,
        'enumerable': false,
        'configurable': false
    }
};

Error.prototype.call = function(ref, thisObj, args) {
    return this.construct(args);
};

Error.prototype.construct = function(args) {
    return value_reference.create(new ErrorPrototype(args[0]));
};

/* Export
 ******************************************************************************/
return {
    'Error': Error,
    'ErrorPrototype': ErrorPrototype
};

});