/**
 * @fileOverview Exported Builtin Number Object References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Number': value_reference.create(),

    'NumberPrototype': value_reference.create(),
    'NumberPrototypeToExponential': value_reference.create(),
    'NumberPrototypeToFixed': value_reference.create(),
    'NumberPrototypeToPrecision': value_reference.create(),
    'NumberPrototypeToString': value_reference.create(),
    'NumberPrototypeValueOf': value_reference.create()

};

});