/**
 * @fileOverview 
 */
define([],
function(){
"use strict";

/* 
 ******************************************************************************/
var identity = function(x) {
    return x;
};

var args = function(/*...*/) {
    return arguments;
};

var constant = function(x) {
    return function() {
        return x;
    };
};

var flip = function(f) {
    return function(x, y) {
        return f(y, x);
    };
};

var compose = function(f, g) {
    if (!f || !g)
        debugger;
    return function(/*...*/) {
        return f(g.apply(undefined, arguments));
    };
};

var composer = flip(compose);

var call = function(f /*, ...*/) {
    return Function.prototype.call.apply(f, arguments);
};

var apply = function(f, arg) {
    return Function.prototype.apply.apply(f, arguments);
};

/* 
 ******************************************************************************/
var and = function(l, r) {
    return function(x) {
        return l(x) && r(x);
    };
};

var or = function(l, r) {
    return function(x) {
        return l(x) || r(x);
    };
};


/* 
 ******************************************************************************/
var concat = function(/*...*/) {
    return Array.prototype.concat.apply([], arguments);
};

var map = function(f, a) {
    return Array.prototype.map.call(a, f);
};

var reduce = function(f, z, a) {
    return Array.prototype.reduce.call(a, f, z);
};

var reduceRight = function(f, z, a) {
    return Array.prototype.reduceRight.call(a, f, z);
};

var slice = function(start, end, a) {
    return Array.prototype.slice.call(a, start, end);
};

/* 
 ******************************************************************************/
var _ = {};

var curry = function(f /*, ...*/) {
    return f.bind.apply(f, arguments);
};

var placeholder = function(f /*, ...*/) {
    var bound = slice(1, undefined, arguments);
    return function(/*...*/) {
        var args = [];
        for (var i = 0, len = bound.length; i < len; ++i)
            if (bound[i] !== _)
                 args[i] = bound[i];
        var indx = 0;
        for (var i = 0, len = arguments.length; i < len; ++i) {
            while (indx in args)
                 ++indx;
            args[indx++] = arguments[i];
        }
        return f.apply(undefined, args);
    };
};

/* 
 ******************************************************************************/
var gen = function(end) {
    var a = [];
    for (var i = 0; i < end; ++i)
        a.push(i);
    return a;
};

/* Export
 ******************************************************************************/
return {
    'identity': identity,
    'args': args,
    'constant': constant,
    'compose': compose,
    'composer': composer,
    'call': call,
    'apply': apply,
    'flip': flip,
    
    'and': and,
    'or': or,
    
    '_': _,
    'curry': curry,
    'placeholder': placeholder,
    
    'concat': concat,
    'map': map,
    'reduce': reduce,
    'reduceRight': reduceRight,
    'slice': slice,
    
    'gen': gen
};

});