/**
 * @fileOverview 
 */
define([],
function(){
"use strict";

/* 
 ******************************************************************************/
/**
 * Identify function
 */
var identity = function(x) {
    return x;
};

/**
 * Return the function arguments.
 */
var args = function(/*...*/) {
    return arguments;
};

/**
 * Create a constant function that returns `x`.
 */
var constant = function(x) {
    return function() {
        return x;
    };
};

/**
 * Create a flipped argument version of binary function `f`.
 */
var flip = function(f) {
    return function(x, y) {
        return f(y, x);
    };
};

/**
 * Compose two unary argument functions `f` and `g`.
 */
var compose = function(f, g) {
    if (!f || !g) debugger;
    return function(x) {
        return f(g(x));
    };
};

/**
 * Compose n-ary function `g` with unary argument function `f`.
 */
var composen = function(f, g) {
    if (!f || !g) debugger;
    return function(/*...*/) {
        return f(g.apply(undefined, arguments));
    };
};

/* 
 ******************************************************************************/
var concat = Array.prototype.concat.bind([]);

var map = function(f, a) {
    return Array.prototype.map.call(a, f);
};

var foldl = function(f, z, a) {
    return Array.prototype.reduce.call(a, f, z);
};

var foldr = function(f, z, a) {
    return Array.prototype.reduceRight.call(a, f, z);
};

var reduce = function(f, a) {
    return Array.prototype.reduce.call(a, f);
};

var reduceRight = function(f, a) {
    return Array.prototype.reduceRight.call(a, f);
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
var range = (function(){
    var rangeImpl = function(lower, upper, step) {
        var arr = [];
        while (step > 0 ? upper > lower : upper < lower) {
            arr.push(lower);
            lower += step;
        }
        return arr;
    };
    return function(lower, upper, step) {
        var rangeLower = isNaN(lower) ? Infinity : +lower;
        var rangeStep = isNaN(step) ? 1 : +step;
        return isNaN(upper) ?
            rangeImpl(0, rangeLower, rangeStep) :
            rangeImpl(rangeLower, upper, rangeStep);
    };
}());

var gen = function(end) {
    return range(0, end, 1);
};

/* Export
 ******************************************************************************/
return {
    'identity': identity,
    'args': args,
    'constant': constant,
    
    'compose': compose,
    'composen': composen,

    'flip': flip,
    
    '_': _,
    'curry': curry,
    'placeholder': placeholder,
    
    'concat': concat,
    'map': map,
    'foldl': foldl,
    'foldr': foldr,
    'reduce': reduce,
    'reduceRight': reduceRight,
    'slice': slice,
    
    'gen': gen,
    'range': range
};

});