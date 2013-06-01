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
 * Abstract completion base class.
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

// AbruptCompletion
////////////////////////////////////////
/**
 * Abstract abrupt completion base class.
 * 
 * Abrupt completion alter normal, sequential, program flow in some way.
 * 
 * @param target Identifier to continue execution at.
 * @param value Value to store.
 */
var AbruptCompletion = function(target, value) {
    Completion.call(this, target, value);
};
AbruptCompletion.prototype = new Completion;


// Normal
////////////////////////////////////////
/**
 * Normal completion.
 * 
 * @param value Value to store.
 */
var NormalCompletion = function(value) {
    this.value = value;
};

NormalCompletion.prototype = new Completion;
NormalCompletion.prototype.type = 'normal';

// ReturnCompletion
////////////////////////////////////////
/**
 * Completion for return that returns 'value'.
 */
var ReturnCompletion = function(value) {
    AbruptCompletion.call(this, null, value);
};
ReturnCompletion.prototype = new AbruptCompletion;
ReturnCompletion.prototype.type = 'return';

// Break Completion
////////////////////////////////////////
/**
 * Completion for a break that continues at 'target'.
 */
var BreakCompletion = function(target, value) {
    AbruptCompletion.call(this, target, value);
};
BreakCompletion.prototype = new AbruptCompletion;
BreakCompletion.prototype.type = 'break';

// Continue Completion
////////////////////////////////////////
/**
 * Completion for a break that continues at 'target'.
 */
var ContinueCompletion = function(target, value) {
    AbruptCompletion.call(this, target, value);
};
ContinueCompletion.prototype = new AbruptCompletion;
ContinueCompletion.prototype.type = 'continue';

/* Export
 ******************************************************************************/
return {
    'Completion': Completion,
    'AbruptCompletion': AbruptCompletion,
    
    'NormalCompletion': NormalCompletion,
    
    'ReturnCompletion': ReturnCompletion,
    'BreakCompletion': BreakCompletion,
    'ContinueCompletion': ContinueCompletion
};
});