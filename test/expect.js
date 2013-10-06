define(['atum/compute',
        'atum/interpret',
        'atum/semantics/semantics',
        'atum/builtin/impl/global'],
function(compute,
        interpret,
        semantics,
        global){
//"use strict";

var Context = function(parent, value, ctx) {
    this.parent = parent;
    this.value = value;
    this.ctx = ctx;
};

Context.prototype.equal = function(f, expected, msg) {
    assert.equal(f(this.value), expected, msg);
    return this;
};

Context.prototype.type = function(t, v) {
    if (arguments.length > 1) {
        return this
            .equal(function(x) { return x.type; }, t)
            .equal(function(x) { return x.value; }, v);
    }
    return this
        .equal(function(x) { return x.type; }, t);
};

Context.prototype.test = function(/*...*/) {
    return this.parent.test.apply(this.parent, arguments);
};

Context.prototype.testResult = function(/*...*/) {
    return this.parent.testResult.apply(this.parent, arguments);
};

var Result = function(isError, value, ctx) {
    this.error = isError;
    this.value = value;
    this.ctx = ctx;
};

Result.prototype.run = function(node) {
    return interpret.complete(
        compute.bind(semantics.mapSemantics(node), compute.dispatch),
        this.ctx,
        function(x, ctx){ return function(){ return new Result(false, x, ctx); }; },
        function(x, ctx){ return function(){ return new Result(true, x, ctx); }; });
};

Result.prototype.equal = function(expr, expected, msg) {
    assert.equal(this.run(expr).value, expected, msg);
    return this;
};

Result.prototype.test = function(expr) {
    return new Context(this, this.run(expr).value.value);
};

Result.prototype.testResult = function() {
    return new Context(this, this.value);
};

Result.prototype.type = function(expr, t, v) {
    type(t, v)(this.run(expr).value.value);
    return this;
};

Result.prototype.isError = function() {
    assert.ok(this.error);
    return this;
};

var globalCtx = interpret.complete(
    compute.sequence(
        global.enterGlobal(),
        global.initialize(),
        compute.computeContext),
    compute.ComputeContext.empty,
    function(x) { return function(){ return x }; },
    function(x) { return function(){ return x }; });

var run = function(root) {
    return interpret.complete(
        compute.bounce(semantics.programBody(semantics.sourceElements(root.body))),
        globalCtx,
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