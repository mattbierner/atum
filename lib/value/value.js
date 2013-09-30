/**
 * @fileOverview
 */
define(['atum/value/type'],
function(types) {
"use strict";

/* Value
 ******************************************************************************/
/**
 * Base class for a primitive value in the interpreted language.
 */
var Value = function() { };

Value.prototype.toString = function() {
    return "{" + this.type + " " + this.value + "}"; 
};

/* Operations
 ******************************************************************************/
/**
 * 
 */
var type = function(v) {
    return v.type;
};

var isType = function(t) {
    return function(x) {
        return (type(x) === t);
    };
};

var isBoolean = isType(types.BOOLEAN);

var isNull = isType(types.NULL);

var isNumber = isType(types.NUMBER);

var isObject = isType(types.OBJECT);

var isString = isType(types.STRING);

var isUndefined = isType(types.UNDEFINED);

var isCallable = function(v) {
    switch(type(v)) {
    case types.OBJECT: return !!v.call;
    default:                return false;
    }
};

/* Export
 ******************************************************************************/
return {
    'Value': Value,

    'type': type,
    'isBoolean': isBoolean,
    'isNull': isNull,
    'isNumber': isNumber,
    'isObject': isObject,
    'isString': isString,
    'isUndefined': isUndefined,
    
    'isCallable': isCallable
};

});