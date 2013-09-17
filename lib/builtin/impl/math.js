/**
 * @fileOverview The builtin math object.
 */

var hostMath = Math;

define(['exports',
        'atum/compute',
        'atum/builtin/math',
        'atum/builtin/object',
        'atum/builtin/meta/object',
        'atum/operations/evaluation',
        'atum/operations/number',
        'atum/operations/type_conversion',
        'atum/value/number',
        'text!atum/builtin/hosted/math.js'],
function(exports,
        compute,
        math_ref,
        builtin_object,
        meta_object,
        evaluation,
        number,
        type_conversion,
        number_value){
//"use strict";

/* Math
 ******************************************************************************/
var Math = function() {
    meta_object.Object.call(this, this.proto, this.properties);
};
Math.prototype = new meta_object.Object;
Math.prototype.constructor = Math; 

Math.prototype.proto = builtin_object.ObjectPrototype;

Math.prototype.properties = {
    'E': {
        'value': new number_value.Number(hostMath.E),
        'writable': false,
        'enumerable': false,
        'Configurable': false
    },
    'LN10': {
        'value': new number_value.Number(hostMath.LN10),
        'writable': false,
        'enumerable': false,
        'Configurable': false
    },
    'LN2': {
        'value': new number_value.Number(hostMath.LN2),
        'writable': false,
        'enumerable': false,
        'Configurable': false
    },
    'LOG2E': {
        'value': new number_value.Number(hostMath.LOG2E),
        'writable': false,
        'enumerable': false,
        'Configurable': false
    },
    'LOG10E': {
        'value': new number_value.Number(hostMath.LOG10E),
        'writable': false,
        'enumerable': false,
        'Configurable': false
    },
    'PI': {
        'value': new number_value.Number(hostMath.PI),
        'writable': false,
        'enumerable': false,
        'Configurable': false
    },
    'SQRT1_2': {
        'value': new number_value.Number(hostMath.SQRT1_2),
        'writable': false,
        'enumerable': false,
        'Configurable': false
    },
    'SQRT2': {
        'value': new number_value.Number(hostMath.SQRT2),
        'writable': false,
        'enumerable': false,
        'Configurable': false
    },
    'acos': {
        'value': math_ref.MathAcos
    },
    'asin': {
        'value': math_ref.MathAsin
    },
    'atan': {
        'value': math_ref.MathAtan
    },
    'atan2': {
        'value': math_ref.MathAtan2
    },
    'ceil': {
        'value': math_ref.MathCeil
    },
    'cos': {
        'value': math_ref.MathCos
    },
    'exp': {
        'value': math_ref.MathExp
    },
    'floor': {
        'value': math_ref.MathFloor
    },
    'log': {
        'value': math_ref.MathLog
    },
    'pow': {
        'value': math_ref.MathPow
    },
    'random': {
        'value': math_ref.MathRandom
    },
    'round': {
        'value': math_ref.MathRound
    },
    'sin': {
        'value': math_ref.MathSin
    },
    'sqrt': {
        'value': math_ref.MathSqrt
    },
    'tan': {
        'value': math_ref.MathTan
    },
};



/**
 * `Math.acos(x)`
 */
var mathAcos = function(ref, thisRef, args) {
    return compute.bind(
        type_conversion.toNumber(args.getArg(0)),
        function(x) {
            if (x.value === NaN || x.value > 1 || x.value < 1)
                return number.NaN;
            return number.create(hostMath.acos(x.value));
        });
};

/**
 * `Math.asin(x)`
 */
var mathAsin = function(ref, thisRef, args) {
    return compute.bind(
        type_conversion.toNumber(args.getArg(0)),
        function(x) {
            if (x.value === NaN || x.value > 1 || x.value < 1)
                return number.NaN;
            return number.create(hostMath.asin(x.value));
        });
};

/**
 * `Math.atan(x)`
 */
var mathAtan = function(ref, thisRef, args) {
    return compute.bind(
        type_conversion.toNumber(args.getArg(0)),
        function(x) {
            if (x.value === NaN)
                return number.NaN;
            return number.create(hostMath.atan(x.value));
        });
};

/**
 * `Math.atan2(x, y)`
 */
var mathAtan2 = function(ref, thisRef, args) {
    return compute.binary(
        type_conversion.toNumber(args.getArg(0)),
        type_conversion.toNumber(args.getArg(1)),
        function(x, y) {
            if (x.value === NaN || y.value === NaN)
                return number.NaN;
            return number.create(hostMath.atan2(x.value, y.value));
        });
};

/**
 * `Math.ceil(x)`
 */
var mathCeil = function(ref, thisRef, args) {
    return compute.bind(
        type_conversion.toNumber(args.getArg(0)),
        function(x) {
            if (x.value === NaN)
                return number.NaN;
            return number.create(hostMath.ceil(x.value));
        });
};

/**
 * `Math.cos(x)`
 */
var mathCos = function(ref, thisRef, args) {
    return compute.bind(
        type_conversion.toNumber(args.getArg(0)),
        function(x) {
            if (x.value === NaN)
                return number.NaN;
            return number.create(hostMath.cos(x.value));
        });
};

/**
 * `Math.exp(x)`
 */
var mathExp = function(ref, thisRef, args) {
    return compute.bind(
        type_conversion.toNumber(args.getArg(0)),
        function(x) {
            if (x.value === NaN)
                return number.NaN;
            return number.create(hostMath.exp(x.value));
        });
};

/**
 * `Math.floor(x)`
 */
var mathFloor = function(ref, thisRef, args) {
    return compute.bind(
        type_conversion.toNumber(args.getArg(0)),
        function(x) {
            if (x.value === NaN)
                return number.NaN;
            return number.create(hostMath.floor(x.value));
        });
};

/**
 * `Math.log(x)`
 */
var mathLog = function(ref, thisRef, args) {
    return compute.bind(
        type_conversion.toNumber(args.getArg(0)),
        function(x) {
            if (x.value === NaN || x.value < 0)
                return number.NaN;
            return number.create(hostMath.log(x.value));
        });
};

/**
 * `Math.pow(x, y)`
 */
var mathPow = function(ref, thisRef, args) {
    return compute.binary(
        type_conversion.toNumber(args.getArg(0)),
        type_conversion.toNumber(args.getArg(1)),
        function(x, y) {
            if (y.value === NaN)
                return number.NaN;
            if (y.value === 0)
                return number.create(1);
            if (x.value === NaN)
                return number.NaN;
            return number.create(hostMath.pow(x.value, y.value));
        });
};

/**
 * `Math.random()`
 * @todo: this must pull the randoms from a stream stored on the state.
 */
var mathRandom = function(ref, thisRef, args) {
    return number.create(hostMath.random());
};

/**
 * `Math.round(x)`
 */
var mathRound = function(ref, thisRef, args) {
    return compute.bind(
        type_conversion.toNumber(args.getArg(0)),
        function(x) {
            if (x.value === NaN)
                return number.NaN;
            return number.create(hostMath.round(x.value));
        });
};

/**
 * `Math.sin(x)`
 */
var mathSin = function(ref, thisRef, args) {
    return compute.bind(
        type_conversion.toNumber(args.getArg(0)),
        function(x) {
            if (x.value === NaN)
                return number.NaN;
            return number.create(hostMath.sin(x.value));
        });
};

/**
 * `Math.sqrt(x)`
 */
var mathSqrt = function(ref, thisRef, args) {
    return compute.bind(
        type_conversion.toNumber(args.getArg(0)),
        function(x) {
            if (x.value === NaN || x.value < 0)
                return number.NaN;
            return number.create(hostMath.sqrt(x.value));
        });
};

/**
 * `Math.tan(x)`
 */
var mathTan = function(ref, thisRef, args) {
    return compute.bind(
        type_conversion.toNumber(args.getArg(0)),
        function(x) {
            if (x.value === NaN || x.value === +Infinity || x.value === -Infinity)
                return number.NaN;
            return number.create(hostMath.sin(x.value));
        });
};


/* Initialization
 ******************************************************************************/
var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function');

    return compute.sequence(
        math_ref.Math.setValue(new Math()),

        builtin_function.create(math_ref.MathAcos, 'acos', 1, mathAcos),
        builtin_function.create(math_ref.MathAsin, 'asin', 1, mathAsin),
        builtin_function.create(math_ref.MathAtan, 'atan', 1, mathAtan),
        builtin_function.create(math_ref.MathAtan2, 'atan2', 2, mathAtan2),
        builtin_function.create(math_ref.MathCeil, 'ceil', 1, mathCeil),
        builtin_function.create(math_ref.MathCos, 'cos', 1, mathCos),
        builtin_function.create(math_ref.MathExp, 'exp', 1, mathExp),
        builtin_function.create(math_ref.MathFloor, 'floor', 1, mathFloor),
        builtin_function.create(math_ref.MathLog, 'log', 1, mathLog),
        builtin_function.create(math_ref.MathPow, 'power', 2, mathPow),
        builtin_function.create(math_ref.MathRandom, 'random', 0, mathRandom),
        builtin_function.create(math_ref.MathRound, 'round', 1, mathRound),
        builtin_function.create(math_ref.MathSin, 'sin', 1, mathSin),
        builtin_function.create(math_ref.MathSqrt, 'sqrt', 1, mathSqrt),
        builtin_function.create(math_ref.MathTan, 'tan', 1, mathTan),

        evaluation.evaluateFile('atum/builtin/hosted/math.js'));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

});