/**
 * @fileOverview 
 */
define(['atum/fun'],
function(fun) {
//"use strict";

/* Records
 ******************************************************************************/
var Seg = function(f) {
    this.frame = f;
};

var P = function(t) {
    this.prompt = t;
};


/* Sequence
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
 * 
 */
var appk = function(k, x, ctx) {
    if (Array.isArray(k)) {
        if (k[0] instanceof Seg)
            return appseg(k[0].frame, x, ctx)(ctx, k.slice(1));
        
        if (k[0] instanceof P)
            return appk(k.slice(1), x, ctx);
        
        return k[0](x, ctx);
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