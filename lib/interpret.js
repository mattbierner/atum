/**
 * @fileOverview 
 */
define(['stream/stream',
        'ecma/lex/token',
        'ecma/ast/node',
        'ecma/position',
        'atum/compute', 'atum/reference', 'atum/type_conversion', 'atum/value', 'atum/number'],
function(stream,
        token,
        node,
        position,
        compute, reference, type_conversion, value, number){

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

/* Semantics
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
                    return (value.type(lprim) === "String" || value.type(rprim) === "String" ?
                        string.concat(lprim, rprim) :
                        compute.always(number.addOperation(lprim, rprim)));
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
        break;
    
    case 'UnaryExpression':
        break;
        
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
        break;

    case 'LogicalExpression':
        break;
        
    case 'AssignmentExpression':
        break;

    case 'UpdateExpression':
        break;
    
    case 'ConditionalExpression':
        break;
    
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
        return (function BODY(l) {
            if (l.length === 0) {
                return compute.always(undefined);
            }
            if (l.length === 1) {
                return evaluate(l[0]);
            }
            return bind(evaluate(l[0]),
                function(x) {
                    return BODY(l.slice(1));
                });
        }(node.body));

// Declarations
    case 'VariableDeclaration':
        break;
        
    case 'VariableDeclarator':
        break;

// Value
    case 'Identifier':
        return always(node.name);
    
    case 'Literal':
        switch (node.kind) {
        case 'number':
            return compute.always(new number.Number(node.value));
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