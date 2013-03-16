/**
 * @fileOverview Null primitive value.
 */
define(['atum/value/value'],
function(value) {
"use strict";

/* Null Type
 ******************************************************************************/
/**
 * Type of primitive number values.
 */
var NULL_TYPE = 'null';

/* Null
 ******************************************************************************/
/**
 * Null primitive value.
 */
var Null = function() {
    value.Value.call(this);
    this.value = null;
};
Null.prototype = new value.Value;

Null.prototype.type = NULL_TYPE;

/* Export
 ******************************************************************************/
return {
    'Null': Null,
};

});