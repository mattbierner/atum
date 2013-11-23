/**
 * @fileOverview Undefined primitive value.
 */
define(['amulet/record',
        'atum/value/type',
        'atum/value/value'],
function(record,
        type,
        value) {
"use strict";

/* Undefined
 ******************************************************************************/
/**
 * Undefined primitive value.
 */
var Undefined = record.declare(new value.Value,
    [],
    function() {
        this.value = undefined;
});

Undefined.prototype.type = type.UNDEFINED;

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