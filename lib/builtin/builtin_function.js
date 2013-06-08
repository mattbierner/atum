/**
 * 
 */
define(['atum/value/object',
        'atum/builtin/func'],
function(object,
        func){
//"use strict";

var BuiltinFunction = function(id, call) {
    this.call = call;
    this.id = id;
};

BuiltinFunction.prototype = new func.Function;


return {
    'BuiltinFunction': BuiltinFunction
};

});