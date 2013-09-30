/**
 * @fileOverview Exported Builtin Error References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Error': value_reference.create(),

    'ErrorPrototype': value_reference.create()
};

});