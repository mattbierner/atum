/**
 * @fileOverview
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Number': new value_reference.ValueReference(),

    'NumberPrototype': new value_reference.ValueReference(),
    'NumberPrototypeToString': new value_reference.ValueReference(),
    'NumberPrototypeValueOf': new value_reference.ValueReference()
};

});