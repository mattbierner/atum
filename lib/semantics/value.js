/**
 * @fileOverview Value Semantics.
 */
define(['atum/compute',
        'atum/operations/boolean',
        'atum/operations/environment',
        'atum/operations/nil',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/string'],
function(compute,
        boolean,
        environment,
        nil,
        number,
        object,
        string){
"use strict";

/* Literals
 ******************************************************************************/
var numberLiteral = number.create;

var booleanLiteral = boolean.create;

var stringLiteral = string.create;

var nullLiteral = nil.create;

var regularExpressionLiteral /* @TODO */;

/* Symbols
 ******************************************************************************/
var identifier = environment.getBinding;

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