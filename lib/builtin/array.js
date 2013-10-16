/**
 * @fileOverview Exported Builtin Array References
 */
define(['atum/value_reference'],
function(vr){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Array': vr.create('Array'),
    'ArrayIsArray': vr.create('Array.isArray'),

    'ArrayPrototype': vr.create('Array.prototype')
};

});