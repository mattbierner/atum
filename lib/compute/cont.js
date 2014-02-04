/**
 * @fileOverview Delimited continuation data structures and stack management
 *     operations.
 */
define(['atum/fun',
        'nu/stream'],
function(fun,
        stream) {
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
var pushP = function(t, k) {
    return stream.cons(new P(t), k);
};

var pushSeg = function(f, k) {
    return stream.cons(new Seg(f), k);
};

var pushSeq = function(sub, k) {
    return stream.cons(sub, k);
};

var splitSeq = function(t, k) {
    if (stream.isEmpty(k))
        return [k, stream.NIL];
    
    var top = stream.first(k), rest = stream.rest(k);
    if (top instanceof P && top.prompt === t)
        return [stream.NIL, rest];
    
    var sub = splitSeq(t, rest);
    if (top instanceof Seg)
        return [pushSeg(top.frame, sub[0]), sub[1]];
    
    if (top instanceof P)
        return [pushP(top.prompt, sub[0]), sub[1]];
    
    return [stream.append(k, sub[0]), sub[1]];
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
        
        var top = stream.first(k);
        if (top instanceof Seg)
            return top.frame(x)(ctx, stream.rest(k));
        else if (top instanceof P) 
            k = stream.rest(k);
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