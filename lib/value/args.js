/**
 * @fileOverview Internal arguments object.
 */
define(['bes/record',
        'atum/fun',
        'atum/value/undef'],
function(record,
        fun,
        undef) {
"use strict";

/* Args
 ******************************************************************************/
/**
 * Internal object used for representing a list of function arguments.
 * 
 * Args objects should always be used instead of arrays because they correctly
 * handled accessing undefined argument values.
 */
var Args = record.declare(null, [
    'args'],
    function(args) {
        this.args = args;
        this.length = (args ? args.length : 0);
    });

Args.prototype.getArg = function(i) {
    return (i >= 0 && i < this.length ?
        this.args[i] :
        undef.UNDEFINED);
};

Args.prototype.slice = function(/*...*/) {
    return Args.create([].slice.apply(this.args, arguments));
};

Args.prototype.reduce = function(f, z) {
    return fun.foldl(f, z, this.args);
};

Args.prototype.append = function(value) {
    return Args.create(this.args.concat([value]));
};

Args.prototype.concat = function(a) {
    return Args.create(this.args.concat(a.args));
};

/* Export
 ******************************************************************************/
return {
    'Args': Args
};

});