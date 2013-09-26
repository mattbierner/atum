/**
 * @fileOverview Exported Builtin Math References
 */
define(['atum/value_reference'],
function(value_reference){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Math': new value_reference.ValueReference(),

    'MathAcos': new value_reference.ValueReference(),
    'MathAsin': new value_reference.ValueReference(),
    'MathAtan': new value_reference.ValueReference(),
    'MathAtan2': new value_reference.ValueReference(),
    'MathCeil': new value_reference.ValueReference(),
    'MathCos': new value_reference.ValueReference(),
    'MathExp': new value_reference.ValueReference(),
    'MathFloor': new value_reference.ValueReference(),
    'MathLog': new value_reference.ValueReference(),
    'MathPow': new value_reference.ValueReference(),
    'MathRandom': new value_reference.ValueReference(),
    'MathRound': new value_reference.ValueReference(),
    'MathSin': new value_reference.ValueReference(),
    'MathSqrt': new value_reference.ValueReference(),
    'MathTan': new value_reference.ValueReference()
};

});