/**
 * @fileOverview
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Object': new value_reference.ValueReference(),
    'ObjectCreate': new value_reference.ValueReference(),
    'ObjectKeys': new value_reference.ValueReference(),

    'ObjectPrototype': new value_reference.ValueReference(),
    'ObjectPrototypeValueOf': new value_reference.ValueReference(),
    'ObjectPrototypeToString': new value_reference.ValueReference()
};

});
