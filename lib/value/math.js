/**
 * @fileOverview Math constants and operations
 */
define(['exports',
        'atum/value/number'],
function(exports,
        number) {
"use strict";

/* Constants
 ******************************************************************************/
var E = new number.Number(hostMath.E);

var LN10 = new number.Number(hostMath.LN10);

var LN2 = new number.Number(hostMath.LN2);

var LOG2E = new number.Number(hostMath.LOG2E);

var LOG10E = new number.Number(hostMath.LOG10E);

var PI = new number.Number(hostMath.PI);

var SQRT1_2 = new number.Number(hostMath.SQRT1_2);

var SQRT2 = new number.Number(hostMath.SQRT2);

/* Export
 ******************************************************************************/
exports.E = E;
exports.LN10 = LN10;
exports.LN2 = LN2;
exports.LOG2E = LOG2E;
exports.LOG10E = LOG10E;
exports.PI = PI;
exports.SQRT1_2 = SQRT1_2;
exports.SQRT2 = SQRT2;


});