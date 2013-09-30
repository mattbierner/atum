/**
 * @fileOverview Exported Builtin Native Error References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'EvalError': value_reference.create(),
    'EvalErrorPrototype': value_reference.create(),
    
    'RangeError': value_reference.create(),
    'RangeErrorPrototype': value_reference.create(),
    
    'ReferenceError': value_reference.create(),
    'ReferenceErrorPrototype': value_reference.create(),
    
    'SyntaxError': value_reference.create(),
    'SyntaxErrorPrototype': value_reference.create(),
    
    'TypeError': value_reference.create(),
    'TypeErrorPrototype': value_reference.create(),
    
    
    'UriError': value_reference.create(),
    'UriErrorPrototype': value_reference.create()
};

});