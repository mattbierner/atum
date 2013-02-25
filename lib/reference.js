/**
 * 
 */
define(['atum/compute',
        'atum/value',
        'atum/type_conversion'],
function(compute,
        value,
        type_conversion) {
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
var Reference = function(name, base, strictReference) {
    this.name = name;
    this.base = base;
    this.strictReference = strictReference;
    Object.freeze(this);
};

var getBase = function(v) {
    return v.base;
};

var getReferencedName = function(v) {
    return v.name;
};

var isStrictReference = function(v) {
    return v.strictReference;
};

var hasPrimitiveBase = function(v) {
    switch (value.type(getBase(v)))
    {
    case 'boolean':
    case 'string':
    case 'number':
        return true;
    default:
        return false;
    }
};

var isPropertyReference = function(v) {
    return value.type(getBase(v)) === 'object' || hasPrimitiveBase(v);
};

var isUnresolvableReference = function(v) {
    return getBase(v) === undefined;
};

/* Errors
 ******************************************************************************/
return {
    'Reference': Reference,
    
    'getBase': getBase,
    'getReferenceName': getReferenceName,
    
    'isPropertyReference': isPropertyReference,
    'isUnresolvableReference': isUnresolvableReference,
};

});