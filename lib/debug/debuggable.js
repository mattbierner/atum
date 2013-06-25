/**
 * @fileOverview Record for a debuggable state.
 */
define(['atum/value/value',
        'atum/value/type'],
function(value,
        type) {
"use strict";

/* Debuggable
 ******************************************************************************/
var Debuggable = function(ctx, v, k) {
    this.ctx = ctx;
    this.v = v;
    this.k = k;
};
/* Export
 ******************************************************************************/
return {
    'Debuggable': Debuggable
};

});