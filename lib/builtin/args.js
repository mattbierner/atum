/**
 * @fileOverview Exported Builtin Arguments References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Arguments': value_reference.create(),

    'strictCalleeThrower': value_reference.create(),
    'strictCallerThrower': value_reference.create()
};

});