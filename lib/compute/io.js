/**
 * @fileOverview Base statement computations.
 */
define(['atum/compute',
        'atum/completion',
        'atum/fun',
        'atum/compute/cont',
        'atum/compute/tail'],
function(compute,
        completion,
        fun,
        cont,
        tail) {
"use strict";

/* Base
 ******************************************************************************/
var fmap = function(f, action) {
    return function() {
        return f(action());
    };
};

var join = function(action) {
    return function() {
        return action()();
    };
};

var just = function(x) {
    return function() {
        return x;
    };
};

var bind = function(action, f) {
    return join(fmap(f, action));
};

var next = function(p, q) {
    return bind(p, fun.constant(q));
};

/* Try
 ******************************************************************************/
var handle = function(action, ok, err) {
    return bind(
        function() {
            try {
                var x = action();
                return [true, x];
            } catch (e) {
                return [false, e];
            }
        },
        function(result) {
            return (result[0] ?
                ok(result[1]) :
                err(result[1]))
        });
};

/* 
 ******************************************************************************/
var now = Date.now;

var random = Math.random;

var getFile = function(path) {
    return function() {
        if (typeof module !== 'undefined' && module.exports) {
            var fs = require.nodeRequire('fs');
            return fs.readFileSync(path, 'utf8');
        }
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', path, false);
        xhr.send(null);
    
        if (xhr.status > 399 && xhr.status < 600)
            throw new Error(path + ' HTTP status: ' + xhr.status);
        
        return xhr.responseText;
    };
}

/* Running
 ******************************************************************************/
var perform = function(action) {
    return action()
};

/* Export
 ******************************************************************************/
return {
    'just': just,
    'bind': bind,
    
    'handle': handle,
    
    'now': now,
    'random': random,
    'getFile': getFile,
    
    'perform': perform
};

});