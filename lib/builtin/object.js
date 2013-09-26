/**
 * @fileOverview Exported Builtin Object References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Object': new value_reference.ValueReference(),
    'ObjectCreate': new value_reference.ValueReference(),
    'ObjectDefineProperty': new value_reference.ValueReference(),
    'ObjectDefineProperties': new value_reference.ValueReference(),
    'ObjectGetOwnPropertyDescriptor': new value_reference.ValueReference(),
    'ObjectGetOwnPropertyNames': new value_reference.ValueReference(),
    'ObjectGetPrototypeOf': new value_reference.ValueReference(),
    'ObjectKeys': new value_reference.ValueReference(),

    'ObjectPrototype': new value_reference.ValueReference(),
    'ObjectPrototypeValueOf': new value_reference.ValueReference(),
    'ObjectPrototypeToString': new value_reference.ValueReference(),
    'ObjectPrototypeHasOwnProperty': new value_reference.ValueReference(),
    'ObjectPrototypeIsPrototypeOf':  new value_reference.ValueReference(),
    'ObjectPrototypePropertyIsEnumerable':  new value_reference.ValueReference(),
};

});