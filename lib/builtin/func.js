/**
 * @fileOverview Exported Builtin Function References
 */
define(['atum/value_reference'],
function(vr){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Function': vr.create('Function'),

    'FunctionPrototype': vr.create('Function.prototype'),
    'FunctionPrototypeApply': vr.create('Function.prototype.apply'),
    'FunctionPrototypeBind': vr.create('Function.prototype.bind'),
    'FunctionPrototypeCall': vr.create('Function.prototype.call')
};

});