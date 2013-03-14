/**
 * @fileOverview
 */
define(function() {
"use strict";

/* Value
 ******************************************************************************/
/**
 * Base class for a value in the interpreted language.
 */
var Value = function() { };

Value.prototype.toString = function() {
    return "{Value type:" + this.type + " value:" + this.value + "}"; 
};

/* Operations
 ******************************************************************************/
/**
 * 
 */
var type = function(v) {
    return v.type;
};

/**
 * 
 */
var isCallable = function(v) {
    switch(type(v)) {
    case 'object':  return !!v.call;
    default:        return false;
    }
};

/* Export
 ******************************************************************************/
return {
    'Value': Value,

    'type': type,
    'isCallable': isCallable
};

});