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
    'NumberPrototypeToExponential': new value_reference.ValueReference(),
    'NumberPrototypeToFixed': new value_reference.ValueReference(),
    'NumberPrototypeToPrecision': new value_reference.ValueReference(),
    'NumberPrototypeToString': new value_reference.ValueReference(),
    'NumberPrototypeValueOf': new value_reference.ValueReference()

};

});