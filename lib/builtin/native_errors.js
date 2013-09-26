/**
 * @fileOverview Exported Builtin Native Error References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'EvalError': new value_reference.ValueReference(),
    'EvalErrorPrototype': new value_reference.ValueReference(),
    
    'RangeError': new value_reference.ValueReference(),
    'RangeErrorPrototype': new value_reference.ValueReference(),
    
    'ReferenceError': new value_reference.ValueReference(),
    'ReferenceErrorPrototype': new value_reference.ValueReference(),
    
    'SyntaxError': new value_reference.ValueReference(),
    'SyntaxErrorPrototype': new value_reference.ValueReference(),
    
    'TypeError': new value_reference.ValueReference(),
    'TypeErrorPrototype': new value_reference.ValueReference(),
    
    
    'UriError': new value_reference.ValueReference(),
    'UriErrorPrototype': new value_reference.ValueReference()
};

});