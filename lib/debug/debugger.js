/**
6 * @fileOverview Record for a debuggable state.
 */
define(['atum/compute',
        'atum/debug/debuggable',
        'atum/operations/internal_reference',
        'atum/value/value',
        'atum/value/type'],
function(compute,
        debuggable,
        internal_reference,
        value,
        type) {
//"use strict";

/**
 * 
 */
var ret = function(x, ctx) {
    return function() {
        return x;
    };
};

/**
 * 
 */
var thr = function(x, ctx) {
    return function() {
        throw x;
    };
};

/* Debugger
 * TODO: merge all step operations to generic step with delegate.
 ******************************************************************************/
var Debugger = function(k, ctx, complete) {
    this.k = k;
    this.ctx = ctx;
    this.complete = complete;
    this.depth = (ctx.userData ? ctx.userData.stack.length : 0);
};

Debugger.create = function(p, ctx, ok, err) {
    var pok = function(x, ctx) {
        var c = ok(x, ctx);
        return function() { return new Debugger(c(), ctx, true); };
    },
    perr = function(x, ctx) {
        var c = err(x, ctx);
        return function() { return new Debugger(c(), ctx, true); };
    };
    return new Debugger(function() { return function(){ return p(ctx, pok, perr); }; }, ctx);
};

Debugger.prototype.step = function() {
    var next = this.k()();
    if (next instanceof debuggable.Debuggable) {
        return new Debugger(next.k, next.ctx);
    } else {
        return next();
    }
};

Debugger.prototype.finish = function() {
    var next = this.step();
    while (!next.complete)
        next = next.step();
    return next;
};

Debugger.prototype.stepOver = function() {
    var next = this.step();
    while (!next.complete && next.depth > this.depth)
        next = next.step();
    return next;
};

Debugger.prototype.stepOut = function() {
    var next = this.step();
    while (!next.complete && next.depth > this.depth) {
        next = next.step();
        console.log(next.depth);
    }
    return next;
};

/**
 * Run a computation p in the captured context. Calls success or failure
 * continuation on completion.
 */
Debugger.prototype.run = function(p, ok, err) {
    return p(this.ctx, ok, err);
};

Debugger.prototype.getValue = function(val) {
    return this.run(internal_reference.getValue(compute.just(val)), ret, ret);
};


/* Export
 ******************************************************************************/
return {
    'Debugger': Debugger
};

});