/**
 * @fileOverview Primitive value types.
 */
define(function() {
"use strict";

/* Types
 ******************************************************************************/
/**
 * Type of primitive number values.
 */
var BOOLEAN_TYPE = 'boolean';

/**
 * Type of primitive number values.
 */
var NULL_TYPE = 'null';

/**
 * Type of primitive number values.
 */
var NUMBER_TYPE = 'number';

/**
 * Type of primitive number values.
 */
var OBJECT_TYPE = 'object';

/**
 * Type of primitive regular expression values.
 */
var REGEXP_TYPE = 'regexp';

/**
 * Type of primitive string value.
 */
var STRING_TYPE = 'string';

/**
 * Type of primitive undefined values.
 */
var UNDEFINED_TYPE = 'undefined';

/* Export
 ******************************************************************************/
return {
    'BOOLEAN_TYPE': BOOLEAN_TYPE,
    'NULL_TYPE': NULL_TYPE,
    'NUMBER_TYPE': NUMBER_TYPE,
    'OBJECT_TYPE': OBJECT_TYPE,
    'REGEXP_TYPE': REGEXP_TYPE,
    'STRING_TYPE': STRING_TYPE,
    'UNDEFINED_TYPE': UNDEFINED_TYPE
};

});