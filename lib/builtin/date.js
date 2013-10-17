/**
 * @fileOverview Exported Date References
 */
define(['atum/value_reference'],
function(vr){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Date': vr.create('Date'),
    'DateParse': vr.create('Date.parse'),
    'DateUTC': vr.create('Date.UTC'),
    'DateNow': vr.create('Date.now'),

    'DatePrototype': vr.create('Date.prototype'),
    'DatePrototypeToString': vr.create('Date.prototype.toString'),
    'DatePrototypeToDateString': vr.create('Date.prototype.toDateString'),
    'DatePrototypeToTimeString': vr.create('Date.prototype.toTimeString'),
    'DatePrototypeToLocaleString': vr.create('Date.prototype.toLocaleString'),
    'DatePrototypeToLocaleDateString': vr.create('Date.prototype.toLocaleDateString'),
    'DatePrototypeLocaleTimeString': vr.create('Date.prototype.toLocaleTimeString'),
    'DatePrototypeToUTCString': vr.create('Date.prototype.toUTCString'),
    'DatePrototypeToISOString': vr.create('Date.prototype.toISOString'),
    
    'DatePrototypeValueOf': vr.create('Date.prototype.valueOf'),
    'DatePrototypeToJSON': vr.create('Date.prototype.toJSON'),

    'DatePrototypeGetTimezoneOffset': vr.create('Date.prototype.getTimezoneOffset'),

    'DatePrototypeGetFullYear': vr.create('Date.prototype.getFullYear'),
    'DatePrototypeSetFullYear': vr.create('Date.prototype.setFullYear'),
    
    'DatePrototypeGetUTCFullYear': vr.create('Date.prototype.getUTCFullYear'),
    'DatePrototypeSetUTCFullYear': vr.create('Date.prototype.setUTCFullYear'),
    
    'DatePrototypeGetDate': vr.create('Date.prototype.getDate'),
    'DatePrototypeSetDate': vr.create('Date.prototype.setDate'),
    
    'DatePrototypeGetUTCDate': vr.create('Date.prototype.getUTCDate'),
    'DatePrototypeSetUTCDate': vr.create('Date.prototype.setUTCDate'),
    
    'DatePrototypeGetMonth': vr.create('Date.prototype.getMonth'),
    'DatePrototypeSetMonth': vr.create('Date.prototype.setMonth'),
    
    'DatePrototypeGetUTCMonth': vr.create('Date.prototype.getUTCMonth'),
    'DatePrototypeSetUTCMonth': vr.create('Date.prototype.setUTCMonth'),
    
    'DatePrototypeGetTime': vr.create('Date.prototype.getTime'),
    'DatePrototypeSetTime': vr.create('Date.prototype.setTime'),
    
    'DatePrototypeGetUTCTime': vr.create('Date.prototype.getUTCTime'),
    'DatePrototypeSetUTCTime': vr.create('Date.prototype.setUTCTime'),

    'DatePrototypeGetDay': vr.create('Date.prototype.getDay'),
    
    'DatePrototypeGetUTCDay': vr.create('Date.prototype.getUTCDay'),
    
    'DatePrototypeGetHours': vr.create('Date.prototype.getHours'),
    'DatePrototypeSetHours': vr.create('Date.prototype.setHours'),

    'DatePrototypeGetUTCHours': vr.create('Date.prototype.getUTCHours'),
    'DatePrototypeSetUTCHours': vr.create('Date.prototype.setUTCHours'),

    'DatePrototypeGetMinutes': vr.create('Date.prototype.getMinutes'),
    'DatePrototypeSetMinutes': vr.create('Date.prototype.setMinutes'),

    'DatePrototypeGetUTCMinutes': vr.create('Date.prototype.getUTCMinutes'),
    'DatePrototypeSetUTCMinutes': vr.create('Date.prototype.setUTCMinutes'),

    'DatePrototypeGetSeconds': vr.create('Date.prototype.getSeconds'),
    'DatePrototypeSetSeconds': vr.create('Date.prototype.setSeconds'),

    'DatePrototypeGetUTCSeconds': vr.create('Date.prototype.getUTCSeconds'),
    'DatePrototypeSetUTCSeconds': vr.create('Date.prototype.setUTCSeconds'),

    'DatePrototypeGetMilliseconds': vr.create('Date.prototype.getMilliseconds'),
    'DatePrototypeSetMilliseconds': vr.create('Date.prototype.setMilliseconds'),

    'DatePrototypeGetUTCMilliseconds': vr.create('Date.prototype.getUTCMilliseconds'),
    'DatePrototypeSetUTCMilliseconds': vr.create('Date.prototype.setUTCMilliseconds')
};

});