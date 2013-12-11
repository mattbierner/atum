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
 * @param args Array of arguments to call `f` with.
 */
var Tail = function(f, args) {
    this.f = f;
    this.args = args;
};

var cont = function(f, args) {
    return new Tail(f, args);
};

/**
 * Repeatedly evaluate tail calls until a value is found.
 */
var trampoline = function(f) {
    var value = f;
    while (value instanceof Tail)
        value = value.f.apply(null, value.args);
    return value;
};

/* Export
 ******************************************************************************/
return {
    'cont': cont,
    'Tail': Tail,
    'trampoline': trampoline
};

});