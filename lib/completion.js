/**
 * @fileOverview Completions used in computations.
 */
define(function(){
"use strict";

/* Completions
 ******************************************************************************/
// Completion
////////////////////////////////////////
/**
 * Base completion.
 * 
 * @param target Identifier to continue execution at.
 * @param value Value to store.
 */
var Completion = function(target, value) {
    this.target = target;
    this.value = value;
};

Completion.prototype.toString = function() {
    return "{" + this.type + " target:" + this.target + " value:" + this.value +  "}";
};

// ReturnCompletion
////////////////////////////////////////
/**
 * Completion for return that returns 'value'.
 */
var ReturnCompletion = function(value) {
    Completion.call(this, null, value);
};
ReturnCompletion.prototype = new Completion;
ReturnCompletion.prototype.type = 'return';

// Break Completion
////////////////////////////////////////
/**
 * Completion for a break that continues at 'target'.
 */
var BreakCompletion = function(target, value) {
    Completion.call(this, target, value);
};
BreakCompletion.prototype = new Completion;
BreakCompletion.prototype.type = 'break';

// Continue Completion
////////////////////////////////////////
/**
 * Completion for a break that continues at 'target'.
 */
var ContinueCompletion = function(target, value) {
    Completion.call(this, target, value);
};
ContinueCompletion.prototype = new Completion;
ContinueCompletion.prototype.type = 'continue';

/* Export
 ******************************************************************************/
return {
    'Completion': Completion,
    
    'ReturnCompletion': ReturnCompletion,
    'BreakCompletion': BreakCompletion,
    'ContinueCompletion': ContinueCompletion
};
});