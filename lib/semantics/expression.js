/**
 * @fileOverview ECMAScript 5.1 expression semantics.
 */
define(['atum/compute',
        'atum/completion',
        'atum/internal_reference',
        'atum/context/environment',
        'atum/value/value', 'atum/value/object',
        'atum/operations/environment',
        'atum/operations/number', 'atum/operations/string', 'atum/operations/boolean', 'atum/operations/object',
        'atum/operations/nil', 'atum/operations/undef',
        'atum/operations/type_conversion', 'atum/operations/compare',
        'atum/builtin/object',
        'atum/builtin/language_function',
        'atum/value/type', 'atum/value/undef',
        'atum/operations/execution_context',
        'atum/operations/internal_reference',
        'atum/operations/value_reference'],
function(compute,
        completion,
        internal_reference_value,
        environment,
        value, object_value,
        environment_semantics,
        number, string, boolean, object,
        nil, undef_semantics,
        type_conversion, compare,
        object_builtin,
        language_function,
        type, undef,
        execution_context,
        internal_reference,
        value_reference){
//"use strict";

/* 
 ******************************************************************************/
var map = Function.prototype.call.bind(Array.prototype.map);
var reduce = Function.prototype.call.bind(Array.prototype.reduce);
var reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight);


/* Functions
 ******************************************************************************/
/**
 * 
 */
var functionExpression = (function(){
    var extract = function(body) {
        return compute.bind(body, function(x) {
            if (x instanceof completion.Completion) {
                switch (x.type)
                {
                case completion.NormalCompletion.type:
                    return undef_semantics.create();
                case completion.ReturnCompletion.type:
                    return compute.just(x.value);
                case completion.BreakCompletion.type:
                    return compute.error("Break not in loop");
                case completion.ContinueCompletion.type:
                    return compute.error("Continue not in loop");
                }
            }
            return compute.just(x);
        });
    };
    
    return function(id, params, body) {
        var code = extract(body);
        return compute.Computation('Function',
            compute.bind(environment_semantics.getEnvironment(), function(scope) {
                return compute.bind(execution_context.getStrict(), function(strict) {
                    return value_reference.create(
                        new language_function.LanguageFunction(scope, id, params, code, strict));
                    });
            }));
    };
}());

/* Binary Operator Semantics
 ******************************************************************************/
/**
 * 
 */
var addOperator = function(left, right) {
    return compute.binary(
        type_conversion.toPrimitive(internal_reference.getValue(left)),
        type_conversion.toPrimitive(internal_reference.getValue(right)),
        function(lprim, rprim) {
            var l = compute.just(lprim),
                r = compute.just(rprim);
            return (value.type(lprim) === "string" || value.type(rprim) === "string" ?
                string.concat(
                     type_conversion.toString(l),
                     type_conversion.toString(r)) :
                number.add(
                    type_conversion.toNumber(l),
                    type_conversion.toNumber(r)));
        });
};

/**
 * 
 */
var subtractOperator = function(left, right) {
    return number.subtract(
        type_conversion.toNumber(internal_reference.getValue(left)),
        type_conversion.toNumber(internal_reference.getValue(right)));
};

/**
 * 
 */
var multiplyOperator = function(left, right) {
    return number.multiply(
        type_conversion.toNumber(internal_reference.getValue(left)),
        type_conversion.toNumber(internal_reference.getValue(right)));
};

/**
 * 
 */
var divideOperator = function(left, right) {
    return number.divide(
        type_conversion.toNumber(internal_reference.getValue(left)),
        type_conversion.toNumber(internal_reference.getValue(right)));
};

/**
 * 
 */
var remainderOperator = function(left, right) {
    return number.remainder(
        type_conversion.toNumber(internal_reference.getValue(left)),
        type_conversion.toNumber(internal_reference.getValue(right)));
};

/**
 * 
 */
var leftShiftOperator = function(left, right) {
    return number.leftShift(
        type_conversion.toInt32(internal_reference.getValue(left)),
        type_conversion.toUint32(internal_reference.getValue(right)));
};

/**
 * 
 */
var signedRightShiftOperator = function(left, right) {
    return number.signedRightShift(
        type_conversion.toInt32(internal_reference.getValue(left)),
        type_conversion.toUint32(internal_reference.getValue(right)));
};

/**
 * 
 */
var unsignedRightShiftOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(internal_reference.getValue(left)),
        type_conversion.toUint32(internal_reference.getValue(right)));
};

/**
 * 
 */
var bitwiseAndOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(internal_reference.getValue(left)),
        type_conversion.toInt32(internal_reference.getValue(right)));
};

/**
 * 
 */
var bitwiseXorOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(internal_reference.getValue(left)),
        type_conversion.toInt32(internal_reference.getValue(right)));
};

/**
 * 
 */
var bitwiseOrOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(internal_reference.getValue(left)),
        type_conversion.toInt32(internal_reference.getValue(right)));
};

/* Equality Relational Operators
 ******************************************************************************/
/**
 * Semantics for an equal operator.
 * 
 * Compares 'left' value to 'right' value.
 */
var equalOperator = function(left, right) {
    return compare.equal(
        internal_reference.getValue(left),
        internal_reference.getValue(right));
};

/**
 * Semantics for a strict equal operator.
 * 
 * Does a strict comparison of 'left' value to 'right' value.
 */
var strictEqualOperator = function(left, right) {
    return compare.strictEqual(
        internal_reference.getValue(left),
        internal_reference.getValue(right));
};

/**
 * Semantics for a not equal operator.
 */
var notEqualOperator = function(left, right) {
    return logicalNotOperator(equalOperator(left, right));
};

/**
 * Semantics for a strict not equal operator.
 */
var strictNotEqualOperator = function(left, right) {
    return logicalNotOperator(strictEqualOperator(left, right));
};


/* Numeric Binary Relational Operators
 * 
 * @TODO Should we return undefined values when NaN is used?
 ******************************************************************************/
var _relationalOperator = function(op) {
    return function(left, right) {
        return op(
            type_conversion.toNumber(internal_reference.getValue(left)),
            type_conversion.toNumber(internal_reference.getValue(right)));
    };
};

/**
 *
 */
var ltOperator = _relationalOperator(number.lt);

/**
 * 
 */
var lteOperator = _relationalOperator(number.lte);

/**
 * 
 */
var gtOperator = _relationalOperator(number.gt);

/**
 * 
 */
var gteOperator = _relationalOperator(number.gte);

var instanceofOperator = function(left, right) {
    return compute.bind(
        internal_reference.getValue(left),
        function(l) {
            return compute.bind(
                internal_reference.getValue(right),
                function(r) {
                    return function(ctx, v, ok, err) {
                        if (value.type(r) !== 'object') {
                            return err('Instanceof', ctx);
                        }
                        return ok(value.hasInstance(l), ctx, v);
                    };
                });
        });
};

var inOperator;

/* Unary Operator Semantics
 ******************************************************************************/
/**
 * 
 */
var unaryPlusOperator = function(argument) {
    return type_conversion.toNumber(internal_reference.getValue(argument));
};

/**
 * 
 */
var unaryMinusOperator = function(argument) {
    return number.negate(type_conversion.toNumber(internal_reference.getValue(argument)));
};

/**
 * 
 */
var logicalNotOperator = function(argument) {
    return boolean.logicalNot(type_conversion.toBoolean(internal_reference.getValue(argument)));
};

var bitwiseNotOperator = function(argument) {
    return number.bitwiseNot(type_conversion.toInt32(internal_reference.getValue(argument)));
};

/**
 * 
 */
var voidOperator = function(argument) {
    return compute.next(internal_reference.getValue(argument),
        undef_semantics.create());
};

/**
 * 
 */
var typeofOperator = function(argument) {
    return compute.bind(argument, function(val) {
        if (val instanceof internal_reference_value.InternalReference) {
            return compute.bindError(
                typeofOperator(reference_semantics.getValue(compute.just(val))),
                function(x) {
                    return string.create("undefined") ;
                });
        }
        return string.create(value.type(val));
    });
};

/* Update Operator Semantics
 ******************************************************************************/
var _prefixUpdate = function(op) {
    return function(arg) {
        return compute.bind(arg, function(x) {
            if (!(x instanceof internal_reference_value.InternalReference)) {
                return compute.error("ReferenceError");
            }
            return op(arg, type_conversion.toNumber(internal_reference.getValue(arg)));
        });
    };
};

var _postfixUpdate = function(op) {
    return function(arg) {
        return compute.bind(arg, function(x) {
            if (!(x instanceof internal_reference_value.InternalReference)) {
                return compute.error("ReferenceError");
            }
            return compute.bind(
                type_conversion.toNumber(internal_reference.getValue(arg)),
                function(x) {
                    var ax = compute.just(x);
                    return compute.next(op(arg, ax), ax);
                });
        });
    };
};

var _increment = function(expr, val) {
    return internal_reference.setValue(expr, number.increment(val));
};

var _decrement = function(expr, val) {
    return internal_reference.setValue(expr, number.decrement(val));
};

/**
 * Semantics for a prefix increment operation.
 * 
 * Gets the current value of reference 'arg' as a number and increments bound
 * value of reference 'arg'.
 * 
 * Errors if 'arg' does not return a reference value.
 * 
 * @param arg Computation that returns a reference.
 * 
 * @return New value bound to reference 'arg'.
 */
var prefixIncrement = _prefixUpdate(_increment);

/**
 * Semantics for a postfix increment operation.
 * 
 * Gets the current value of reference 'arg' as a number and increments bound
 * value of reference 'arg'.
 * 
 * Errors if 'arg' does not return a reference value.
 * 
 * @param arg Computation that returns a reference.
 * 
 * @return Old value bound to reference 'arg' as a number.
 */
var postfixIncrement = _postfixUpdate(_increment);

/**
 * Semantics for a prefix decrement operation.
 * 
 * Gets the current value of reference 'arg' as a number and decrements bound
 * value of reference 'arg'.
 * 
 * Errors if 'arg' does not return a reference value.
 * 
 * @param arg Computation that returns a reference.
 * 
 * @return New value bound to reference 'arg'.
 */
var prefixDecrement = _prefixUpdate(_decrement);

/**
 * Semantics for a postfix decrement operation.
 * 
 * Gets the current value of reference 'arg' as a number and decrements bound
 * value of reference 'arg'.
 * 
 * Errors if 'arg' does not return a reference value.
 * 
 * @param arg Computation that returns a reference.
 * 
 * @return Old value bound to reference 'arg' as a number.
 */
var postfixDecrement = _postfixUpdate(_decrement);


/* Logical Binary Operator Semantics
 ******************************************************************************/
/**
 * Semantics for a logical or operation. Shorts when left evaluates to true.
 */
var logicalOr = function(left, right) {
    return compute.bind(
        type_conversion.toBoolean(internal_reference.getValue(left)),
        function(result) {
            return (result.value ? left : right);
    });
};

/**
 * Semantics for a logical and operation. Shorts when left evaluates to false.
 */
var logicalAnd = function(left, right) {
    return compute.bind(
        type_conversion.toBoolean(internal_reference.getValue(left)),
        function(result) {
            return (result.value ? right : left);
        });
};

/* 
 ******************************************************************************/
/**
 * Semantics for a call expression.
 * 
 * Either succeeds with calling 'callee' or fails if 'callee' is not callable. 
 * 
 * @param callee Computation resulting in object being called. 
 * @param args Array of zero or more computations that give the arguments to
 *  call 'callee' with.
 */
var callExpression = (function(){
    var getThisBinding = function(ref) {
        return (ref instanceof internal_reference_value.InternalReference ?
            compute.bind(ref.getBase(), function(base) {
                return compute.just(ref instanceof object.PropertyReference ?
                    base :
                    base.implicitThisValue());
            }) : 
            execution_context.getThisBinding());
    };
    
    return function(callee, args) {
        return compute.Computation('Call Expression',
            compute.binds(
                compute.sequence(
                    callee,
                    internal_reference.getValue(callee),
                    value_reference.getValue(internal_reference.getValue(callee))),
                function(ref, calleeRef, func) {
                    return compute.bind(
                        compute.sequencea(map(args, internal_reference.getValue)),
                        function(args) {
                            if (value.type(func) !== 'object' || !value.isCallable(func)) {
                                return compute.error("TypeError");
                            }
                            return compute.bind(getThisBinding(ref), function(t) {
                                return func.call(calleeRef, t, args);
                            });
                        });
                }));
    };
}());
/**
 * 
 */
var newExpression = function(callee, args) {
    return compute.binds(
        compute.sequence(
            callee,
            value_reference.getValue(internal_reference.getValue(callee)),
            compute.sequence.apply(undefined, map(args, internal_reference.getValue))),
        function(ref, obj, a) {
            return (value.type(obj) === type.OBJECT_TYPE ?
                obj.construct(a) :
                compute.error("Construct err"));
        });
};


/**
 * Semantics for a member expression.
 */
var memberExpression = function(base, property) {
    return compute.Computation('Member Expression',
        compute.binds(
            compute.sequence(
                execution_context.getStrict(),
                base,
                value_reference.getValue(internal_reference.getValue(base)),
                type_conversion.toString(internal_reference.getValue(property))),
            function(strict, baseRef, baseValue, propertyName) {
                var name = propertyName.value;
                return compute.just(baseValue instanceof environment.LexicalEnvironment ?
                    new environment_semantics.EnvironmentReference(name, baseRef, strict) :
                    new object.PropertyReference(name, baseRef, strict));
            }));
};

/* 
 ******************************************************************************/
/**
 * Semantics for a conditional Expression.
 */
var conditionalExpression = function(test, consequent, alternate) {
    return compute.Computation('Conditional Expression',
        compute.bind(
            type_conversion.toBoolean(internal_reference.getValue(test)),
            function(x) {
                return internal_reference.getValue(x.value ? consequent : alternate);
            }));
};

/**
 * Semantics for a sequence of two or more expressions.
 */
var sequenceExpression = function(expressions) {
    return compute.Computation('Sequence Expression',
        reduce(expressions, function(p, c) {
            return compute.next(p, internal_reference.getValue(c));
        }));
};

/**
 * 
 */
var thisExpression = function() {
    return compute.Computation('This Expression',
        execution_context.getThisBinding());
};

/* Object Literal Semantics
 ******************************************************************************/
/**
 * Semantics for creating an object literal.
 * 
 * @param properties Object mapping string key values to property descriptors.
 */
var objectLiteral = function(properties) {
    return object.defineProperties(
        newExpression(compute.just(object_builtin.objectRef), []),
        reduce(Object.keys(properties), function(p, key) {
            var prop = properties[key];
            p[key] = {
                'value': prop.value ? internal_reference.getValue(prop.value) : null,
                'get': prop.get ? internal_reference.getValue(prop.get) : null,
                'set': prop.set ? internal_reference.getValue(prop.set) : null
            };
            return p;
        }, {}));
};

/**
 * @TODO
 */
var arrayLiteral;

/* Assignment Semantics
 ******************************************************************************/
var _dereference = function(ref) {
    return compute.bind(ref, function(x) {
        if (!(x instanceof internal_reference_value.InternalReference))
            return compute.error("Left hand side not reference");
        
        if (x.strict &&
            (x.name === "eval" || x.name === "arguments")) {
            return compute.error("Using eval/arguments in strict");
        }
        return compute.just(x);
    });
};

/**
 * Semantics for simple assignment.
 */
var assignment = function(left, right) {
    return compute.bind(_dereference(left), function(l) {
        return compute.bind(internal_reference.getValue(right), function(r) {
            return compute.next(l.setValue(r), compute.just(r));
        });
    });
};

/**
 * Semantics for an assignment that modifies a value by modifying its current value.
 */
var compoundAssignment = function(op, left, right) {
    return assignment(
        left,
        op(
            internal_reference.getValue(left),
            internal_reference.getValue(right)));
};

/* Export
 ******************************************************************************/
return {
    'functionExpression': functionExpression,
    
// Binary Operator Semantics
    'addOperator': addOperator, 
    'subtractOperator': subtractOperator, 
    'multiplyOperator': multiplyOperator, 
    'divideOperator': divideOperator, 
    'remainderOperator': remainderOperator, 
    
    'leftShiftOperator': leftShiftOperator, 
    'signedRightShiftOperator': signedRightShiftOperator, 
    'unsignedRightShiftOperator': unsignedRightShiftOperator, 
    'bitwiseAndOperator': bitwiseAndOperator,
    'bitwiseXorOperator': bitwiseXorOperator,
    'bitwiseOrOperator': bitwiseOrOperator,

// Binary Comparision Operator Semantics
    'equalOperator': equalOperator,
    'strictEqualOperator': strictEqualOperator,
    'notEqualOperator': notEqualOperator,
    'strictNotEqualOperator': strictNotEqualOperator,
    
//Binary Relational Operator Semantics
    'ltOperator': ltOperator,
    'lteOperator': lteOperator,
    'gtOperator': gtOperator,
    'gteOperator': gteOperator,
    'instanceofOperator': instanceofOperator,
    'inOperator': inOperator,

// Increment and Decrement Operator Semantics
    'prefixIncrement': prefixIncrement,
    'postfixIncrement': postfixIncrement,
    'prefixDecrement': prefixDecrement,
    'postfixDecrement': postfixDecrement,

// Unary Operator Semantics
    'unaryPlusOperator': unaryPlusOperator, 
    'unaryMinusOperator': unaryMinusOperator, 
    'logicalNotOperator': logicalNotOperator, 
    'bitwiseNotOperator': bitwiseNotOperator, 
    'voidOperator': voidOperator, 
    'typeofOperator': typeofOperator, 

// Logical Semantics
    'logicalOr': logicalOr,
    'logicalAnd': logicalAnd,

//
    'callExpression': callExpression,
    'newExpression': newExpression,
    'memberExpression': memberExpression,
    
// Expression Semantics
    'conditionalExpression': conditionalExpression,
    'sequenceExpression': sequenceExpression,
    'thisExpression': thisExpression,
    
// Literals
    'objectLiteral': objectLiteral,
    'arrayLiteral': arrayLiteral,
    
// Assignment
    'assignment': assignment,
    'compoundAssignment': compoundAssignment
};

});