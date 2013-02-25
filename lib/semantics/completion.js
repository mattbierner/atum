define(function(){


/* Completions
 ******************************************************************************/
/**
 * Base completion.
 * 
 * @param value Value to store.
 * @param [target] Identifier to continue execution at.
 */
var Completion = function(value, target) {
    this.value = value;
    this.target = target;
};

Completion.prototype.toString = function() {
    return "{" + this.type + " value:" + this.value + " target:" + this.target + "}";
};

/**
 * Completion for return that returns 'value'.
 */
var ReturnCompletion = function(value) {
    Completion.call(this, value, null);
};
ReturnCompletion.prototype = new Completion;
ReturnCompletion.prototype.type = "Return";

/**
 * Completion for a break that continues at 'target'.
 */
var BreakCompletion = function(target) {
    Completion.call(this, null, target);
};
BreakCompletion.prototype = new Completion;
BreakCompletion.prototype.type = "Break";


/**
 * Completion for a break that continues at 'target'.
 */
var ContinueCompletion = function(target) {
    Completion.call(this, null, target);

};
ContinueCompletion.prototype = new Completion;
ContinueCompletion.prototype.type = "Continue";


/* Export
 ******************************************************************************/
return {
    'Completion': Completion,
    
    'ReturnCompletion': Return Completion,
    'BreakCompletion': BreakCompletion,
    'ContinueCompletion': ContinueCompletion
};
});