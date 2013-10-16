/**
 * @fileOverview Exported Builtin Native Error References
 */
define(['atum/value_reference'],
function(vr){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'EvalError': vr.create('EvalError'),
    'EvalErrorPrototype': vr.create('EvalError.prototype'),
    
    'RangeError': vr.create('RangeError'),
    'RangeErrorPrototype': vr.create('RangeError.prototype'),
    
    'ReferenceError': vr.create('ReferenceError'),
    'ReferenceErrorPrototype': vr.create('ReferenceError.prototype'),
    
    'SyntaxError': vr.create('SyntaxError'),
    'SyntaxErrorPrototype': vr.create('SyntaxError.prototype'),
    
    'TypeError': vr.create('TypeError'),
    'TypeErrorPrototype': vr.create('TypeError.prototype'),
    
    'UriError': vr.create('UriError'),
    'UriErrorPrototype': vr.create('UriError.prototype')
};

});