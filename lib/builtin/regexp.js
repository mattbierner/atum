/**
 * @fileOverview Exported RegExp builtins.
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'RegExp': new value_reference.ValueReference(),

    'RegExpPrototype': new value_reference.ValueReference(),
    'RegExpPrototypeToString': new value_reference.ValueReference()
};

});