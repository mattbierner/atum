/**
 * @fileOverview 
 */
define(['atum/compute',
        'atum/value/undef',
        'atum/semantics/semantics',
        'atum/context/execution_context', 'atum/context/global'],
function(compute,
        undef,
        semantics,
        execution_context, global){

/* Evaluation
 ******************************************************************************/
/**
 * Transforms a AST node to its a computation with its semantic value.
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
        return semantics.breakStatement(node.label);
        
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
        case '+': return semantics.unaryPlusOperator(argument);
        case '-': return semantics.unaryMinusOperator(argument);
        case '!': return semantics.logicalNotOperator(argument);
        case '~': return semantics.bitwiseNotOperator(argument);
        case 'void': return semantics.voidOperator(argument);
        case 'typeof': return semantics.typeofOperator(argument);

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
        case '+': return semantics.addOperator(l, r);
        case '-': return semantics.subtractOperator(l, r);
        case '*': return semantics.multiplyOperator(l, r);
        case '/': return semantics.divideOperator(l, r);
        case '%': return semantics.remainderOperator(l, r);
        
        case '<<':  return semantics.leftShiftOperator(l, r);
        case '>>':  return semantics.signedRightShiftOperator(l, r);
        case '>>>': return semantics.unsignedRightShiftOperator(l, r);
        case '&':   return semantics.bitwiseAndOperator(l, r);
        case '^':   return semantics.bitwiseXorOperator(l, r);
        case '|':   return semantics.bitwiseOrOperator(l, r);
        
        case '<':   return semantics.ltOperator(l, r);
        case '<=':  return semantics.lteOperator(l, r);
        case '>':   return semantics.gtOperator(l, r);
        case '>=':  return semantics.gteOperator(l, r);
        case 'instanceof':  return semantics.instanceofOperator(l, r);
        case 'in':  return semantics.inOperator(l, r);

        default: return compute.never("Unknown op:" + node.operator);
        }

    case 'LogicalExpression':
        var l = evaluate(node.left), r = evaluate(node.right);
        switch (node.operator) {
        case '||':  return semantics.logicalOr(l, r);
        case '&&':  return semantics.logicalAnd(l, r)
        default:    return compute.never("Unknown Logical Operator:" + node.operator);
        }
        
    case 'AssignmentExpression':
        var l = evaluate(node.left), r = evaluate(node.right);
        switch (node.operator) {
        case '=':   return semantics.assignment(l, r);
        case '+=':  return semantics.compoundAssignment(semantics.addOperator)(l, r);
        case '-=':  return semantics.compoundAssignment(semantics.subtractOperator)(l, r);
        case '*=':  return semantics.compoundAssignment(semantics.multiplyOperator)(l, r);
        case '/=':  return semantics.compoundAssignment(semantics.divideOperator)(l, r);
        case '%=':  return semantics.compoundAssignment(semantics.remainderOperator)(l, r);
        
        case '<<=':     return semantics.compoundAssignment(semantics.leftShiftOperator)(l, r);
        case '>>=':     return semantics.compoundAssignment(semantics.signedRightShiftOperator)(l, r);
        case '>>>=':    return semantics.compoundAssignment(semantics.unsignedRightShiftOperator)(l, r);
        case '&=':      return semantics.compoundAssignment(semantics.bitwiseAndOperator)(l, r);
        case '^=':      return semantics.compoundAssignment(semantics.bitwiseXorOperator)(l, r);
        case '|=':      return semantics.compoundAssignment(semantics.bitwiseOrOperator)(l, r);

        default:    return compute.never("Unknown Assignment Operator:" + node.operator);
        }

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
        return semantics.statementList(node.body.map(evaluate));
        
// Declarations
    case 'VariableDeclaration':
        return semantics.variableDeclaration(node.declarations.map(evaluate));
        
    case 'VariableDeclarator':
        return semantics.variableDeclarator(node.id.name, (node.init ?
            evaluate(node.init) :
            compute.always(new undef.Undefined)));

// Value
    case 'Identifier':
        return semantics.identifier(node.name);

    
    case 'Literal':
        switch (node.kind) {
        case 'number':  return semantics.numberLiteral(node.value);
        case 'boolean': return semantics.booleanLiteral(node.value);
        case 'string':  return semantics.stringLiteral(node.value);
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
