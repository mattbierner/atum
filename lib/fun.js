/**
 * @fileOverview 
 */
define([],
function(){
"use strict";

/* 
 ******************************************************************************/
var curry = function(f /*, ...*/) {
    return f.bind.apply(f, arguments);
};

var identity = function(x) {
    return x;
};

var constant = function(x) {
    return function() {
        return x;
    };
};

var compose = function(f, g) {
    return function(/*...*/) {
        return f(g.apply(undefined, arguments));
    };
};

/* Export
 ******************************************************************************/

/* Export
 ******************************************************************************/
return {
    'curry': curry,
    'identity': identity,
    'constant': constant,
    'compose': compose
};

});