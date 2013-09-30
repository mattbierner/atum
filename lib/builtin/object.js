/**
 * @fileOverview Exported Builtin Object References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Object': value_reference.create(),
    'ObjectCreate': value_reference.create(),
    'ObjectDefineProperty': value_reference.create(),
    'ObjectDefineProperties': value_reference.create(),
    'ObjectGetOwnPropertyDescriptor': value_reference.create(),
    'ObjectGetOwnPropertyNames': value_reference.create(),
    'ObjectGetPrototypeOf': value_reference.create(),
    'ObjectKeys': value_reference.create(),

    'ObjectPrototype': value_reference.create(),
    'ObjectPrototypeValueOf': value_reference.create(),
    'ObjectPrototypeToString': value_reference.create(),
    'ObjectPrototypeHasOwnProperty': value_reference.create(),
    'ObjectPrototypeIsPrototypeOf':  value_reference.create(),
    'ObjectPrototypePropertyIsEnumerable':  value_reference.create(),
};

});