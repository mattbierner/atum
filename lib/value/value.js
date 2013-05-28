/**
 * @fileOverview
 */
define(function() {
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