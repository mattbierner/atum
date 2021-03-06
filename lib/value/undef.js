/**
 * @fileOverview Undefined primitive value.
 */
define(['bes/record',
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
var Undefined = record.extend(value.Value,
    []);

Undefined.prototype.type = type.UNDEFINED;

/* Constants
 ******************************************************************************/
var UNDEFINED = Undefined.create();

/* Export
 ******************************************************************************/
return {
    'Undefined': Undefined,

// Constants
    'UNDEFINED': UNDEFINED
};

});