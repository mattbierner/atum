/**
 * @fileOverview Exported Builtin Math References
 */
define(['atum/value_reference'],
function(vr){
"use strict";

/* Exports
 ******************************************************************************/
return {
    'Math': vr.create('Math'),

    'MathAcos': vr.create('Math.acos'),
    'MathAsin': vr.create('Math.asin'),
    'MathAtan': vr.create('Math.atan'),
    'MathAtan2': vr.create('Math.atan2'),
    'MathCeil': vr.create('Math.ceil'),
    'MathCos': vr.create('Math.cos'),
    'MathExp': vr.create('Math.exp'),
    'MathFloor': vr.create('Math.floor'),
    'MathLog': vr.create('Math.log'),
    'MathPow': vr.create('Math.pow'),
    'MathRandom': vr.create('Math.random'),
    'MathRound': vr.create('Math.round'),
    'MathSin': vr.create('Math.sin'),
    'MathSqrt': vr.create('Math.sqrt'),
    'MathTan': vr.create('Math.tan')
};

});