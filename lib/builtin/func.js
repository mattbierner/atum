define(['atum/value/func', 'atum/value/object'],
function(func, object){

//var proto = 
    
var Function = function() {
    
};
Function.prototype = new func.Function;

return {
    'Function': Function
};

});