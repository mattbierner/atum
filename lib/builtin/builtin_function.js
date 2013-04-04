define(['atum/value/func',
        'atum/value/object'],
function(func,
        object){
//"use strict";
//var proto = 

    
var BuiltinFunction = function(id, call) {
    this.call = call;
    this.id = id;
};

BuiltinFunction.prototype = new func.Function;


return {
    'BuiltinFunction': BuiltinFunction
};

});