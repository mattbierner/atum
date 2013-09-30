/**
 * @fileOverview Exported Builtin Array References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Array': value_reference.create(),
    'ArrayIsArray': value_reference.create(),

    'ArrayPrototype': value_reference.create()
};

});