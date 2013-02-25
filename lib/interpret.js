/**
 * @fileOverview 
 */
define(['ecma/lex/token',
        'ecma/ast/node',
        'atum/compute',
        'atum/semantics/semantics'],
function(token,
        node,
        compute,
        semantics){

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
        return semantics.statementList(node.body.map(evaluate));
        
    case 'ExpressionStatement':
        return semantics.expressionStatement(evaluate(node.expression));
    
    case 'IfStatement':
        return semantics.ifStatement(evaluate(node.test),
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
        return semantics.returnStatement(node.argument === null ?
            compute.always(new undef.Undefined()) :
            evaluate(node.argument));
    
    case 'ThrowStatement':
        return semantics.throwStatement(evaluate(node.argument));
    
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
        return semantics.sequenceExpression(node.expressions.map(evaluate));
    
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
        return semantics.conditionalOperator(evaluate(node.test),
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
var exec = function(p, ctx, ok, err) {
    return p(ctx, ok, err)();
};

var ret = function(x, ctx) {
    return function() {
        return x;
    };
};

var thr = function(x, ctx) {
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
       var ctx = new execution_context.ExecutionContext(execution_context.GLOBAL,
           false,
           global.globalEnvironment,
           global.globalEnvironment,
           null);
       return exec(evaluate(root), ctx, ret, thr);
   };
}());

/* Export
 ******************************************************************************/
return {
    'interpret': interpret
};

});