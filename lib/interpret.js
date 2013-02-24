/**
 * @fileOverview 
 */
define(['stream/stream',
        'ecma/lex/token',
        'ecma/ast/node',
        'ecma/position',
        'atum/compute', 'atum/reference', 'atum/type_conversion', 'atum/value',
        'atum/boolean', 'atum/number', 'atum/string', 'atum/undef'],
function(stream,
        token,
        node,
        position,
        compute, reference, type_conversion, value,
        boolean, number, string, undef){

var evaluate;

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

/* Completions
 ******************************************************************************/
var Completion = function() { };

/**
 * 
 */
var ReturnCompletion = function(value) {
    this.value = value;
};
ReturnCompletion.prototype = new Completion;

/**
 * 
 */
var ContinueCompletion = function(target) {
    this.target = target;
};
ContinueCompletion.prototype = new Completion;

/**
 * 
 */
var BreakCompletion = function(target) {
    this.target = target;
};
BreakCompletion.prototype = new Completion;

/**
 * 
 */
var ThrowCompletion = function(value) {
    this.value = value;
};
ThrowCompletion.prototype = new Completion;



/* Semantics
 ******************************************************************************/
var statementList = function(statements) {
     if (statements.length === 0) {
        return compute.always(new undef.Undefined());
    } else if (statements.length === 1) {
        return statements[0];
    } else {
        return compute.next(statements[0],
            statementList(statements.slice(1)));
    }
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
evaluate = function(node) {
    if (!node) {
        return null;
    }
        
    switch (node.type) {
// clauses
    case 'SwitchCase':
       break;
       
    case 'CatchClause':
        break;
    
// Statement
    case 'EmptyStatement':
        break;
        
    case 'DebuggerStatement':
        break;
    
    case 'BlockStatement':
        break;
        
    case 'ExpressionStatement':
        return evaluate(node.expression);
    
    case 'IfStatement':
        break;
        
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
        return (node.argument === null ?
            compute.always(new ReturnCompletion(new undef.Undefined())) :
            compute.bind(evaluate(node.argument), function(x) {
                return compute.always(new ReturnCompletion(x));
            }));
        
    case 'ThrowStatement':
        break;
    
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
        
        default: return compute.never("Unknown op:" + node.operator);
        }

    case 'LogicalExpression':
        break;
        
    case 'AssignmentExpression':
        break;

    
    case 'ConditionalExpression':
        return conditionalOperator(evaluate(node.test), evaluate(node.consequent), evaluate(node.alternate));
    
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
        break;
        
    case 'VariableDeclarator':
        break;

// Value
    case 'Identifier':
        return compute.always(node.name);
    
    case 'Literal':
        switch (node.kind) {
        case 'number':  return compute.always(new number.Number(node.value));
        case 'boolean': return compute.always(new boolean.Boolean(node.value));
        case 'string':  return compute.always(new string.String(node.value));
        default:
            return compute.always(node.value);
        }
        
    default:
        return compute.never("NEVER!!!");
    }
};


/* Export
 ******************************************************************************/
var exec = function(p, env, ok, err) {
    return p(env, ok, err)();
};

var ret = function(x, env) {
    console.log(x);
    return function() {
        return x;
    };
};

var thr = function(x, env) {
    return function() {
        throw x;
    };
};

/**
 * Transform an AST to a stream of tokens.
 * 
 * Returned stream inserts line terminators for pretty printing.
 * 
 * @param node Root of AST to unparse.
 * 
 * @return Stream of parse-ecma lex tokens.
 */
var interpret = (function(){
   return function(root) {
       return exec(evaluate(root), {}, ret, thr);
   };
}());

/* Export
 ******************************************************************************/
return {
    'interpret': interpret
};

});