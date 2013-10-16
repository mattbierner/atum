/**
 * @fileOverview Exported Builtin String Object References
 */
define(['atum/value_reference'],
function(vr){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'String': vr.create('String'),

    'StringPrototype': vr.create('String.prototype'),
    'StringPrototypeCharCodeAt': vr.create('String.prototype.charCodeAt'),
    'StringPrototypeMatch': vr.create('String.prototype.match'),
    'StringPrototypeReplace': vr.create('String.prototype.replace'),
    'StringPrototypeSplit': vr.create('String.prototype.split'),
    'StringPrototypeToString': vr.create('String.prototype.toString'),
    'StringPrototypeValueOf': vr.create('String.prototype.valueOf')
};

});