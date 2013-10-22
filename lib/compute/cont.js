/**
 * @fileOverview Delimited continuation data structures and stack management
 *     operations.
 */
define(['atum/fun'],
function(fun) {
"use strict";

/* Records
 ******************************************************************************/
var Seg = function(f) {
    this.frame = f;
};

var P = function(t) {
    this.prompt = t;
};


/* Stack
 ******************************************************************************/
/**
 * 
 */
var pushP = function(t, k) {
    return fun.concat(new P(t), k);
};

/**
 * 
 */
var pushSeg = function(f, k) {
    return fun.concat(new Seg(f), k);
};

/**
 * 
 */
var pushSeq = function(sub, k) {
    return fun.concat(sub, k);
};

/**
 * 
 */
var splitSeq = function(t, k) {
    if (k.length) {
        if (k[0] instanceof P && k[0].prompt === t)
            return [[], k.slice(1)];
        
        var sub = splitSeq(t, k.slice(1));
        if (k[0] instanceof Seg)
            return [pushSeg(k[0].frame, sub[0]), sub[1]];
        
        if (k[0] instanceof P)
            return [pushP(k[0].prompt, sub[0]), sub[1]];
        
        return [fun.concat(k, sub[0]), sub[1]];
    }
    return [k, []]
};

/* Operations
 ******************************************************************************/
var appseg = function(f, x, ctx) {
    return f(x, ctx);
};

/**
 * Applies continuation `k`
 * 
 * @param k Continuation.
 * @param x Value
 * @param ctx State.
 */
var appk = function(k, x, ctx) {
    if (Array.isArray(k)) {
        var top = k[0];
        if (top instanceof Seg)
            return appseg(top.frame, x, ctx)(ctx, k.slice(1));
        else if (top instanceof P)
            return appk(k.slice(1), x, ctx);
        else
            return appk(top, x, ctx);
    }
    return k(x, ctx);
};


/* Export
 ******************************************************************************/
return {
    'pushP': pushP,
    'pushSeg': pushSeg,
    'pushSeq': pushSeq,
    'splitSeq': splitSeq,
    
// Operations
    'appk': appk
};

});