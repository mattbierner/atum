/**
 * @fileOverview ECMAScript 5.1 semantics.
 */
define(['atum/compute',
        'atum/context/environment', 'atum/context/execution_context', 'atum/context/global',
        'atum/reference',
        'atum/value/value',
        'atum/value/boolean', 'atum/value/number', 'atum/value/string', 'atum/value/undef',
        'atum/semantics/environment', 'atum/semantics/number', 'atum/semantics/type_conversion', 
        'atum/semantics/completion', 'atum/semantics/reference'],
function(compute,
        environment, execution_context, global,
        reference,
        value,
        boolean, number, string, undef,
        environment_semantics, number_semantics, type_conversion,
        completion, reference_semantics){
//"use strict";

var curry = function(f) {
    return ((arguments.length === 1) ? f : f.bind.apply(f, arguments));
};
    
/* Statement Semantics
 ******************************************************************************/
/**
 * Semantics for a list of statements.
 */
var statementList = function(statements) {
    if (statements.length === 0) {
        return compute.always(new undef.Undefined());
    } else {
        return compute.bind(statements[0], function(x) {
            return (x instanceof completion.Completion || statements.length <= 1 ?
                compute.always(x) :
                statementList(statements.slice(1)));
        });
    }
};

/**
 * Semantics for an expression statement.
 */
var expressionStatement = function(expression) {
    return reference_semantics.getValue(expression);
};

/**
 * Semantics for an if statement
 */
var ifStatement = function(test, consequent, alternate) {
    return compute.bind(reference_semantics.getValue(test), function(x) {
        return (x.value ?
            consequent :
            alternate);
    });
};

/**
 * Semantics for a return statement.
 */
var returnStatement = function(argument) {
    return compute.bind(argument, function(x) {
        return compute.always(new completion.ReturnCompletion(x));
    });
};

/**
 * Semantics for a throw statement.
 */
var throwStatement = function(argument) {
    return compute.bind(argument, function(x) {
        return compute.never(new ThrowCompletion(x));
    });
};

/**
 * Semantics for a break statement.
 */
var breakStatement = function(label) {
    return compute.bind(argument, function() {
        return compute.always(new completion.BreakCompletion(label));
    });
};

/**
 * Semantics for a continue statement
 */
var continueStatement = function(label) {
    return compute.bind(argument, function() {
        return compute.always(new completion.ContinueCompletion(label));
    });
};


/* Binary Operator Semantics
 ******************************************************************************/
/**
 * 
 */
var addOperator = function(left, right) {
    return compute.bind(
        type_conversion.toPrimitive(reference_semantics.getValue(left)),
        function(lprim) {
            return compute.bind(
                type_conversion.toPrimitive(reference_semantics.getValue(right)),
                function(rprim) {
                    return (value.type(lprim) === "string" || value.type(rprim) === "string" ?
                        string.concat(
                             type_conversion.toString(compute.always(lprim)),
                             type_conversion.toString(compute.always(rprim))) :
                        number_semantics.add(
                            type_conversion.toNumber(compute.always(lprim)),
                            type_conversion.toNumber(compute.always(rprim))));
                });
        });
};

/**
 * 
 */
var subtractOperator = function(left, right) {
    return number_semantics.subtract(
        type_conversion.toNumber(reference_semantics.getValue(left)),
        type_conversion.toNumber(reference_semantics.getValue(right)));
};

/**
 * 
 */
var multiplyOperator = function(left, right) {
    return number_semantics.multiply(
        type_conversion.toNumber(reference_semantics.getValue(left)),
        type_conversion.toNumber(reference_semantics.getValue(right)));
};

/**
 * 
 */
var divideOperator = function(left, right) {
    return number_semantics.divide(
        type_conversion.toNumber(reference_semantics.getValue(left)),
        type_conversion.toNumber(reference_semantics.getValue(right)));
};

/**
 * 
 */
var remainderOperator = function(left, right) {
    return number_semantics.remainder(
        type_conversion.toNumber(reference_semantics.getValue(left)),
        type_conversion.toNumber(reference_semantics.getValue(right)));
};

/**
 * 
 */
var leftShiftOperator = function(left, right) {
    return number_semantics.leftShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toUint32(reference_semantics.getValue(right)));
};

/**
 * 
 */
var signedRightShiftOperator = function(left, right) {
    return number_semantics.signedRightShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toUint32(reference_semantics.getValue(right)));
};

/**
 * 
 */
var unsignedRightShiftOperator = function(left, right) {
    return number_semantics.unsignedRightShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toUint32(reference_semantics.getValue(right)));
};

/**
 * 
 */
var bitwiseAndOperator = function(left, right) {
    return number_semantics.unsignedRightShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toInt32(reference_semantics.getValue(right)));
};

/**
 * 
 */
var bitwiseXorOperator = function(left, right) {
    return number_semantics.unsignedRightShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toInt32(reference_semantics.getValue(right)));
};

/**
 * 
 */
var bitwiseOrOperator = function(left, right) {
    return number_semantics.unsignedRightShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toInt32(reference_semantics.getValue(right)));
};

/* Binary Relational Operators
 * 
 * @TODO Should we return undefined values when NaN is used?
 ******************************************************************************/
var _relationalOperator = function(op) {
    return function(left, right) {
        return op(
            type_conversion.toNumber(reference_semantics.getValue(left)),
            type_conversion.toNumber(reference_semantics.getValue(right)));
    };
};

/**
 *
 */
var ltOperator = _relationalOperator(number_semantics.lt);

/**
 * 
 */
var lteOperator = _relationalOperator(number_semantics.lte);

/**
 * 
 */
var gtOperator = _relationalOperator(number_semantics.gt);

/**
 * 
 */
var gteOperator = _relationalOperator(number_semantics.gte);

var instanceofOperator = function(left, right) {
    return compute.bind(
        reference.getValue(left),
        function(l) {
            return compute.bind(
                reference.getValue(right),
                function(r) {
                    return function(ctx, ok, err) {
                        if (value.type(r) !== 'object') {
                            return err('Instanceof', ctx);
                        }
                        return ok(value.hasInstance(l), ctx);
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
    return type_conversion.toNumber(reference_semantics.getValue(argument));
};

/**
 * 
 */
var unaryMinusOperator = function(argument) {
    return number_semantics.negate(type_conversion.toNumber(reference_semantics.getValue(argument)));
};

/**
 * 
 */
var logicalNotOperator = function(argument) {
    return boolean.logicalNot(type_conversion.toBoolean(reference_semantics.getValue(argument)));
};

var bitwiseNotOperator = function(argument) {
    return number_semantics.bitwiseNot(type_conversion.toInt32(reference_semantics.getValue(argument)));
};

/**
 * 
 */
var voidOperator = function(argument) {
    return compute.next(reference_semantics.getValue(argument)),
        compute.always(new undef.Undefined());
};

/**
 * 
 */
var typeofOperator = function(argument) {
    return compute.bind(argument, function(val) {
        if (val instanceof reference_semantics.Reference) {
            return (reference_semantics.isUnresolvableReference(val) ?
                compute.always("undefined") :
                typeofOperator(reference_semantics.getValue(val)));
        }
        return compute.always(value.type(val));
    });
};

/* Update Operator Semantics
 ******************************************************************************/
var _prefixOperator = function(op) {
    return function(argument) {
        return compute.bind(argument, op);
    };
};

var _postfixOperator = function(op) {
    return function(argument) {
        return compute.bind(argument, function(oldValue) {
            return compute.next(
                op(oldValue),
                compute.always(oldValue));
        });
    };
};

var _increment = function(expr) {
    return compute.bind(
        type_conversion.toNumber(reference_semantics.getValue(compute.always(expr))),
        function(oldValue) {
            return reference_semantics.putValue(expr, number.add(oldValue, new number.Number(1)));
        });
};

var _decrement = function(expr) {
    return compute.bind(
        type_conversion.toNumber(reference_semantics.getValue(compute.always(expr))),
        function(oldValue) {
            return reference_semantics.putValue(expr, number.add(oldValue, new number.Number(-1)));
        });
};

/**
 * 
 */
var prefixIncrement = _prefixOperator(_increment);

/**
 * 
 */
var postfixIncrement =  _postfixOperator(_increment);

/**
 * 
 */
var prefixDecrement = _prefixOperator(_decrement);

/**
 * 
 */
var postfixDecrement =  _postfixOperator(_decrement);


/* Logical Binary Operator Semantics
 ******************************************************************************/
/**
 * 
 */
var logicalOr = function(left, right) {
    return compute.bind(left, function(l) {
        return compute.bind(type_conversion.toBoolean(compute.always(l)), function(result) {
            return (result.value === true ?
                compute.always(l) :
                right);
        });
    });
};

/**
 * 
 */
var logicalAnd = function(left, right) {
    return compute.bind(left, function(l) {
        return compute.bind(type_conversion.toBoolean(compute.always(l)), function(result) {
            return (result.value === true ?
                right :
                compute.always(l));
        });
    });
};

/* 
 ******************************************************************************/
/**
 * Semantics for a conditional Expression.
 */
var conditionalExpression = function(test, consequent, alternate) {
    return compute.bind(
        type_conversion.toBoolean(reference_semantics.getValue(test)),
        function(x) {
            return reference_semantics.getValue(x.value ?
                consequent :
                alternate);
        });
};

/**
 * Semantics for a sequence of expressions.
 */
var sequenceExpression = function(expressions) {
    return (expressions.length === 1 ?
        reference_semantics.getValue(expressions[0]) :
        compute.next(
            reference_semantics.getValue(expressions[0]),
            sequenceExpression(expressions.slice(1))));
};

/* Assignment Semantics
 ******************************************************************************/
/**
 * Semantics for simple assignment.
 */
var assignment = function(left, right) {
    return compute.bind(left, function(lref) {
        if (lref instanceof reference.Reference &&
            lref.strict &&
            lref.base instanceof e
            (lref.name === "eval" || lref.name === "arguments")) {
            return never("Using eval/arguments in stricts");
        }
        return compute.bind(
            reference_semantics.getValue(right),
            function(rval) {
                return reference_semantics.putValue(lref, rval);
            });
    });
};

/**
 * 
 */
var compoundAssignment = function(op) {
    return function(left, right) {
        return compute.bind(left, function(lref) {
            if (lref instanceof reference.Reference &&
                lref.strict &&
                lref.base instanceof e
                (lref.name === "eval" || lref.name === "arguments")) {
                return never("Using eval/arguments in stricts");
            }
            return compute.bind(
                op(reference_semantics.getValue(left), reference_semantics.getValue(right)),
                function(r) {
                    return reference_semantics.putValue(lref, r);
                });
        });
    };
};

/* Declaration Semantics
 ******************************************************************************/
/**
 * Semantics for a variable declaration.
 */
var variableDeclaration = function(declarations) {
    return declarations.reduce(compute.next);
};

/**
 * Semantics for a single variable declarator.
 */
var variableDeclarator = function(id, init) {
    return compute.bind(reference_semantics.getValue(init), function(x) {
        return function(ctx, ok, err) {
            var newCtx = new execution_context.ExecutionContext(
                ctx.type,
                ctx.strict,
                environment.putIdentifierReference(ctx.lexicalEnvironment, id, x),
                ctx.variableEnvironment,
                ctx.thisBinding);
            return ok(null, newCtx);
        };
    });
};

/* Values
 ******************************************************************************/
var numberLiteral = function(value) {
    return compute.always(new number.Number(value));
};

var booleanLiteral = function(value) {
    return compute.always(new boolean.Boolean(value));
};

var stringLiteral = function(value) {
    return compute.always(new string.String(value));
};

var identifier = function(name) {
    return environment_semantics.getIdentifierReference(name);
};

/* Export
 ******************************************************************************/
return {
// Statement Semantics
    'statementList': statementList,
    'expressionStatement': expressionStatement,
    'returnStatement': returnStatement,
    'throwStatement': throwStatement,
    'breakStatement': breakStatement,
    'continueStatement': continueStatement,
    
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

// Expression Semantics
    'conditionalExpression': conditionalExpression,
    'sequenceExpression': sequenceExpression,

// Assignment
    'assignment': assignment,
    'compoundAssignment': compoundAssignment,

// Declaration Semantics
    'variableDeclaration': variableDeclaration,
    'variableDeclarator': variableDeclarator,
    
// Values
    'numberLiteral': numberLiteral,
    'booleanLiteral': booleanLiteral,
    'stringLiteral': stringLiteral,
    'identifier': identifier
};

});