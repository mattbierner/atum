/**
 * @fileOverview
 */
define(['bes/record',
        'atum/value/type'],
function(record,
        types) {
"use strict";

/* Value
 ******************************************************************************/
/**
 * Base class for a primitive value in the interpreted language.
 */
var Value = record.declare(null, []);

Value.prototype.toString = function() {
    return "{" + this.type + " " + this.value + "}"; 
};

/* Operations
 ******************************************************************************/
var isType = function(t) {
    return function(x) {
        return (x.type === t);
    };
};

var isBoolean = isType(types.BOOLEAN);

var isNull = isType(types.NULL);

var isNumber = isType(types.NUMBER);

var isObject = isType(types.OBJECT);

var isString = isType(types.STRING);

var isUndefined = isType(types.UNDEFINED);

var isPrimitive = function(x) {
    return !isObject(x);
};

var isCallable = function(v) {
    switch(v.type) {
    case types.OBJECT: return !!v.call;
    default:                return false;
    }
};

/* Export
 ******************************************************************************/
return {
    'Value': Value,

    'isBoolean': isBoolean,
    'isNull': isNull,
    'isNumber': isNumber,
    'isObject': isObject,
    'isString': isString,
    'isUndefined': isUndefined,
    'isPrimitive': isPrimitive,
    
    'isCallable': isCallable
};

});