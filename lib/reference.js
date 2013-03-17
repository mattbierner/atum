/**
 * @fileOverview Language level reference type.
 */
define(['atum/compute'],
function(compute) {
//"use strict";

/* Errors
 ******************************************************************************/
var ReferenceError = function(message) {
    this.message = message;
};

ReferenceError.prototype.toString = function() {
    return "ReferenceError: " + this.message;
};


/* Reference
 ******************************************************************************/
var Reference = function() { };

/* Reference Operations
 ******************************************************************************/
var dereference = function(ir) {
    return ir.dereference();
};

var set = function(ir, value) {
    return ir.set(value);
};

var getBase = function(ir) {
    if (!(ir instanceof Reference)) {
        return compute.always(ir);
    }
    return ir.getBase();
};

/* Errors
 ******************************************************************************/
return {
    'ReferenceError': ReferenceError,
    
    'Reference': Reference,

    'dereference': dereference,
    'set': set,
    'getBase': getBase
};

});