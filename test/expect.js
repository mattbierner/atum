define([],
function(){
"use strict";

var type = function(t, v) {
    return (arguments.length > 1 ?
        function(result) {
            assert.equal(result.type, t);
            assert.equal(result.value, v);
        } :
        function(result) {
            assert.equal(result.type, t);
        });
};

return {
    'type': type,
};
});