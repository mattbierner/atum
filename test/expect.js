define(['atum/compute',
        'atum/interpret'],
function(compute,
        interpret){
"use strict";


var Result = function(isError, value, ctx) {
    this.isError = isError;
    this.value = value;
    this.ctx = ctx;
};

Result.prototype.run = function(node) {
    return interpret.evaluate(node)(this.ctx,
        function(x, ctx){ return new Result(false, x, ctx); },
        function(x, ctx){ return new Result(true, x, ctx); });
};


var run = function(root) {
    return interpret.evaluate(root)(compute.ComputeContext.empty,
        function(x, ctx){ return new Result(false, x, ctx); },
        function(x, ctx){ return new Result(true, x, ctx); });
};

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
    'Result': Result,
    
    'run': run,
    
    'type': type,
};

});