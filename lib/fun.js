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
    if (!f || !g)
        debugger;
    return function(/*...*/) {
        return f(g.apply(undefined, arguments));
    };
};

/* 
 ******************************************************************************/
var map = function(f, a) {
    return Array.prototype.map.call(a, f);
};

var reduce = function(f, z, a) {
    return Array.prototype.reduce.call(a, f, z);
};

/* Export
 ******************************************************************************/
return {
    'curry': curry,
    'identity': identity,
    'constant': constant,
    'compose': compose,
    
    'map': map,
    'reduce': reduce
};

});