define(function() {
//"use strict";

/* 
 ******************************************************************************/
var curry = function(f) {
    return ((arguments.length === 1) ? f : f.bind.apply(f, arguments));
};

var identity = function(x) {
    return x;
};

var constant = function(x) {
    return function() {
        return x;
    };
};
    
/* Computations
 ******************************************************************************/
var always = function(x) {
    return function(ctx, ok, err) {
        return ok(x, ctx);
    };
};

var never = function(x) {
    return function(ctx, ok, err) {
        return err(x, ctx);
    };
};

var bind = function(p, f) {
    return function(ctx, ok, err) {
        return p(ctx, function(x, env) { return f(x)(ctx, ok, err); }, err);
    };
};

var next = function(p, q) {
    return bind(p, constant(q));
};

/* Export
 ******************************************************************************/
return {
    'always': always,
    'never': never,
    'bind': bind,
    'next': next
};

});