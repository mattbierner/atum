/**
 * @fileOverview Completions used in computations.
 */
define(['amulet/record'],
function(record){
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
var Completion = record.declare(null, [
    'target',
    'value'],
    function(target, value) {
        this.target = target;
        this.value = (value === undefined ? null : value);
    });

// AbruptCompletion
////////////////////////////////////////
/**
 * Abstract abrupt completion base class.
 * 
 * Abrupt completion alter normal, sequential, program flow.
 */
var AbruptCompletion = record.extend(Completion,
    [],
    function(target, value) {
        Completion.call(this, target, value);
    });

// ErrorCompletion
////////////////////////////////////////
/**
 * Abstract abrupt completion base class.
 *
 * @param value Value to store.
 * @param previous The previous completion before this error completion.
 */
var ErrorCompletion = record.extend(AbruptCompletion,
    ['previous'],
    function(value, previous) {
        AbruptCompletion.call(this, null, value);
        this.previous = previous;
    });

// NormalCompletion
////////////////////////////////////////
/**
 * Normal completion.
 * 
 * Does not alter program flow.
 * 
 * @param [value] Value to store. Defaults to null.
 */
var NormalCompletion = record.extend(Completion,
    [],
    function(value) {
        Completion.call(this, null, value);
    });

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
var ThrowCompletion = record.extend(ErrorCompletion,
    [],
    function(value, previous) {
        ErrorCompletion.call(this, value, previous);
    });

ThrowCompletion.type = 'throw';

ThrowCompletion.prototype.type = ThrowCompletion.type;

// ReturnCompletion
////////////////////////////////////////
/**
 * Returned value completion.
 * 
 * @param [value] Value returned. Defaults to null.
 */
var ReturnCompletion = record.extend(AbruptCompletion,
    [],
    function(value) {
        AbruptCompletion.call(this, null, value);
    });

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
var BreakCompletion = record.extend(AbruptCompletion,
    [],
    function(target, value) {
        AbruptCompletion.call(this, target, value);
    });

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
var ContinueCompletion = record.extend(AbruptCompletion,
    [],
    function(target, value) {
        AbruptCompletion.call(this, target, value);
    });

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