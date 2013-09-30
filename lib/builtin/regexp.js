/**
 * @fileOverview Exported Builtin RegExp Object References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'RegExp': value_reference.create(),

    'RegExpPrototype': value_reference.create(),
    'RegExpPrototypeExec': value_reference.create(),
    'RegExpPrototypeToString': value_reference.create()
    
};

});