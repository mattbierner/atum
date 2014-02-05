/**
 * @fileOverview Math constants and operations
 */
var hostMath = Math;

define(['exports',
        'atum/value/number'],
function(exports,
        number) {
"use strict";

/* Constants
 ******************************************************************************/
exports.E = number.Number.create(hostMath.E);
exports.LN10 = number.Number.create(hostMath.LN10);
exports.LN2 = number.Number.create(hostMath.LN2);
exports.LOG2E = number.Number.create(hostMath.LOG2E);
exports.LOG10E = number.Number.create(hostMath.LOG10E);
exports.PI = number.Number.create(hostMath.PI);
exports.SQRT1_2 = number.Number.create(hostMath.SQRT1_2);
exports.SQRT2 = number.Number.create(hostMath.SQRT2);

});