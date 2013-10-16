/**
 * @fileOverview Exported Builtin RegExp Object References
 */
define(['atum/value_reference'],
function(vr){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'RegExp': vr.create('RegExp'),

    'RegExpPrototype': vr.create('RegExp.prototype'),
    'RegExpPrototypeExec': vr.create('RegExp.prototype.exec'),
    'RegExpPrototypeToString': vr.create('RegExp.prototype.toString')
};

});