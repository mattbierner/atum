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
 * Abrupt completion alter normal, sequential, program flow.
 * 
 * @param target Identifier to continue execution at.
 * @param value Value to store.
 */
var AbruptCompletion = function(target, value) {
    Completion.call(this, target, value);
};
AbruptCompletion.prototype = new Completion;

// ErrorCompletion
////////////////////////////////////////
/**
 * @param value Value to store.
 */
var ErrorCompletion = function(value, previous) {
    Completion.call(this, null, value);
    this.previous = previous;
};
ErrorCompletion.prototype = new AbruptCompletion;

// NormalCompletion
////////////////////////////////////////
/**
 * Normal completion.
 * 
 * Does not alter program flow.
 * 
 * @param value Value to store.
 */
var NormalCompletion = function(value) {
    Completion.call(this, null, value);
};
NormalCompletion.prototype = new Completion;

NormalCompletion.type = 'normal';

NormalCompletion.prototype.type = NormalCompletion.type;

// ThrowCompletion
////////////////////////////////////////
/**
 * Completion for a thrown error.
 * 
 * @param value Value to store.
 * @param [previous] The previous value before the error was thrown.
 */
var ThrowCompletion = function(value, previous) {
    ErrorCompletion.call(this, value, previous);
};
ThrowCompletion.prototype = new ErrorCompletion;

ThrowCompletion.type = 'throw';

ThrowCompletion.prototype.type = ThrowCompletion.type;

// ReturnCompletion
////////////////////////////////////////
/**
 * Completion for return that returns 'value'.
 */
var ReturnCompletion = function(value) {
    AbruptCompletion.call(this, null, value);
};
ReturnCompletion.prototype = new AbruptCompletion;

ReturnCompletion.type = 'return';

ReturnCompletion.prototype.type = ReturnCompletion.type;

// Break Completion
////////////////////////////////////////
/**
 * Completion for a break that continues at 'target'.
 */
var BreakCompletion = function(target, value) {
    AbruptCompletion.call(this, target, value);
};
BreakCompletion.prototype = new AbruptCompletion;

BreakCompletion.type = 'break';

BreakCompletion.prototype.type = BreakCompletion.type;

// Continue Completion
////////////////////////////////////////
/**
 * Completion for a break that continues at 'target'.
 */
var ContinueCompletion = function(target, value) {
    AbruptCompletion.call(this, target, value);
};
ContinueCompletion.prototype = new AbruptCompletion;

ContinueCompletion.type = 'continue';

ContinueCompletion.prototype.type = ContinueCompletion.type;

/* Export
 ******************************************************************************/
return {
    'Completion': Completion,
    
    'AbruptCompletion': AbruptCompletion,
    'NormalCompletion': NormalCompletion,

    'ErrorCompletion': ErrorCompletion,
    
    'ThrowCompletion': ThrowCompletion,
    'ReturnCompletion': ReturnCompletion,
    'BreakCompletion': BreakCompletion,
    'ContinueCompletion': ContinueCompletion
};
});