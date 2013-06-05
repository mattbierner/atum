/**
 * @fileOverview ECMAScript 5.1 semantics.
 */
define(['atum/compute',
        'atum/operations/environment',
        'atum/operations/number', 'atum/operations/string', 'atum/operations/boolean', 'atum/operations/object',
        'atum/operations/nil'],
function(compute,
        environment_semantics,
        number, string, boolean, object, nil){
"use strict";

/* Values
 ******************************************************************************/
var numberLiteral = number.create;

var booleanLiteral = boolean.create;

var stringLiteral = string.create;

var nullLiteral = nil.create;

var regularExpressionLiteral /* @TODO */;

var identifier = environment_semantics.getBinding;

/* Export
 ******************************************************************************/
return {
    'numberLiteral': numberLiteral,
    'booleanLiteral': booleanLiteral,
    'stringLiteral': stringLiteral,
    'nullLiteral': nullLiteral,
    'regularExpressionLiteral': regularExpressionLiteral,
    'identifier': identifier
};

});