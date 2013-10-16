/**
 * @fileOverview Exported Builtin Number Object References
 */
define(['atum/value_reference'],
function(vr){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Number': vr.create('Number'),

    'NumberPrototype': vr.create('Number.prototype'),
    'NumberPrototypeToExponential': vr.create('Number.prototype.toExponential'),
    'NumberPrototypeToFixed': vr.create('Number.prototype.toFixed'),
    'NumberPrototypeToPrecision': vr.create('Number.prototype.toPrecision'),
    'NumberPrototypeToString': vr.create('Number.prototype.toString'),
    'NumberPrototypeValueOf': vr.create('Number.prototype.valueOf')
};

});