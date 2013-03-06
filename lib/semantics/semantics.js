/**
 * @fileOverview ECMAScript 5.1 semantics.
 */
define(['atum/compute',
        'atum/reference',
        'atum/context/environment', 'atum/context/execution_context', 'atum/context/global',
        'atum/value/value',
        'atum/value/undef',
        'atum/semantics/environment',
        'atum/semantics/number', 'atum/semantics/string', 'atum/semantics/boolean', 'atum/semantics/object',
        'atum/semantics/type_conversion', 
        'atum/semantics/completion', 'atum/semantics/reference'],
function(compute,
        reference,
        environment, execution_context, global,
        value,
        undef,
        environment_semantics,
        number, string, boolean, object,
        type_conversion,
        completion, reference_semantics){
//"use strict";

/* Statement Semantics
 ******************************************************************************/
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
    return compute.bind(
        reference_semantics.getValue(argument),
        function(x) {
            return compute.always(new completion.ReturnCompletion(x));
        });
};

/**
 * Semantics for a throw statement.
 */
var throwStatement = function(argument) {
    return compute.bind(
        reference_semantics.getValue(argument),
        compute.never);
};

/**
 * Semantics for a break statement.
 * 
 * @param {String} [label]
 */
var breakStatement = function(label) {
    return compute.always(new completion.BreakCompletion(label));
};

/**
 * Semantics for a continue statement
 * 
 * @param {String} [label]
 */
var continueStatement = function(label) {
    return compute.always(new completion.ContinueCompletion(label));
};


/* Binary Operator Semantics
 ******************************************************************************/
/**
 * 
 */
var addOperator = function(left, right) {
    return compute.binda(
        compute.sequence(
            type_conversion.toPrimitive(reference_semantics.getValue(left)),
            type_conversion.toPrimitive(reference_semantics.getValue(right))),
        function(lprim, rprim) {
            var l = compute.always(lprim),
                r = compute.always(rprim);
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
        type_conversion.toNumber(reference_semantics.getValue(left)),
        type_conversion.toNumber(reference_semantics.getValue(right)));
};

/**
 * 
 */
var multiplyOperator = function(left, right) {
    return number.multiply(
        type_conversion.toNumber(reference_semantics.getValue(left)),
        type_conversion.toNumber(reference_semantics.getValue(right)));
};

/**
 * 
 */
var divideOperator = function(left, right) {
    return number.divide(
        type_conversion.toNumber(reference_semantics.getValue(left)),
        type_conversion.toNumber(reference_semantics.getValue(right)));
};

/**
 * 
 */
var remainderOperator = function(left, right) {
    return number.remainder(
        type_conversion.toNumber(reference_semantics.getValue(left)),
        type_conversion.toNumber(reference_semantics.getValue(right)));
};

/**
 * 
 */
var leftShiftOperator = function(left, right) {
    return number.leftShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toUint32(reference_semantics.getValue(right)));
};

/**
 * 
 */
var signedRightShiftOperator = function(left, right) {
    return number.signedRightShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toUint32(reference_semantics.getValue(right)));
};

/**
 * 
 */
var unsignedRightShiftOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toUint32(reference_semantics.getValue(right)));
};

/**
 * 
 */
var bitwiseAndOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toInt32(reference_semantics.getValue(right)));
};

/**
 * 
 */
var bitwiseXorOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toInt32(reference_semantics.getValue(right)));
};

/**
 * 
 */
var bitwiseOrOperator = function(left, right) {
    return number.unsignedRightShift(
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
        reference_semantics.getValue(left),
        function(l) {
            return compute.bind(
                reference_semantics.getValue(right),
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
    return number.negate(type_conversion.toNumber(reference_semantics.getValue(argument)));
};

/**
 * 
 */
var logicalNotOperator = function(argument) {
    return boolean.logicalNot(type_conversion.toBoolean(reference_semantics.getValue(argument)));
};

var bitwiseNotOperator = function(argument) {
    return number.bitwiseNot(type_conversion.toInt32(reference_semantics.getValue(argument)));
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
        return op(argument);
    };
};

var _postfixOperator = function(op) {
    return function(argument) {
        return compute.next(
            op(argument),
            argument);
    };
};

var _increment = function(expr) {
    return reference_semantics.putValue(
        expr, 
        number.increment(
            type_conversion.toNumber(reference_semantics.getValue(expr))));
};

var _decrement = function(expr) {
    return reference_semantics.putValue(
        expr, 
        number.decrement(
            type_conversion.toNumber(reference_semantics.getValue(expr))));
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
var postfixDecrement = _postfixOperator(_decrement);


/* Logical Binary Operator Semantics
 ******************************************************************************/
/**
 * Semantics for a logical or operation. Shorts when left evaluates to true.
 */
var logicalOr = function(left, right) {
    return compute.bind(
        type_conversion.toBoolean(reference_semantics.getValue(left)),
        function(result) {
            return (result.value === true ?
                left :
                right);
    });
};

/**
 * Semantics for a logical and operation. Shorts when left evaluates to false.
 */
var logicalAnd = function(left, right) {
    return compute.bind(
        type_conversion.toBoolean(reference_semantics.getValue(left)),
        function(result) {
            return (result.value === true ?
                right :
                left);
        });
};

/* 
 ******************************************************************************/
/**
 * 
 */
var callExpression;

/**
 * 
 */
var memberExpression = function(base, property) {
    return compute.binda(
        compute.sequence(
            compute.context,
            reference_semantics.getValue(base),
            type_conversion.toString(reference_semantics.getValue(property))),
        function(ctx, baseValue, name) {
            return compute.always(new reference.Reference(name.value, baseValue, ctx.strict));
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
    return expressions.reduce(function(p, c) {
        return compute.next(p, reference_semantics.getValue(c));
    });
};

/* Assignment Semantics
 ******************************************************************************/
/**
 * 
 */
var objectLiteral = function(properties) {
    return properties.reduce(function(p, c) {
        return object.defineProperty(p, c.key, c);
    }, object.create(null, {}));
};

var arrayLiteral;

/* Assignment Semantics
 ******************************************************************************/
var _dereference = function(lref) {
    if (lref instanceof reference.Reference &&
        lref.strict &&
        lref.base instanceof e
        (lref.name === "eval" || lref.name === "arguments")) {
        return compute.never("Using eval/arguments in stricts");
    }
    return compute.always(lref);
};

/**
 * Semantics for simple assignment.
 */
var assignment = function(left, right) {
    return reference_semantics.putValue(
        compute.bind(left, _dereference),
        reference_semantics.getValue(right));
};

/**
 * Semantics for an assignment that modifies a value assigned value by
 * operating on its current value.
 */
var compoundAssignment = function(op) {
    return function(left, right) {
        return reference_semantics.putValue(
            compute.bind(left, _dereference),
            op(
                reference_semantics.getValue(left),
                reference_semantics.getValue(right)));
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
            return ok(x, newCtx);
        };
    });
};

/* Values
 ******************************************************************************/
var numberLiteral = number.create;

var booleanLiteral = boolean.create;

var stringLiteral = string.create;

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

// Logical Semantics
    'logicalOr': logicalOr,
    'logicalAnd': logicalAnd,
    
//
    'callExpression': callExpression,
    'memberExpression': memberExpression,
    
// Expression Semantics
    'conditionalExpression': conditionalExpression,
    'sequenceExpression': sequenceExpression,
// Literals
    'objectLiteral': objectLiteral,
    'arrayLiteral': arrayLiteral,
    
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