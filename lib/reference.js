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
    Object.freeze(this);
};

/**
 * Is the reference's base object a primitive value?
 */
Reference.prototype.hasPrimitiveBase = function(v) {
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

/**
 * Does this reference reference a property?
 */
Reference.prototype.isProperty = function(v) {
    return value.type(getBase(v)) === 'object' || hasPrimitiveBase(v);
};

/**
 * Can this reference be not be resolved?
 */
Reference.prototype.isUnresolvable = function(v) {
    return getBase(v) === undefined;
};

/* Errors
 ******************************************************************************/
return {
    'ReferenceError': ReferenceError,
    
    'Reference': Reference
};

});