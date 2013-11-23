/**
 * @fileOverview Null primitive value.
 */
define(['amulet/record',
        'atum/value/type',
        'atum/value/value'],
function(record,
        type,
        value) {
"use strict";

/* Null
 ******************************************************************************/
/**
 * Null primitive value.
 */
var Null = record.declare(new value.Value,
    [],
    function() {
        this.value = null;
    });

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