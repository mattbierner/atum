/**
 * @fileOverview Exported Builtin Arguments References
 */
define(['atum/value_reference'],
function(vr){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Arguments': vr.create('Arguments'),

    'strictCalleeThrower': vr.create('Arguments callee thrower'),
    'strictCallerThrower': vr.create('Arguments caller thrower')
};

});