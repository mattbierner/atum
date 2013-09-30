/**
 * @fileOverview Exported Builtin Function References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Function': value_reference.create(),

    'FunctionPrototype': value_reference.create(),
    'FunctionPrototypeApply': value_reference.create(),
    'FunctionPrototypeBind': value_reference.create(),
    'FunctionPrototypeCall': value_reference.create()
};

});