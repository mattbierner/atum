/**
 * @fileOverview Exported Builtin Boolean Object References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Boolean': new value_reference.ValueReference(),

    'BooleanPrototype': new value_reference.ValueReference(),
    'BooleanPrototypeToString': new value_reference.ValueReference(),
    'BooleanPrototypeValueOf': new value_reference.ValueReference()
};

});