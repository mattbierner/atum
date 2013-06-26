/**
6 * @fileOverview Record for a debuggable state.
 */
define(['atum/compute',
        'atum/interpret',
        'atum/operations/internal_reference',
        'atum/value/value',
        'atum/value/type'],
function(compute,
        interpret,
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


/* Debuggable
 ******************************************************************************/
var Debugger = function(k) {
    this.k = k;
};

Debugger.prototype.step = function() {
    return new Debugger(this.k.k()());
};


Debugger.prototype.run = function(p, ok, err) {
    return interpret.exec(p, this.k.ctx, ok, err);
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