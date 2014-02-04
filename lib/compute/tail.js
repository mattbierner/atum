/**
 * @fileOverview Tail calls
 */
define([],
function() {
"use strict";

/**
 * Tail call.
 * 
 * @param f Function to call.
 */
var Tail = function(f, ctx, k) {
    this.f = f;
    this.ctx = ctx;
    this.k = k;
};

/**
 * Repeatedly evaluate tail calls until a value is found.
 */
var trampoline = function(f) {
    var value = f;
    while (value instanceof Tail)
        value = value.f(value.ctx, value.k);
    return value;
};

/* Export
 ******************************************************************************/
return {
    'Tail': Tail,
    'trampoline': trampoline
};

});