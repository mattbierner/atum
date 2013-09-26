/**
 * @fileOverview Exported Builtin Arguments References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Arguments': new value_reference.ValueReference(),

    'strictCalleeThrower': new value_reference.ValueReference(),
    'strictCallerThrower': new value_reference.ValueReference()
};

});