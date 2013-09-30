/**
 * @fileOverview Null primitive value.
 */
define(['atum/value/type',
        'atum/value/value'],
function(type,
        value) {
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
Null.prototype.constructor = Null;

Null.prototype.type = type.NULL;

/* Constants
 ******************************************************************************/
var NULL = new Null();

/* Export
 ******************************************************************************/
return {
    'Null': Null,

// Constants
    'NULL': NULL
};

});