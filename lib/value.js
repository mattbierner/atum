define(function() {
"use strict";

var Value = function(type, value) {
    this.type = type;
    this.value = value;
};

Value.prototype.toString = function() {
    return "{Value type:" + this.type + " value:" + this.value + "}"; 
};

var type = function(v) {
    return v.type;
};


return {
    'Value': Value,
    'type': type
};

});