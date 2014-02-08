/**
 * @fileOverview Undefined value computations.
 */
define(['exports',
        'atum/compute',
        'atum/value/undef'],
function(exports,
        compute,
        undef) {
"use strict";

exports.UNDEFINED = compute.just(undef.UNDEFINED);

});