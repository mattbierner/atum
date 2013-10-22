/**
 * @fileOverview
 */
define([],
function() {
"use strict";

/* Continuation
 ******************************************************************************/
var cont = function(f, args) {
    var c = [f, args];
    c._next = true;
    return c;
};

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