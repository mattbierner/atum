/**
 * 
 */
define(['atum/value/value'],
function(value) {
//"use strict";

/* Errors
 ******************************************************************************/
var ReferenceError = function(message) {
    this.message = message;
};

ReferenceError.prototype.toString = function() {
    return "ReferenceError: " + this.message;
};

/* 
 ******************************************************************************/
/**
 * Reference object.
 */
var Reference = function(name, base, strict) {
    this.name = name;
    this.base = base;
    this.strict = strict;
    
    switch (value.type(base))
    {
    case 'boolean':
    case 'string':
    case 'number':
        this.hasPrimitiveBase = true;
        break;
    default:
        this.hasPrimitiveBase = false;
        break;
    }
    this.isUnresolvable = (base === undefined);
    this.isProperty = (value.type(base) === 'object' || this.hasPrimitiveBase);
    Object.freeze(this);
};

/* Errors
 ******************************************************************************/
return {
    'ReferenceError': ReferenceError,
    
    'Reference': Reference
};

});