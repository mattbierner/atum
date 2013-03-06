/**
 * @fileOverview
 */
define(['atum/value/value'],
function(value) {
"use strict";

/* Undefined
 ******************************************************************************/
/**
 * 
 */
var Undefined = function() {
    value.Value.call(this);
    this.value = undefined;
};
Undefined.prototype = new value.Value;

Undefined.prototype.type = 'undefined';

/* Export
 ******************************************************************************/
return {
    'Undefined': Undefined,
};

});