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
var cont = function(f, args) {
    var c = [f, args];
    c._next = true;
    return c;
};

/**
 * Repeatedly evaluate tail calls until a value is found.
 */
var trampoline = function(f) {
    var value = f;
    while (value && value._next)
        value = value[0].apply(undefined, value[1]);
    return value;
};

/* Export
 ******************************************************************************/
return {
    'cont': cont,
    'trampoline': trampoline
};

});