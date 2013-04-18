/**
 * @fileOverview Null primitive value.
 */
define(['atum/value/value',
        'atum/value/type'],
function(value,
        type) {
"use strict";

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

Null.prototype.type = type.NULL_TYPE;

/* Export
 ******************************************************************************/
return {
    'Null': Null
};

});