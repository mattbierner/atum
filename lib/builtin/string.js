/**
 * @fileOverview Exported Builtin String Object References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'String': value_reference.create(),

    'StringPrototype': value_reference.create(),
    'StringPrototypeCharCodeAt': value_reference.create(),
    'StringPrototypeMatch': value_reference.create(),
    'StringPrototypeReplace': value_reference.create(),
    'StringPrototypeSplit': value_reference.create(),
    'StringPrototypeToString': value_reference.create(),
    'StringPrototypeValueOf': value_reference.create()
};

});