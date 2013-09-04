/**
 * @fileOverview Undefined primitive value.
 */
define(['atum/value/value',
        'atum/value/type'],
function(value,
        type) {
"use strict";

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
Undefined.prototype.constructor = Undefined;

Undefined.prototype.type = type.UNDEFINED_TYPE;

/* Constants
 ******************************************************************************/
var UNDEFINED = new Undefined();

/* Export
 ******************************************************************************/
return {
    'Undefined': Undefined,

// Constants
    'UNDEFINED': UNDEFINED
};

});