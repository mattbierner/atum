/**
 * @fileOverview Internal arguments object.
 */
define(['atum/value/undef'],
function(undef) {
"use strict";

/* Args
 ******************************************************************************/
/**
 * Internal object used for representing a list of function arguments.
 * 
 * Args objects should always be used instead of arrays because they correctly
 * handled accessing undefined argument values.
 */
var Args = function(args) {
    this.args = args;
    this.length = args.length;
};

Args.prototype.getArg = function(i) {
    return (i >= 0 && i < this.length ?
        this.args[i] :
        undef.UNDEFINED);
};

Args.prototype.slice = function(/*...*/) {
    return new Args([].slice.apply(this.args, arguments));
};

Args.prototype.reduce = function(/*...*/) {
    return [].reduce.apply(this.args, arguments);
};

Args.prototype.append = function(value) {
    return new Args(this.args.concat([value]));
};

Args.prototype.concat = function(a) {
    return new Args(this.args.concat(a.args));
};

/* Export
 ******************************************************************************/
return {
    'Args': Args
};

});