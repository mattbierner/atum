/**
 * @fileOverview Functions for interpreting an ECMAScript abstract syntax tree.
 */
define(['ecma/ast/node',
        'atum/compute',
        'atum/completion',
        'atum/semantics/semantics',
        'atum/semantics/undef',
        'atum/builtin/global'],
function(ast,
        compute,
        completion,
        semantics,
        undef,
        global){
/* Helpers
 ******************************************************************************/
var map = Function.prototype.call.bind(Array.prototype.map);
var reduce = Function.prototype.call.bind(Array.prototype.reduce);

/* Evaluation
 ******************************************************************************/
/**
 * Maps AST nodes for declarations to semantics computations.
 */
var declaration = function(node) {
    switch (node.type) {
    case 'BlockStatement':
        return semantics.statementList(map(node.body, declaration));
    
    case 'IfStatement':
        return (node.alternate ?
            compute.next(
                declaration(node.consequent),
                declaration(node.alternate)) :
            declaration(node.consequent));
    
    case 'WithStatement':
        return declaration(node.body);
    
    case 'SwitchStatement':
        return semantics.emptyStatement();
    
    case 'TryStatement':
        return compute.next(
            declaration(node.block),
            (compute.next(
            (node.handler ?
                declaration(node.handler.body) :
                semantics.emptyStatement()),
            (node.finalizer ?
                declaration(node.finalizer) :
                semantics.emptyStatement()))));
        break;
    
    case 'WhileStatement':
    case 'DoWhileStatement':
        return declaration(node.body);
        
    case 'ForStatement':
        return (node.init ? 
            compute.next(
                declaration(node.init),
                declaration(node.body)) :
            declaration(node.body));
        
    case 'ForInStatement':
        return (node.left ? 
            compute.next(
                declaration(node.left),
                declaration(node.body)) :
            declaration(node.body));
    
    case 'FunctionDeclaration':
        return semantics.functionDeclaration(
            (node.id === null ? null : node.id.name),
            map(node.params, function(x) {
                return x.name;
            }),
            sourceElements(node.body.body));
        
    case 'VariableDeclaration':
        return semantics.variableDeclaration(
            map(node.declarations, declaration));
        
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
        map(elems, evaluate),
        map(elems, declaration));
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
        return semantics.emptyStatement();
        
    case 'DebuggerStatement':
        // @TODO?
        return semantics.emptyStatement();
    
    case 'BlockStatement':
        return semantics.statementList(map(node.body, evaluate));
        
    case 'ExpressionStatement':
        return semantics.expressionStatement(evaluate(node.expression));
    
    case 'IfStatement':
        return semantics.ifStatement(
            evaluate(node.test),
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
                    semantics.statementList(map(x.consequent, evaluate)) :
                    semantics.emptyStatement())
            };
        };
        
        return semantics.switchStatement(
            evaluate(node.discriminant),
            map(pre, caseMap), {
                'consequent': (def ?
                    semantics.statementList(map(def.consequent, evaluate)) :
                    semantics.emptyStatement())
            },
            map(post, caseMap));
    
    case 'BreakStatement':
        return semantics.breakStatement(node.label);
        
    case'ReturnStatement':
        return semantics.returnStatement(node.argument === null ?
            semantics.emptyStatement() :
            evaluate(node.argument));
    
    case 'ThrowStatement':
        return semantics.throwStatement(evaluate(node.argument));
    
    case 'TryStatement':
        var body = evaluate(node.block),
            finalizer = (node.finalizer ? evaluate(node.finalizer) : semantics.emptyStatement());
        return (node.handler ?
            semantics.tryCatchFinallyStatement(body, node.handler.param.name, evaluate(node.handler), finalizer) :
            semantics.tryFinallyStatement(body, finalizer));
    
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
        return semantics.sequenceExpression(map(node.expressions, evaluate));
    
    case 'UnaryExpression':
        var argument = evaluate(node.argument);
        switch (node.operator) {
        case '+': return semantics.unaryPlusOperator(argument);
        case '-': return semantics.unaryMinusOperator(argument);
        case '!': return semantics.logicalNotOperator(argument);
        case '~': return semantics.bitwiseNotOperator(argument);
        case 'void': return semantics.voidOperator(argument);
        case 'typeof': return semantics.typeofOperator(argument);

        default: return compute.error("Unknown Unary Operator:" + node.operator);
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
        
        default: return compute.error("Unknown Update Operator:" + node.operator);
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

        default: return compute.error("Unknown op:" + node.operator);
        }

    case 'LogicalExpression':
        var l = evaluate(node.left), r = evaluate(node.right);
        switch (node.operator) {
        case '||':  return semantics.logicalOr(l, r);
        case '&&':  return semantics.logicalAnd(l, r)
        default:    return compute.error("Unknown Logical Operator:" + node.operator);
        }
        
    case 'AssignmentExpression':
        var l = evaluate(node.left), r = evaluate(node.right);
        switch (node.operator) {
        case '=':   return semantics.assignment(l, r);
        case '+=':  return semantics.compoundAssignment(semantics.addOperator, l, r);
        case '-=':  return semantics.compoundAssignment(semantics.subtractOperator, l, r);
        case '*=':  return semantics.compoundAssignment(semantics.multiplyOperator, l, r);
        case '/=':  return semantics.compoundAssignment(semantics.divideOperator, l, r);
        case '%=':  return semantics.compoundAssignment(semantics.remainderOperator, l, r);
        
        case '<<=':     return semantics.compoundAssignment(semantics.leftShiftOperator, l, r);
        case '>>=':     return semantics.compoundAssignment(semantics.signedRightShiftOperator, l, r);
        case '>>>=':    return semantics.compoundAssignment(semantics.unsignedRightShiftOperator, l, r);
        case '&=':      return semantics.compoundAssignment(semantics.bitwiseAndOperator, l, r);
        case '^=':      return semantics.compoundAssignment(semantics.bitwiseXorOperator, l, r);
        case '|=':      return semantics.compoundAssignment(semantics.bitwiseOrOperator, l, r);

        default:    return compute.error("Unknown Assignment Operator:" + node.operator);
        }

    case 'ConditionalExpression':
        return semantics.conditionalOperator(evaluate(node.test),
            evaluate(node.consequent),
            evaluate(node.alternate));
    
    case 'NewExpression':
        return semantics.newExpression(
            evaluate(node.callee),
            map(node.args, evaluate));
    
    case 'CallExpression':
        return semantics.callExpression(
            evaluate(node.callee),
            map(node.args, evaluate));
        
    case 'MemberExpression':
        return semantics.memberExpression(
            evaluate(node.object),
            (node.computed ?
                evaluate(node.property) :
                semantics.stringLiteral(node.property.name)));
 
    case 'ArrayExpression':
        break;
    
    case 'ObjectExpression':
        return semantics.objectLiteral(reduce(node.properties, function(p, c) {
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
                p[key]['value'] = value;
                break;
            }
            return p;
        }, {}));

// Function
    case 'FunctionExpression':
        return semantics.functionExpression(
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
        return semantics.emptyStatement();
        
    
// Program
    case 'Program':
        return sourceElements(node.body);
    
// Declarations
    case 'VariableDeclaration':
        return semantics.variableDeclaration(
            map(node.declarations, evaluate));
        
    case 'VariableDeclarator':
        return (node.init ?
            semantics.variableInitDeclarator(node.id.name, evaluate(node.init)) :
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
        default: return compute.error("Unknown Literal of kind: " + node.kind);
        }
    
    default:
        return compute.error("Unknown node: " + node);
    }
};

/* Interpretation
 ******************************************************************************/
var exec = function(p, ctx, v, ok, err) {
    return p(ctx, v, ok, err)();
};

var ret = function(x, ctx, v) {
    return function() {
        console.log(v);
        console.log(ctx);
        return x;
    };
};

var thr = function(x, ctx, v) {
    return function() {
        console.log(v);
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
    return eval(compute.bind(
        compute.next(global.initialize(), evaluate(root)),
        function(x) {
            if (x instanceof completion.Completion) {
                switch (x.type) {
                case completion.NormalCompletion.type: 
                    return (x.value === null ? undef.create() : compute.always(x.value));
                case completion.ThrowCompletion.type: 
                    return compute.error(x.value);
                }
            }
            return compute.always(x);
        }));
};

/* Export
 ******************************************************************************/
return {
    'eval': eval,
    'interpret': interpret
};

});
