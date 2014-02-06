/**
 * @fileOverview The builtin math object.
 */

var hostMath = Math;

define(['exports',
        'atum/compute',
        'atum/compute/io',
        'atum/builtin/math',
        'atum/builtin/object',
        'atum/builtin/meta/object',
        'atum/builtin/operations/builtin_function',
        'atum/operations/evaluation',
        'atum/operations/number',
        'atum/operations/type_conversion',
        'atum/value/math',
        'atum/value/property',
        'text!atum/builtin/hosted/math.js'],
function(exports,
        compute,
        io,
        math_builtin,
        object_builtin,
        meta_object,
        builtin_function,
        evaluation,
        number,
        type_conversion,
        math,
        property){
"use strict";

/* Math
 ******************************************************************************/
var Math = new meta_object.Object(
    object_builtin.ObjectPrototype, {
        'E': property.createValueProperty(math.E),
        'LN10': property.createValueProperty(math.LN10),
        'LN2': property.createValueProperty(math.LN2),
        'LOG2E': property.createValueProperty(math.LNOG2E),
        'LOG10E': property.createValueProperty(math.LN10E),
        'PI': property.createValueProperty(math.PI),
        'SQRT1_2': property.createValueProperty(math.SQRT1_2),
        'SQRT2': property.createValueProperty(math.SQRT2),
        
        'acos': property.createValueProperty(math_builtin.MathAcos),
        'asin': property.createValueProperty(math_builtin.MathAsin),
        'atan': property.createValueProperty(math_builtin.MathAtan),
        'atan2': property.createValueProperty(math_builtin.MathAtan2),
        'ceil': property.createValueProperty(math_builtin.MathCeil),
        'cos': property.createValueProperty(math_builtin.MathCos),
        'exp': property.createValueProperty(math_builtin.MathExp),
        'floor': property.createValueProperty(math_builtin.MathFloor),
        'log': property.createValueProperty(math_builtin.MathLog),
        'pow': property.createValueProperty(math_builtin.MathPow),
        'random': property.createValueProperty(math_builtin.MathRandom),
        'round': property.createValueProperty(math_builtin.MathRound),
        'sin': property.createValueProperty(math_builtin.MathSin),
        'sqrt': property.createValueProperty(math_builtin.MathSqrt),
        'tan': property.createValueProperty(math_builtin.MathTan)
    },
    true);

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
    return number.from(
        compute.liftIO(io.random));
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
            return number.create(hostMath.tan(x.value));
        });
};


/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        math_builtin.Math.setValue(Math),

        builtin_function.create(math_builtin.MathAcos, 'acos', 1, mathAcos),
        builtin_function.create(math_builtin.MathAsin, 'asin', 1, mathAsin),
        builtin_function.create(math_builtin.MathAtan, 'atan', 1, mathAtan),
        builtin_function.create(math_builtin.MathAtan2, 'atan2', 2, mathAtan2),
        builtin_function.create(math_builtin.MathCeil, 'ceil', 1, mathCeil),
        builtin_function.create(math_builtin.MathCos, 'cos', 1, mathCos),
        builtin_function.create(math_builtin.MathExp, 'exp', 1, mathExp),
        builtin_function.create(math_builtin.MathFloor, 'floor', 1, mathFloor),
        builtin_function.create(math_builtin.MathLog, 'log', 1, mathLog),
        builtin_function.create(math_builtin.MathPow, 'power', 2, mathPow),
        builtin_function.create(math_builtin.MathRandom, 'random', 0, mathRandom),
        builtin_function.create(math_builtin.MathRound, 'round', 1, mathRound),
        builtin_function.create(math_builtin.MathSin, 'sin', 1, mathSin),
        builtin_function.create(math_builtin.MathSqrt, 'sqrt', 1, mathSqrt),
        builtin_function.create(math_builtin.MathTan, 'tan', 1, mathTan));
};

var configure = function(mutableBinding, immutableBinding) {
    return mutableBinding('Math', math_builtin.Math);
};

var execute = function() {
    return evaluation.evaluateFile('atum/builtin/hosted/math.js');
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;
exports.configure = configure;
exports.execute = execute;

});