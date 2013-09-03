/**
 * @fileOverview
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'String': new value_reference.ValueReference(),

    'StringPrototype': new value_reference.ValueReference(),
    'StringPrototypeToString': new value_reference.ValueReference(),
    'StringPrototypeValueOf': new value_reference.ValueReference()
};

});