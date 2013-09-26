/**
 * @fileOverview Exported Builtin RegExp Object References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'RegExp': new value_reference.ValueReference(),

    'RegExpPrototype': new value_reference.ValueReference(),
    'RegExpPrototypeExec': new value_reference.ValueReference(),
    'RegExpPrototypeToString': new value_reference.ValueReference()
    
};

});