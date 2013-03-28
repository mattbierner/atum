/**
 * @fileOverview Functions for interpreting an ECMAScript abstract syntax tree.
 */
define(['ecma/ast/node',
        'atum/compute',
        'atum/semantics/semantics',
        'atum/context/execution_context',
        'atum/builtin/global',
        'atum/iref'],
function(ast,
        compute,
        semantics,
        execution_context,
        global,
        iref){

/* Evaluation
 ******************************************************************************/
/**
 * Maps AST nodes for declarations to semantics computations.
 */
var declaration = function(node) {
    switch (node.type) {
    case 'BlockStatement':
        return semantics.statementList(node.body.map(declaration));
    
    case 'IfStatement':
        return (node.alternate ?
            compute.next(declaration(node.consequent), declaration(node.alternate)) :
            declaration(node.consequent));

    case 'WithStatement':
        return declaration(node.body);
        
    case 'SwitchStatement':
        break;
    
    case 'TryStatement':
        break;
    
    case 'WhileStatement':
    case 'DoWhileStatement':
    case 'ForStatement':
    case 'ForInStatement':
        return declaration(node.body);
    
    case 'FunctionDeclaration':
        return semantics.functionDeclaration(
            (node.id === null ? null : node.id.name),
            node.params.map(function(x) {
                return x.name;
            }),
            sourceElements(node.body.body));
        
    case 'VariableDeclaration':
        return semantics.variableDeclaration(
            node.declarations.map(declaration));
        
    case 'VariableDeclarator':
        return semantics.variableDeclarator(node.id.name);
    
    default:
        return semantics.emptyStatement();
    }
};

/**
 * 
 */
var sourceElements = function(elems) {
    return semantics.sourceElements(
        elems.map(evaluate),
        elems.map(declaration));
};
    
/**
 * Maps AST nodes to semantics computations.
 */
var evaluate = function(node) {
    if (!node) {
        throw "null";
    }
    
    switch (node.type) {
// Clauses
    case 'SwitchCase':
       break;
       
    case 'CatchClause':
        break;
    
// Statement
    case 'EmptyStatement':
        return semantics.emptyStatement();
        
    case 'DebuggerStatement':
        // @TODO?
        return semantics.emptyStatement();
    
    case 'BlockStatement':
        return semantics.statementList(node.body.map(evaluate));
        
    case 'ExpressionStatement':
        return semantics.expressionStatement(evaluate(node.expression));
    
    case 'IfStatement':
        return semantics.ifStatement(evaluate(node.test),
            evaluate(node.consequent),
            (node.alternate ?
                evaluate(node.alternate) :
                semantics.emptyStatement()))
        
    case 'LabeledStatement':
        break;
    
    case 'BreakStatement':
        return semantics.breakStatement(node.label ? node.label.name : null);
        
    case 'ContinueStatement':
        return semantics.continueStatement(node.label ?
            node.label.name :
            null);
        
    case 'WithStatement':
        break;
        
    case 'SwitchStatement':
        break;
    
    case 'BreakStatement':
        return semantics.breakStatement(node.label);
        
    case'ReturnStatement':
        return semantics.returnStatement(node.argument === null ?
            semantics.emptyStatement() :
            evaluate(node.argument));
    
    case 'ThrowStatement':
        return semantics.throwStatement(evaluate(node.argument));
    
    case 'TryStatement':
        break;
    
    case 'WhileStatement':
        return semantics.whileStatement(
            (node.test ?
                evaluate(node.test) :
                semantics.booleanLiteral(true)),
            evaluate(node.body));
    
    case 'DoWhileStatement':
        return semantics.doWhileStatement(
            evaluate(node.body),
            (node.test ?
                evaluate(node.test) :
                semantics.booleanLiteral(true)));
    
    case 'ForStatement':
        return semantics.forStatement(
            (node.init ? evaluate(node.init) : semantics.emptyStatement()),
            (node.test ? evaluate(node.test) : semantics.booleanLiteral(true)),
            (node.update ? evaluate(node.update) : semantics.emptyStatement()),
            evaluate(node.body));
    
    case 'ForInStatement':
        return semantics.forInStatement(
            evaluate(node.left),
            evaluate(node.right),
            evaluate(node.body));
    
// Expression
    case 'ThisExpression':
        return semantics.thisExpression();

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

        default: return compute.never("Unknown Unary Operator:" + node.operator);
        }
        
    case 'UpdateExpression':
        var a = evaluate(node.argument);
        switch (node.operator) {
        case '++':      return (node.prefix ?
                            semantics.prefixIncrement(a) :
                            semantics.postfixIncrement(a));
        case '--':      return (node.prefix ?
                            semantics.prefixDecrement(a) :
                            semantics.postfixDecrement(a));
        
        default: return compute.never("Unknown Update Operator:" + node.operator);
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
        
        case '==':  return semantics.equalOperator(l, r);
        case '===':  return semantics.strictEqualOperator(l, r);
        case '!=':  return semantics.notEqualOperator(l, r);
        case '!==':  return semantics.strictNotEqualOperator(l, r);
        
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
        return semantics.callExpression(
            evaluate(node.callee),
            node.args.map(evaluate));
        
    case 'MemberExpression':
        return semantics.memberExpression(
            evaluate(node.object),
            (node.computed ?
                evaluate(node.property) :
                semantics.stringLiteral(node.property.name)));
 
    case 'ArrayExpression':
        break;
    
    case 'ObjectExpression':
        return semantics.objectLiteral(node.properties.reduce(function(p, c) {
            // not functional here
            var key = (c.key.name === undefined ? c.key.value : c.key.name),
                value = evaluate(c.value);
            if (!p[key]) {
                p[key] = {
                    'writable': true,
                    'enumerable': true,
                    'configurable': true
                };
            }
            switch (c.kind) {
            case 'get':
                p[key]['get'] = value; 
                break;
            case 'set':
                p[key]['set'] = value;
                break;
            case 'init':
                p[key]['value'] = value
                break;
            }
            return p;
        }, {}));

// Function
    case 'FunctionExpression':
        return semantics.functionExpression(
            (node.id === null ? null : node.id.name),
            node.params.map(function(x) {
                return x.name;
            }),
            sourceElements(node.body.body));
        
    case 'FunctionDeclaration':
        /*
         * Function declarations are handled when evaluating source elements
         * so this is a noop.
         */
        return semantics.emptyStatement();
        

// Program
    case 'Program':
        return sourceElements(node.body);
        
// Declarations
    case 'VariableDeclaration':
        return semantics.variableDeclaration(
            node.declarations.map(evaluate));
        
    case 'VariableDeclarator':
        return (node.init ?
            semantics.initVariableDeclarator(node.id.name, evaluate(node.init)) :
            semantics.emptyStatement());

// Value
    case 'Identifier':
        return semantics.identifier(node.name);
    
    case 'Literal':
        switch (node.kind) {
        case 'number':  return semantics.numberLiteral(node.value);
        case 'boolean': return semantics.booleanLiteral(node.value);
        case 'string':  return semantics.stringLiteral(node.value);
        case 'null':    return semantics.nullLiteral(node.value);
        case 'regexp':  return semantics.regularExpression(node.value);
        default: return compute.never("Unknown Literal of kind: " + node.kind);
        }
        
    default:
        return compute.never("Unknown node: " + node);
    }
};

/* Interpretation
 ******************************************************************************/
var exec = function(p, ctx, v, ok, err) {
    return p(ctx, v, ok, err)();
};

var ret = function(x, ctx) {
    return function() {
        console.log(ctx);
        return x;
    };
};

var thr = function(x, ctx) {
    return function() {
        console.log(ctx);
        throw x;
    };
};

/**
 * Interprets AST 'root' in an given execution context 'ctx'.
 * 
 * @param ctx Execution context to interpret 'root' in.
 * @param root Abstract syntax tree to interpret.
 * 
 * @return Result of interpretation of 'root'.
 */
var eval = function(comp) {
    return exec(comp, null, {}, ret, thr);
};

/**
 * Interprets AST 'root'.
 * 
 * Interpretation is performed in a global execution context.
 * 
 * @param root An abstract syntax tree to interpret.
 * 
 * @return Result of interpretation of 'root'.
 */
var interpret = function(root) {
    return eval(compute.next(global.createGlobal(), evaluate(root)));
};


/* Export
 ******************************************************************************/
return {
    'eval': eval,
    'interpret': interpret
};

});
