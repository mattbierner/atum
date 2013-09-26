/**
 * @fileOverview Exported Builtin Global References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'global': new value_reference.ValueReference(),
    
    'globalEval': new value_reference.ValueReference(),
    'globalParseInt': new value_reference.ValueReference(),
    'globalParseFloat': new value_reference.ValueReference(),
    'globalDecodeURI': new value_reference.ValueReference(),
    'globalDecodeURIComponent': new value_reference.ValueReference(),
    'globalEncodeURI': new value_reference.ValueReference(),
    'globalEncodeURIComponent': new value_reference.ValueReference()
};

});
