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
    if (!k.length)
        return [k, []];
    
    var top = k[0], rest = k.slice(1);
    if (top instanceof P && top.prompt === t)
        return [[], rest];
    
    var sub = splitSeq(t, rest);
    if (top instanceof Seg)
        return [pushSeg(top.frame, sub[0]), sub[1]];
    
    if (top instanceof P)
        return [pushP(k[0].prompt, sub[0]), sub[1]];
    
    return [fun.concat(k, sub[0]), sub[1]];
};

/* Operations
 ******************************************************************************/
/**
 * Applies continuation `k`
 * 
 * @param k Continuation.
 * @param x Value
 * @param ctx State.
 */
var appk = function(k, x, ctx) {
    do {
        if (typeof k === 'function')
            return k(x, ctx);
        
        var top = k[0];
        if (top instanceof Seg)
            return top.frame(x)(ctx, k.slice(1));
        else if (top instanceof P) 
            k = k.slice(1);
        else
            k = top;
    } while (true);
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