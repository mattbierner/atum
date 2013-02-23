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
    return function(env, ok, err) {
        return ok(x, env);
    };
};

var never = function(x) {
    return function(env, ok, err) {
        return err(x, env);
    };
};

var bind = function(p, f) {
    return function(env, ok, err) {
        return p(env, function(x, env) { return f(x)(env, ok, err); }, err);
    };
};

return {
    'always': always,
    'never': never,
    'bind': bind
};

});