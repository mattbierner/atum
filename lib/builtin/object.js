define(['atum/value/object'],
function(object){

var Object = function() {
    
};

Object.prototype = new object.Object;
    
return {
    'Object': Object
};

});