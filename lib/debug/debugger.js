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
var Debugger = function(k, ctx) {
    this.k = k;
    this.ctx = ctx;
};

Debugger.create = function(p, ctx, ok, err) {
    return new Debugger(function() { return function(){ return p(ctx, ok, err); }; }, ctx);
};

Debugger.prototype.step = function() {
    var next = this.k()();
    if (next instanceof debuggable.Debuggable) {
        return new Debugger(next.k, next.ctx);
    }
    return next;
};

Debugger.prototype.run = function(p, ok, err) {
    return interpret.exec(p, this.ctx, ok, err);
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