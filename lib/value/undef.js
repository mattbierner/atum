/**
 * @fileOverview Undefined primitive value.
 */
define(['atum/value/value'],
function(value) {
"use strict";

/* Undefined Type
 ******************************************************************************/
/**
 * Type of primitive number values.
 */
var UNDEFINED_TYPE = 'undefined';


/* Undefined
 ******************************************************************************/
/**
 * Undefined primitive value.
 */
var Undefined = function() {
    value.Value.call(this);
    this.value = undefined;
};
Undefined.prototype = new value.Value;

Undefined.prototype.type = UNDEFINED_TYPE;

/* Export
 ******************************************************************************/
return {
    'UNDEFINED_TYPE': UNDEFINED_TYPE,
    
    'Undefined': Undefined,
};

});