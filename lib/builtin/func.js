/**
 * @fileOverview Builtin `Function` object values.
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Function': new value_reference.ValueReference(),

    'FunctionPrototype': new value_reference.ValueReference(),
    'FunctionPrototypeApply': new value_reference.ValueReference(),
    'FunctionPrototypeBind': new value_reference.ValueReference(),
    'FunctionPrototypeCall': new value_reference.ValueReference()
};

});