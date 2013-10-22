/**
 * @fileOverview
 */
define([], function() {
//"use strict";

/* Context
 ******************************************************************************/
/**
 * A computation state.
 * 
 * @param values Object that maps keys to values referenced in a computation.
 * @param userData User computation context.
 * @param now Current time of the context.
 * @param prompt Index of current prompt.
 */
var ComputeContext = function(values, userData, now, prompt, fail) {
    this.values = values;
    this.userData = userData;
    this.now = now;
    this.prompt = prompt;
    this.fail = fail;
};

/**
 * Empty computation context that stores no values and has no user data.
 */
ComputeContext.empty = new ComputeContext({}, null, null, 1, null);

/**
 * Create a new context with given values.
 */
ComputeContext.setValues = function(ctx, values) {
    return new ComputeContext(
        values,
        ctx.userData,
        ctx.now,
        ctx.prompt,
        ctx.fail);
};

/**
 * Create a new context given user data.
 */
ComputeContext.setUserData = function(ctx, ud) {
    return new ComputeContext(
        ctx.values,
        ud,
        ctx.now,
        ctx.prompt,
        ctx.fail);
};

/**
 * Create a new context with given current time.
 */
ComputeContext.setNow = function(ctx, now) {
    return new ComputeContext(
        ctx.values,
        ctx.userData,
        now,
        ctx.prompt,
        ctx.fail);
};

/**
 */
ComputeContext.setPrompt = function(ctx, prompt) {
    return new ComputeContext(
        ctx.values,
        ctx.userData,
        ctx.now,
        prompt,
        ctx.fail);
};

/**
 */
ComputeContext.setFail = function(ctx, fail) {
    return new ComputeContext(
        ctx.values,
        ctx.userData,
        ctx.now,
        ctx.prompt,
        fail);
};


/* Export
 ******************************************************************************/
return {
    'ComputeContext': ComputeContext
};

});