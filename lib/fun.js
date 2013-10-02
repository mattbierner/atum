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

var compose = function(f, g) {
    if (!f || !g)
        debugger;
    return function(/*...*/) {
        return f(g.apply(undefined, arguments));
    };
};

var flip = function(f) {
    return function(x, y) {
        return f.call(undefined, y, x);
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

var reduceRight = function(f, z, a) {
    return Array.prototype.reduceRight.call(a, f, z);
};

/* 
 ******************************************************************************/
var _ = {};

var curry = function(f /*, ...*/) {
    return f.bind.apply(f, arguments);
};

var placeholder = function(f /*, ...*/) {
    var bound = [].slice.call(arguments, 1);
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
        }, [].slice.call(bound), arguments));
    }
};




/* Export
 ******************************************************************************/
return {
    'identity': identity,
    'args': args,
    'constant': constant,
    'compose': compose,
    'flip': flip,
    
    '_': _,
    'curry': curry,
    'placeholder': placeholder,
    
    
    'map': map,
    'reduce': reduce,
    'reduceRight': reduceRight
};

});