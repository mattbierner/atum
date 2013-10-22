/**
 * @fileOverview 
 */
define([],
function() {
//"use strict";

/* Records
 ******************************************************************************/
var Seg = function(f, k) {
    this.frame = f;
    this.k = k;
};

var P = function(t, k) {
    this.prompt = t;
    this.k = k;
};

/* Operations
 ******************************************************************************/
var appseg = function(f, x, ctx) {
    return f(x, ctx);
};

var appk = function(k, x, ctx) {
    if (Array.isArray(k)) {
        if (k[0] instanceof Seg) {
            return appseg(k[0].frame, x, ctx)(ctx, k.slice(1));
        }
        if (k[0] instanceof P)
            return appk(k.slice(1), x, ctx);
        return k[0](x, ctx);
    }
    return k(x, ctx);
};

var pushP = function(t, k) {
    return [].concat(new P(t, k), [k]);
};

var pushSeg = function(f, k) {
    return [].concat(new Seg(f, k), k);
};

var pushSeq = function(sub, k) {
    return [].concat(sub, k);
};

var splitSeq = function(t, k) {
    if (k.length) {
        if (k[0] instanceof P && k.prompt === t)
            return [null, k.k];
        
        var sub = splitSeq(t, k.slice(1));
        if (k[0] instanceof Seg)
            return [pushSeg(k[0].frame, sub[0]), sub[1]];
        
        if (k[0] instanceof P)
            return [pushP(k[0].prompt, sub[0]), sub[1]];
        
        return [[].concat(k, sub[0]), sub[1]];
    }
    return [k, null]
};

/* Export
 ******************************************************************************/
return {
    'appk': appk,
    
    'pushP': pushP,
    'pushSeg': pushSeg,
    'pushSeq': pushSeq,
    'splitSeq': splitSeq
};

});