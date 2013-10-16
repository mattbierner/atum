/**
 * @fileOverview Exported Builtin Object References
 */
define(['atum/value_reference'],
function(vr){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Object': vr.create('Object'),
    'ObjectCreate': vr.create('Object.create'),
    'ObjectDefineProperty': vr.create('Object.defineProperty'),
    'ObjectDefineProperties': vr.create('Object.defineProperties'),
    'ObjectGetOwnPropertyDescriptor': vr.create('Object.getOwnPropertyDescriptor'),
    'ObjectGetOwnPropertyNames': vr.create('Object.getOwnPropertyNames'),
    'ObjectGetPrototypeOf': vr.create('Object.getPrototypeOf'),
    'ObjectKeys': vr.create('Object.keys'),

    'ObjectPrototype': vr.create('Object.prototype'),
    'ObjectPrototypeHasOwnProperty': vr.create('Object.prototype.hasOwnProperty'),
    'ObjectPrototypeIsPrototypeOf':  vr.create('Object.prototype.isPrototypeOf'),
    'ObjectPrototypePropertyIsEnumerable':  vr.create('Object.prototype.propertyIsEnumerable'),
    'ObjectPrototypeToString': vr.create('Object.prototype.toString'),
    'ObjectPrototypeValueOf': vr.create('Object.prototype.valueOf')
};

});