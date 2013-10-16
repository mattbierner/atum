/**
 * @fileOverview Exported Builtin Error References
 */
define(['atum/value_reference'],
function(vr){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Error': vr.create('Error'),

    'ErrorPrototype': vr.create('Error.prototype')
};

});