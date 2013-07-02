/**
6 * @fileOverview Record for a debuggable state.
 */
define(['atum/compute',
        'atum/interpret',
        'atum/debug/debuggable',
        'atum/operations/internal_reference',
        'atum/value/value',
        'atum/value/type'],
function(compute,
        interpret,
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
 ******************************************************************************/
var Debugger = function(k, ctx, complete) {
    this.k = k;
    this.ctx = ctx;
    this.complete = complete;
};

Debugger.create = function(p, ctx, ok, err) {
    var pok = function(x, ctx) {
        var c = ok(x, ctx);
        return function() { c(); return new Debugger(x, ctx, true); };
    },
    perr = function(x, ctx) {
        var c = ok(x, ctx);
        return function() { c(); return new Debugger(x, ctx, true); };
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

/**
 * Run a computation p in the captured context. Calls success or failure
 * continuation on completion.
 */
Debugger.prototype.run = function(p, ok, err) {
    return interpret.exec(p, this.ctx, ok, err);
};

Debugger.prototype.getValue = function(val) {
    return this.run(internal_reference.getValue(compute.just(val)), ret, ret);
};

/**
 */
Debugger.prototype.injectValue = function(x) {
    return this.k(x)();
};

/**
 */
Debugger.prototype.injectContext = function(x) {
    return interpret.exec(p, this.ctx, ok, err);
};


/* Export
 ******************************************************************************/
return {
    'Debugger': Debugger
};

});