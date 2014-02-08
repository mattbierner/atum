/**
 * @fileOverview Null value computations.
 */
define(['exports',
        'atum/compute',
        'atum/value/nil'],
function(exports,
        compute,
        nil) {
"use strict";

exports.NULL = compute.just(nil.NULL);

});