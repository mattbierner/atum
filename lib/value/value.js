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
var Value = (function(){
    // TODO: ugly shared var!
    var key = 0;
    
    return function() {
        this.key = key++;
    };
}())

Value.prototype.toString = function() {
    return "{Value type:" + this.type + " value:" + this.value + "}"; 
};

/* Operations
 ******************************************************************************/
var type = function(v) {
    return v.type;
};

/* Export
 ******************************************************************************/
return {
    'Value': Value,

    'type': type
};

});