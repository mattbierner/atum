/**
6 * @fileOverview Record for a debuggable state.
 */
define(['atum/compute',
        'atum/compute/tail',
        'atum/debug/debuggable',
        'atum/operations/internal_reference',
        'atum/operations/value_reference',
        'atum/value/value',
        'atum/value/type'],
function(compute,
        tail,
        debuggable,
        internal_reference,
        value_reference,
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

/* Step policies
 ******************************************************************************/
var stepToCompletion = function(current, next) {
    return !next.complete;
};

var stepOver = function(current, next) {
    return !next.complete && next.depth > current.depth;
};

var stepOut = function(current, next) {
    return !next.complete && next.depth >= current.depth
};

/* Debugger
 ******************************************************************************/
var Debugger = function(dgr, k, ctx, complete) {
    this.dgr = dgr;
    this.k = k;
    this.ctx = ctx;
    this.complete = complete;
    this.depth = (ctx.userData ? ctx.userData.metadata.stack.length : 0);
};

Debugger.create = function(p, ctx, ok, err) {
    var pok = function(x, ctx) {
        return new Debugger(null, ok(x, ctx), ctx, true);
    },
    perr = function(x, ctx) {
        return new Debugger(null, err(x, ctx), ctx, true); 
    };
    return new Debugger(null, function() { return p(ctx, pok, perr); }, ctx, false);
};


/**
 * Run computation `p` in the captured context. Calls success or failure
 * continuation on completion.
 */
Debugger.prototype.run = function(p, ok, err) {
    return tail.trampoline(compute.run(p)(this.ctx, ok, err));
};

Debugger.prototype.getValue = function(val, ok, err) {
    return this.run(
        value_reference.getFrom(
            internal_reference.getValue(val)),
        ok,
        err);
};

Debugger.prototype.step = function() {
    var next = tail.trampoline(this.k(null, this.ctx));
    if (next instanceof debuggable.Debuggable)
        return new Debugger(next, next.k, next.ctx);
    return next;
};

Debugger.prototype.stepWhile = function(pred) {
    if (this.complete)
        return this;
    
    var next = this;
    do {
        next = next.step();
    } while (pred(this, next));
    return next;
};

Debugger.prototype.finish = function() {
    return this.stepWhile(stepToCompletion);
};

Debugger.prototype.stepOver = function() {
    return this.stepWhile(stepOver);
};

Debugger.prototype.stepOut = function() {
    return this.stepWhile(stepOut);
};

Debugger.prototype.stepToDebugger = function() {
    return this.stepWhile(function(current, next) {
        return !next.complete && !(next.dgr instanceof debuggable.DebuggerDebuggable);
    });
};


/* Export
 ******************************************************************************/
return {
    'Debugger': Debugger
};

});