define(['atum/compute',
        'atum/interpret',
        'atum/semantics/program'],
function(compute,
        interpret,
        program){
"use strict";


var Result = function(isError, value, ctx) {
    this.isError = isError;
    this.value = value;
    this.ctx = ctx;
};

Result.prototype.run = function(node) {
    return interpret.interpret(node, this.ctx,
        function(x, ctx){ return function(){ return new Result(false, x, ctx); }; },
        function(x, ctx){ return function(){ return new Result(true, x, ctx); }; });
};

Result.prototype.equal = function(expr, expected, msg) {
    assert.equal(this.run(expr).value, expected, msg);
    return this;
};

Result.prototype.type = function(expr, t, v) {
    type(t, v)(this.run(expr).value.value);
    return this;
};

var run = function(root) {
    return interpret.interpret(root, compute.ComputeContext.empty,
        function(x, ctx){ return function(){ return new Result(false, x, ctx); }; },
        function(x, ctx){ return function(){ return new Result(true, x, ctx); }; });
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