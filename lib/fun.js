/**
 * @fileOverview 
 */
define([],
function(){
"use strict";

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
        return f.call(undefined, y, x);
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
        var indx = 0;
        return f.apply(f, reduce(function(p, c) {
            while (indx in bound) {
                var val = bound[indx];
                if (val === _)
                    break;
                p[indx] = val;
                ++indx;
            }
            p[indx] = c;
            ++indx;
            return p;
        }, slice(undefined, undefined, bound), arguments));
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