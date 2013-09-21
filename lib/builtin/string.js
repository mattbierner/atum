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
    'StringPrototypeMatch': new value_reference.ValueReference(),
    'StringPrototypeReplace': new value_reference.ValueReference(),
    'StringPrototypeSplit': new value_reference.ValueReference(),
    'StringPrototypeToString': new value_reference.ValueReference(),
    'StringPrototypeValueOf': new value_reference.ValueReference()
};

});