/**
 * @fileOverview Primitive regular expression value.
 */
define(['atum/value/value',
        'atum/value/type'],
function(value,
        type) {
"use strict";

/* RegExp
 ******************************************************************************/
/**
 * Primitive regular expression value.
 * 
 * @param {regexp} [v] Host regular expression stored in the primitive.
 */
var RegExp = function(v) {
    value.Value.call(this);
    this.value = v;
};
RegExp.prototype = new value.Value;
RegExp.prototype.constructor = RegExp;

RegExp.prototype.type = type.REGEXP_TYPE;

/* Export
 ******************************************************************************/
return {
    'RegExp': RegExp
};

});