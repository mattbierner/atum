/**
 * 
 */
define(['atum/value/object'],
function(object){
//"use strict";
//var proto = 

    
var BuiltinFunction = function(id, call) {
    this.call = call;
    this.id = id;
};

BuiltinFunction.prototype = new object.Object;


return {
    'BuiltinFunction': BuiltinFunction
};

});