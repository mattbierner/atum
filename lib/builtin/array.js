/**
 * @fileOverview
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Array': new value_reference.ValueReference(),
    'ArrayIsArray': new value_reference.ValueReference(),

    'ArrayPrototype': new value_reference.ValueReference()
};

});