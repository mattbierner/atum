/**
 * @fileOverview ECMAScript 5.1 semantics.
 */
define(['atum/compute',
        'atum/semantics/completion'
        'atum/environment', 'atum/execution_context', 'atum/global', 'atum/reference',
        'atum/type_conversion', 'atum/value',
        'atum/relational',
        'atum/boolean', 'atum/number', 'atum/string', 'atum/undef'],
function(compute,
        completion,
        environment, execution_context, global, reference,
        type_conversion, value,
        relational,
        boolean, number, string, undef){

/* 
 ******************************************************************************/
var reduce = Array.prototype.reduce;


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

/* Semantics
 ******************************************************************************/
/**
 * 
 */
var statementList = function(statements) {
    if (statements.length === 0) {
        return compute.always(new undef.Undefined());
    } else {
        return compute.bind(statements[0], function(x) {
            if (x instanceof Completion || statements.length <= 1) {
                return compute.always(x);
            }
            return statementList(statements.slice(1));
        });
    }
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
        return compute.always(new ReturnCompletion(x));
    });
};

/**
 * 
 */
var throwStatement = function(argument) {
    return compute.bind(argument, function(x) {
        return compute.always(new ThrowCompletion(x));
    });
};

/**
 * 
 */
var variableDeclaration = function(declarations) {
    return reduce.call(declarations, compute.next);
};

/**
 * 
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
 * 
 */
var conditionalOperator = function(test, consequent, alternate) {
    return compute.bind(
        type_conversion.toBoolean(reference.getValue(test)),
        function(x) {
            return reference.getValue(x.value ? consequent : alternate);
        });
};

/**
 * 
 */
var commaOperator = function(expressions) {
    if (expressions.length === 1) {
        return reference.getValue(expressions[0]);
    }
    return compute.bind(reference.getValue(expressions[0]), function() {
        return commaOperator(expressions.slice(1));
    });
};


/* Evaluation
 ******************************************************************************/
/**
 * Transforms a AST node to a stream of tokens.
 */
var evaluate = function(node) {
    if (!node) {
        throw "null";
    }
        
    switch (node.type) {
// clauses
    case 'SwitchCase':
       break;
       
    case 'CatchClause':
        break;
    
// Statement
    case 'EmptyStatement':
        return compute.always(null);
        
    case 'DebuggerStatement':
        break;
    
    case 'BlockStatement':
        return statementList(node.body.map(evaluate));
        
    case 'ExpressionStatement':
        return reference.getValue(evaluate(node.expression));
    
    case 'IfStatement':
        return ifStatement(evaluate(node.test),
            evaluate(node.consequent),
            (node.alternate === null ? compute.always(null) : evaluate(node.alternate)))
        
    case 'LabeledStatement':
        break;
    
    case 'BreakStatement':
        break;
        
    case 'ContinueStatement':
        break;
        
    case 'WithStatement':
        break;
        
    case 'SwitchStatement':
        break;
    
    case 'BreakStatement':
        break;
        
    case'ReturnStatement':
        return returnStatement(node.argument === null ?
            compute.always(new undef.Undefined()) :
            evaluate(node.argument));
    
    case 'ThrowStatement':
        return throwStatement(evaluate(node.argument));
    
    case 'TryStatement':
        break;
    
    case 'WhileStatement':
        break;
        
    case 'DoWhileStatement':
        break;
    
    case 'ForStatement':
        break;
        
    case 'ForInStatement':
        break;
        
// Expression
    case 'ThisExpression':
        break;

    case 'SequenceExpression':
        return commaOperator(node.expressions.map(evaluate));
    
    case 'UnaryExpression':
        var argument = evaluate(node.argument);
        switch (node.operator) {
        case '+': return unaryPlusOperator(argument);
        case '-': return unaryMinusOperator(argument);
        case '!': return logicalNotOperator(argument);
        case '~': return bitwiseNotOperator(argument);
        case 'void': return voidOperator(argument);
        case 'typeof': return typeofOperator(argument);
        
        case '++':
        case '--':
        default: return compute.never("Unknown op:" + node.operator);
        }
        
    case 'UpdateExpression':
        var argument = evaluate(node.argument);
        switch (node.operator) {
        case '++':
        case '--':
        default: return compute.never("Unknown op:" + node.operator);
        }

    case 'BinaryExpression': 
        var l = evaluate(node.left), r = evaluate(node.right);
        switch (node.operator) {
        case '+': return addOperator(l, r);
        case '-': return subtractOperator(l, r);
        case '*': return multiplyOperator(l, r);
        case '/': return divideOperator(l, r);
        case '%': return remainderOperator(l, r);
        
        case '<<':  return leftShiftOperator(l, r);
        case '>>':  return signedRightShiftOperator(l, r);
        case '>>>': return unsignedRightShiftOperator(l, r);
        
        case '<':   return relational.ltOperator(l, r);
        case '<=':  return relational.lteOperator(l, r);
        case '>':   return relational.gtOperator(l, r);
        case '>=':  return relational.gteOperator(l, r);
        case 'instanceof':  return relational.instanceOfOperator(l, r);
        case 'in':  return relational.inOperator(l, r);

        default: return compute.never("Unknown op:" + node.operator);
        }

    case 'LogicalExpression':
        var l = evaluate(node.left), r = evaluate(node.right);
        switch (node.operator) {
        case '||':  return logicalOr(l, r);
        case '&&':  return logicalAnd(l, r)
        default:    return compute.never("Unknown op:" + node.operator);
        }
        break;
        
    case 'AssignmentExpression':
        break;

    case 'ConditionalExpression':
        return conditionalOperator(evaluate(node.test),
            evaluate(node.consequent),
            evaluate(node.alternate));
    
    case 'NewExpression':
        break;
    
    case 'CallExpression':
        break;
        
    case 'MemberExpression':
        break;
 
    case 'ArrayExpression': ArrayExpression:
        break;
    
    case 'ObjectExpression': ArrayExpression:
        break

// Function
    case 'FunctionExpression':
        break;
        
    case 'FunctionDeclaration':
        break;

// Program
    case 'Program':
        return statementList(node.body.map(evaluate));
        
// Declarations
    case 'VariableDeclaration':
        return variableDeclaration(node.declarations.map(evaluate));
        
    case 'VariableDeclarator':
        return variableDeclarator(node.id.name, (node.init ?
            evaluate(node.init) :
            compute.always(new undef.Undefined)));

// Value
    case 'Identifier':
        return function(ctx, ok, err) {
            return ok(environment.getIdentifierReference(ctx.lexicalEnvironment, node.name, ctx.strict), ctx);
        };
    
    case 'Literal':
        switch (node.kind) {
        case 'number':  return compute.always(new number.Number(node.value));
        case 'boolean': return compute.always(new boolean.Boolean(node.value));
        case 'string':  return compute.always(new string.String(node.value));
        default:        return compute.always(node.value);
        }
        
    default:
        return compute.never("NEVER!!!");
    }
};

/* Export
 ******************************************************************************/
return {};

});