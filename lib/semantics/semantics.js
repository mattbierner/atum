/**
 * @fileOverview ECMAScript 5.1 semantics.
 */
define(['atum/compute',
        'atum/semantics/declaration',
        'atum/semantics/expression',
        'atum/semantics/program',
        'atum/semantics/statement',
        'atum/semantics/value'],
function(compute,
        declaration,
        expression,
        program,
        statement,
        value){
"use strict";


var map = Function.prototype.call.bind(Array.prototype.map);
var reduce = Function.prototype.call.bind(Array.prototype.reduce);

/* Evaluation
 ******************************************************************************/
/**
 * Maps AST nodes for declarations to semantics computations.
 */
var declarations = function(node) {
    switch (node.type) {
    case 'BlockStatement':
        return statement.statementList(map(node.body, declarations));
    
    case 'IfStatement':
        return (node.alternate ?
            compute.next(
                declarations(node.consequent),
                declarations(node.alternate)) :
            declarations(node.consequent));
    
    case 'WithStatement':
        return declarations(node.body);
    
    case 'SwitchStatement':
        return statement.emptyStatement();
    
    case 'TryStatement':
        return compute.next(
            declarations(node.block),
            (compute.next(
            (node.handler ?
                declarations(node.handler.body) :
                statement.emptyStatement()),
            (node.finalizer ?
                declarations(node.finalizer) :
                statement.emptyStatement()))));
    
    case 'WhileStatement':
    case 'DoWhileStatement':
        return declarations(node.body);
        
    case 'ForStatement':
        return (node.init ? 
            compute.next(
                declarations(node.init),
                declarations(node.body)) :
            declarations(node.body));
        
    case 'ForInStatement':
        return (node.left ? 
            compute.next(
                declarations(node.left),
                declarations(node.body)) :
            declarations(node.body));
    
    case 'FunctionDeclaration':
        return declaration.functionDeclaration(
            (node.id === null ? null : node.id.name),
            map(node.params, function(x) {
                return x.name;
            }),
            sourceElements(node.body.body));
        
    case 'VariableDeclaration':
        return declaration.variableDeclaration(
            map(node.declarations, declarations));
        
    case 'VariableDeclarator':
        return declaration.variableDeclarator(node.id.name);
    
    default:
        return statement.emptyStatement();
    }
};

/**
 * 
 */
var sourceElements = function(elems) {
    return program.sourceElements(
        map(elems, evaluate),
        map(elems, declarations));
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
        return evaluate(node.body);

// Statement
    case 'EmptyStatement':
        return statement.emptyStatement();
        
    case 'DebuggerStatement':
        return debug_operations.debuggerStatement();
    
    case 'BlockStatement':
        return statement.blockStatement(map(node.body, evaluate));
        
    case 'ExpressionStatement':
        return statement.expressionStatement(evaluate(node.expression));
    
    case 'IfStatement':
        return statement.ifStatement(
            evaluate(node.test),
            evaluate(node.consequent),
            (node.alternate ?
                evaluate(node.alternate) :
                statement.emptyStatement()))
        
    case 'LabeledStatement':
        break;
    
    case 'BreakStatement':
        return statement.breakStatement(
            node.label ? node.label.name : null);
        
    case 'ContinueStatement':
        return statement.continueStatement(
            node.label ? node.label.name : null);
        
    case 'WithStatement':
        break;
        
    case 'SwitchStatement':
        var pre = [], def = null, post =[];
        for (var i = 0; i < node.cases.length; ++i) {
            var e = node.cases[i];
            if (!e.test) {
                def = e;
                pre = node.cases.slice(0, i);
                post = node.cases.slice(i + 1);
                break;
            }
            pre = node.cases.slice(0, i + 1);
        }
        
        var caseMap = function(x) {
            return {
                'test' : evaluate(x.test),
                'consequent': (x.consequent ?
                    statement.statementList(map(x.consequent, evaluate)) :
                    statement.emptyStatement())
            };
        };
        
        return statement.switchStatement(
            evaluate(node.discriminant),
            map(pre, caseMap), {
                'consequent': (def ?
                    statement.statementList(map(def.consequent, evaluate)) :
                    statement.emptyStatement())
            },
            map(post, caseMap));
    
    case 'BreakStatement':
        return statement.breakStatement(node.label);
        
    case'ReturnStatement':
        return statement.returnStatement(
            (node.argument === null ?
                statement.emptyStatement() :
                evaluate(node.argument)));
    
    case 'ThrowStatement':
        return statement.throwStatement(evaluate(node.argument));
    
    case 'TryStatement':
        var body = evaluate(node.block),
            finalizer = (node.finalizer ? evaluate(node.finalizer) : statement.emptyStatement());
        return (node.handler ?
            statement.tryCatchFinallyStatement(body, node.handler.param.name, evaluate(node.handler), finalizer) :
            statement.tryFinallyStatement(body, finalizer));
    
    case 'WhileStatement':
        return statement.whileStatement(
            (node.test ?
                evaluate(node.test) :
                semantics.booleanLiteral(true)),
            evaluate(node.body));
    
    case 'DoWhileStatement':
        return statement.doWhileStatement(
            evaluate(node.body),
            evaluate(node.test));
    
    case 'ForStatement':
        return statement.forStatement(
            (node.init ? evaluate(node.init) : statement.emptyStatement()),
            (node.test ? evaluate(node.test) : value.booleanLiteral(true)),
            (node.update ? evaluate(node.update) : statement.emptyStatement()),
            evaluate(node.body));
    
    case 'ForInStatement':
        return statement.forInStatement(
            evaluate(node.left),
            evaluate(node.right),
            evaluate(node.body));
    
// Expression
    case 'ThisExpression':
        return expression.thisExpression();

    case 'SequenceExpression':
        return expression.sequenceExpression(map(node.expressions, evaluate));
    
    case 'UnaryExpression':
        var argument = evaluate(node.argument);
        switch (node.operator) {
        case '+': return expression.unaryPlusOperator(argument);
        case '-': return expression.unaryMinusOperator(argument);
        case '!': return expression.logicalNotOperator(argument);
        case '~': return expression.bitwiseNotOperator(argument);
        case 'void': return expression.voidOperator(argument);
        case 'typeof': return expression.typeofOperator(argument);
        default: return compute.error("Unknown Unary Operator:" + node.operator);
        }
        
    case 'UpdateExpression':
        var a = evaluate(node.argument);
        switch (node.operator) {
        case '++':  return (node.prefix ?
                        expression.prefixIncrement(a) :
                        expression.postfixIncrement(a));
        case '--':  return (node.prefix ?
                        expression.prefixDecrement(a) :
                        expression.postfixDecrement(a));
        
        default: return compute.error("Unknown Update Operator:" + node.operator);
        }

    case 'BinaryExpression': 
        var l = evaluate(node.left), r = evaluate(node.right);
        switch (node.operator) {
        case '+': return expression.addOperator(l, r);
        case '-': return expression.subtractOperator(l, r);
        case '*': return expression.multiplyOperator(l, r);
        case '/': return expression.divideOperator(l, r);
        case '%': return expression.remainderOperator(l, r);
        
        case '<<':  return expression.leftShiftOperator(l, r);
        case '>>':  return expression.signedRightShiftOperator(l, r);
        case '>>>': return expression.unsignedRightShiftOperator(l, r);
        case '&':   return expression.bitwiseAndOperator(l, r);
        case '^':   return expression.bitwiseXorOperator(l, r);
        case '|':   return expression.bitwiseOrOperator(l, r);
        
        case '==':  return expression.equalOperator(l, r);
        case '===':  return expression.strictEqualOperator(l, r);
        case '!=':  return expression.notEqualOperator(l, r);
        case '!==':  return expression.strictNotEqualOperator(l, r);
        
        case '<':   return expression.ltOperator(l, r);
        case '<=':  return expression.lteOperator(l, r);
        case '>':   return expression.gtOperator(l, r);
        case '>=':  return expression.gteOperator(l, r);
        case 'instanceof':  return expression.instanceofOperator(l, r);
        case 'in':  return expression.inOperator(l, r);
        
        default: return compute.error("Unknown op:" + node.operator);
        }
    
    case 'LogicalExpression':
        var l = evaluate(node.left), r = evaluate(node.right);
        switch (node.operator) {
        case '||':  return expression.logicalOr(l, r);
        case '&&':  return expression.logicalAnd(l, r)
        default:    return compute.error("Unknown Logical Operator:" + node.operator);
        }
        
    case 'AssignmentExpression':
        var l = evaluate(node.left), r = evaluate(node.right);
        switch (node.operator) {
        case '=':   return expression.assignment(l, r);
        case '+=':  return expression.compoundAssignment(expression.addOperator, l, r);
        case '-=':  return expression.compoundAssignment(expression.subtractOperator, l, r);
        case '*=':  return expression.compoundAssignment(expression.multiplyOperator, l, r);
        case '/=':  return expression.compoundAssignment(expression.divideOperator, l, r);
        case '%=':  return expression.compoundAssignment(expression.remainderOperator, l, r);
        
        case '<<=':     return expression.compoundAssignment(expression.leftShiftOperator, l, r);
        case '>>=':     return expression.compoundAssignment(expression.signedRightShiftOperator, l, r);
        case '>>>=':    return expression.compoundAssignment(expression.unsignedRightShiftOperator, l, r);
        case '&=':      return expression.compoundAssignment(expression.bitwiseAndOperator, l, r);
        case '^=':      return expression.compoundAssignment(expression.bitwiseXorOperator, l, r);
        case '|=':      return expression.compoundAssignment(expression.bitwiseOrOperator, l, r);

        default:    return compute.error("Unknown Assignment Operator:" + node.operator);
        }

    case 'ConditionalExpression':
        return expression.conditionalOperator(
            evaluate(node.test),
            evaluate(node.consequent),
            evaluate(node.alternate));
    
    case 'NewExpression':
        return expression.newExpression(
            evaluate(node.callee),
            map(node.args, evaluate));
    
    case 'CallExpression':
        return expression.callExpression(
            evaluate(node.callee),
            map(node.args, evaluate));
        
    case 'MemberExpression':
        return expression.memberExpression(
            evaluate(node.object),
            (node.computed ?
                evaluate(node.property) :
                value.stringLiteral(node.property.name)));
 
    case 'ArrayExpression':
        break;
    
    case 'ObjectExpression':
        return expression.objectLiteral(reduce(node.properties, function(p, c) {
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
                p[key]['value'] = value;
                break;
            }
            return p;
        }, {}));

// Function
    case 'FunctionExpression':
        return expression.functionExpression(
            (node.id === null ? null : node.id.name),
            map(node.params, function(x) {
                return x.name;
            }),
            sourceElements(node.body.body));
        
    case 'FunctionDeclaration':
        /*
         * Function declarations are handled when evaluating source elements
         * so this is a noop.
         */
        return statement.emptyStatement();
    
// Program
    case 'Program':
        return program.program(sourceElements(node.body));
    
// Declarations
    case 'VariableDeclaration':
        return declaration.variableDeclaration(
            map(node.declarations, evaluate));
    
    case 'VariableDeclarator':
        return (node.init ?
            declaration.variableInitDeclarator(node.id.name, evaluate(node.init)) :
            statement.emptyStatement());
    
// Value
    case 'Identifier':
        return value.identifier(node.name);
    
    case 'Literal':
        switch (node.kind) {
        case 'number':  return value.numberLiteral(node.value);
        case 'boolean': return value.booleanLiteral(node.value);
        case 'string':  return value.stringLiteral(node.value);
        case 'null':    return value.nullLiteral(node.value);
        case 'regexp':  return value.regularExpression(node.value);
        default:        return compute.error("Unknown Literal of kind: " + node.kind);
        }
    
    default:
        return compute.error("Unknown node: " + node);
    }
};

/* Export
 ******************************************************************************/
return {
    'evaluate': evaluate
};

});