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
var Null = record.extend(value.Value,
    []);

Null.prototype.value = null;
Null.prototype.type = type.NULL;

/* Constants
 ******************************************************************************/
var NULL = Null.create();

/* Export
 ******************************************************************************/
return {
    'Null': Null,

// Constants
    'NULL': NULL
};

});