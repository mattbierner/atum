/**
 * @fileOverview Delimited continuation control stack.
 * 
 * Based on:
 * http://www.cs.indiana.edu/~sabry/papers/monadicDC.pdf
 */
define(['nu-stream/stream'],
function(stream) {
"use strict";

/* Records
 ******************************************************************************/
/**
 * Control segment.
 */
var Seg = function(f) {
    this.frame = f;
};

/**
 * Delimiter.
 */
var P = function(t) {
    this.prompt = t;
};

/* Control Stack
 ******************************************************************************/
var empty = stream.NIL;

var push = stream.cons;

/**
 * Push an entire slice of control stack onto a control stack.
 */
var pushSeq = stream.append;

/**
 * Push a delimiter `t` on onto control stack `k`.
 */
var pushP = function(t, k) {
    return push(new P(t), k);
};

/**
 * Push a segment for `f` onto control stack `k`.
 */
var pushSeg = function(f, k) {
    return push(new Seg(f), k);
};

/**
 * Splits the control stack around prompt `t`.
 */
var splitSeq = function(t, k) {
    if (stream.isEmpty(k))
        return [empty, empty];
    
    var top = stream.first(k),
        rest = stream.rest(k);
    
    if (top instanceof P && top.prompt === t)
        return [empty, rest];
    
    var sub = splitSeq(t, rest);
    return [push(top, sub[0]), sub[1]];
};

/* Operations
 ******************************************************************************/
/**
 * Apply continuation `k`
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
    'push': push,
    'pushP': pushP,
    'pushSeg': pushSeg,
    'pushSeq': pushSeq,
    'splitSeq': splitSeq,
    
    'empty': empty,
    
// Operations
    'appk': appk
};

});