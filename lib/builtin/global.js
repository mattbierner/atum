/**
 * @fileOverview Exported Builtin Global References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'global': value_reference.create(),
    
    'globalEval': value_reference.create(),
    'globalParseInt': value_reference.create(),
    'globalParseFloat': value_reference.create(),
    'globalDecodeURI': value_reference.create(),
    'globalDecodeURIComponent': value_reference.create(),
    'globalEncodeURI': value_reference.create(),
    'globalEncodeURIComponent': value_reference.create()
};

});
