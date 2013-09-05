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
 * Abstract abrupt completion base class.
 *
 * @param value Value to store.
 * @param previous The previous completion before this error completion.
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
 * @param [value] Value to store. Defaults to null.
 */
var NormalCompletion = function(value) {
    Completion.call(this, null, (value === undefined ? null : value));
};
NormalCompletion.prototype = new Completion;

NormalCompletion.type = 'normal';

NormalCompletion.prototype.type = NormalCompletion.type;

// ThrowCompletion
////////////////////////////////////////
/**
 * Thrown error completion.
 * 
 * @param value Value to store.
 * @param [previous] The previous value before the error was thrown. Defaults to null.
 */
var ThrowCompletion = function(value, previous) {
    ErrorCompletion.call(this, value, (previous === undefined ? null : previous));
};
ThrowCompletion.prototype = new ErrorCompletion;

ThrowCompletion.type = 'throw';

ThrowCompletion.prototype.type = ThrowCompletion.type;

// ReturnCompletion
////////////////////////////////////////
/**
 * Returned value completion.
 * 
 * @param [value] Value returned. Defaults to null.
 */
var ReturnCompletion = function(value) {
    AbruptCompletion.call(this, null, (value === undefined ? null : value));
};
ReturnCompletion.prototype = new AbruptCompletion;

ReturnCompletion.type = 'return';

ReturnCompletion.prototype.type = ReturnCompletion.type;

// Break Completion
////////////////////////////////////////
/**
 * Break completion.
 * 
 * @param {String} target The target of the break. May be null.
 * @param [value] Value returned. Defaults to null.
 */
var BreakCompletion = function(target, value) {
    AbruptCompletion.call(this, target, (value === undefined ? null : value));
};
BreakCompletion.prototype = new AbruptCompletion;

BreakCompletion.type = 'break';

BreakCompletion.prototype.type = BreakCompletion.type;

// Continue Completion
////////////////////////////////////////
/**
 * Continue completion.
 * 
 * @param {String} target The target of the break. May be null.
 * @param [value] Value returned. Defaults to null.
 */
var ContinueCompletion = function(target, value) {
    AbruptCompletion.call(this, target, (value === undefined ? null : value));
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