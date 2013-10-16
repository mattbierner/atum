/**
 * @fileOverview Exported Builtin Global References
 */
define(['atum/value_reference'],
function(vr){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'global': vr.create('global'),
    
    'globalEval': vr.create('eval'),
    'globalParseInt': vr.create('parseInt'),
    'globalParseFloat': vr.create('parseFloat'),
    'globalDecodeURI': vr.create('decodeURI'),
    'globalDecodeURIComponent': vr.create('decodeURIComponent'),
    'globalEncodeURI': vr.create('globalEncodeURI'),
    'globalEncodeURIComponent': vr.create('encodeURIComponent')
};

});
