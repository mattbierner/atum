/**
 * @fileOverview Exported Builtin Boolean Object References
 */
define(['atum/value_reference'],
function(vr){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Boolean': vr.create('Boolean'),

    'BooleanPrototype': vr.create('Boolean.prototype'),
    'BooleanPrototypeToString': vr.create('Boolean.prototype.toString'),
    'BooleanPrototypeValueOf': vr.create('Boolean.prototype.valueOf')
};

});