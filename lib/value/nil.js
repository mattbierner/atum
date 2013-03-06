/**
 * @fileOverview
 */
define(['atum/value/value'],
function(value) {
"use strict";

/* Null
 ******************************************************************************/
/**
 * 
 */
var Null = function() {
    value.Value.call(this);
    this.value = null;
};
Null.prototype = new value.Value;

Null.prototype.type = 'null';

/* Export
 ******************************************************************************/
return {
    'Null': Null,
};

});