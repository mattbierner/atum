/**
 * @fileOverview ECMAScript 5.1 semantics.
 */
define(['atum/compute',
        'atum/semantics/reference',
        'atum/context/environment', 'atum/context/execution_context', 'atum/context/global',
        'atum/value/type_conversion', 'atum/value/value',
        'atum/relational',
        'atum/value/boolean', 'atum/value/number', 'atum/value/string', 'atum/value/undef',
        'atum/semantics/completion'],
function(compute,
        reference,
        environment, execution_context, global,
        type_conversion, value,
        relational,
        boolean, number, string, undef,
        completion){

/* 
 ******************************************************************************/
var curry = function(f) {
    return ((arguments.length === 1) ? f : f.bind.apply(f, arguments));
};

var identity = function(x) {
    return x;
};

var constant = function(x) {
    return function() {
        return x;
    };
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
    return reference.getValue(expression);
};

/**
 * 
 */
var ifStatement = function(test, consequent, alternate) {
    return compute.bind(reference.getValue(test), function(x) {
        return (x.value ?
            consequent :
            alternate);
    });
};

/**
 * 
 */
var returnStatement = function(argument) {
    return compute.bind(argument, function(x) {
        return compute.always(new completion.ReturnCompletion(x));
    });
};

/**
 * 
 */
var throwStatement = function(argument) {
    return compute.bind(argument, function(x) {
        return compute.never(new ThrowCompletion(x));
    });
};

/* Binary Operator Semantics
 ******************************************************************************/
/**
 * 
 */
var addOperator = function(left, right) {
    return compute.bind(
        type_conversion.toPrimitive(reference.getValue(left)),
        function(lprim) {
            return compute.bind(
                type_conversion.toPrimitive(reference.getValue(right)),
                function(rprim) {
                    return (value.type(lprim) === "string" || value.type(rprim) === "string" ?
                        string.concat(
                             type_conversion.toString(compute.always(lprim)),
                             type_conversion.toString(compute.always(rprim))) :
                        number.add(
                            type_conversion.toNumber(compute.always(lprim)),
                            type_conversion.toNumber(compute.always(rprim))));
                });
        });
};

/**
 * 
 */
var subtractOperator = function(left, right) {
    return number.subtract(
        type_conversion.toNumber(reference.getValue(left)),
        type_conversion.toNumber(reference.getValue(right)));
};

/**
 * 
 */
var multiplyOperator = function(left, right) {
    return number.multiply(
        type_conversion.toNumber(reference.getValue(left)),
        type_conversion.toNumber(reference.getValue(right)));
};

/**
 * 
 */
var divideOperator = function(left, right) {
    return number.divide(
        type_conversion.toNumber(reference.getValue(left)),
        type_conversion.toNumber(reference.getValue(right)));
};

/**
 * 
 */
var remainderOperator = function(left, right) {
    return number.remainder(
        type_conversion.toNumber(reference.getValue(left)),
        type_conversion.toNumber(reference.getValue(right)));
};

/**
 * 
 */
var leftShiftOperator = function(left, right) {
    return number.leftShift(
        type_conversion.toInt32(reference.getValue(left)),
        type_conversion.toUint32(reference.getValue(right)));
};

/**
 * 
 */
var signedRightShiftOperator = function(left, right) {
    return number.signedRightShift(
        type_conversion.toInt32(reference.getValue(left)),
        type_conversion.toUint32(reference.getValue(right)));
};

/**
 * 
 */
var unsignedRightShiftOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(reference.getValue(left)),
        type_conversion.toUint32(reference.getValue(right)));
};

/**
 * 
 */
var unaryPlusOperator = function(argument) {
    return type_conversion.toNumber(reference.getValue(argument));
};

/**
 * 
 */
var unaryMinusOperator = function(argument) {
    return number.negate(type_conversion.toNumber(reference.getValue(argument)));
};

/**
 * 
 */
var logicalNotOperator = function(argument) {
    return boolean.logicalNot(type_conversion.toBoolean(reference.getValue(argument)));
};

var bitwiseNotOperator = function(argument) {
    return number.bitwiseNot(type_conversion.toInt32(reference.getValue(argument)));
};

/**
 * 
 */
var voidOperator = function(argument) {
    return compute.next(reference.getValue(argument)),
        compute.always(new undef.Undefined());
};

/**
 * 
 */
var typeofOperator = function(argument) {
    return compute.bind(argument, function(val) {
        if (val instanceof reference.Reference) {
            return (reference.isUnresolvableReference(val) ?
                compute.always("undefined") :
                typeofOperator(reference.getValue(val)));
        }
        return compute.always(value.type(val));
    });
};

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

/**
 * Semantics for a conditional Expression.
 */
var conditionalExpression = function(test, consequent, alternate) {
    return compute.bind(
        type_conversion.toBoolean(reference.getValue(test)),
        function(x) {
            return reference.getValue(x.value ?
                consequent :
                alternate);
        });
};

/**
 * Semantics for a sequence of expressions.
 */
var sequenceExpression = function(expressions) {
    return (expressions.length === 1 ?
        reference.getValue(expressions[0]) :
        compute.bind(
            reference.getValue(expressions[0]),
            function() {
                return sequenceExpression(expressions.slice(1));
            }));
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
    return compute.bind(reference.getValue(init), function(x) {
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

/* Literals
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

/* Export
 ******************************************************************************/
return {
// Statement Semantics
    'statementList': statementList,
    'expressionStatement': expressionStatement,
    'returnStatement': returnStatement,
    'throwStatement': throwStatement,

// Binary Operator Semantics
    'addOperator': addOperator, 
    'subtractOperator': subtractOperator, 
    'multiplyOperator': multiplyOperator, 
    'divideOperator': divideOperator, 
    'remainderOperator': remainderOperator, 
    
    'leftShiftOperator': leftShiftOperator, 
    'signedRightShiftOperator': signedRightShiftOperator, 
    'unsignedRightShiftOperator': unsignedRightShiftOperator, 

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
    
// Declaration Semantics
    'variableDeclaration': variableDeclaration,
    'variableDeclarator': variableDeclarator,
    
// Literals
    'numberLiteral': numberLiteral,
    'booleanLiteral': booleanLiteral,
    'stringLiteral': stringLiteral
};

});