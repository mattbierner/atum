/**
 * @fileOverview Exported Builtin Boolean Object References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Boolean': value_reference.create(),

    'BooleanPrototype': value_reference.create(),
    'BooleanPrototypeToString': value_reference.create(),
    'BooleanPrototypeValueOf': value_reference.create()
};

});