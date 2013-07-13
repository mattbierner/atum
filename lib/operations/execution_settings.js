/**
 */
define(['atum/compute',
        'atum/operations/execution_context'],
function(compute,
        execution_context) {
//"use strict";

var getSettings = function() {
    return execution_context.extract(function(ctx) {
        return ctx.settings;
    });
};

var modifyContext = function(f) {
    return compute.modifyContext(f);
};

var setContext = function(ctx) {
    return modifyContext(function(){ return ctx; });
};

/**
 * Extract a value from the current execution context.
 */
var extract = function(f) {
    return execution_context.extract(function(ctx) { return f(ctx.settings); });
};

    
/* 
 ******************************************************************************/
var getMaxStack = function() {
    return extract(function(settings) {
        return settings.maxStack;
    });
};

/* Export
 ******************************************************************************/
return {
    'getSettings': getSettings,
    
    'getMaxStack': getMaxStack
};

});