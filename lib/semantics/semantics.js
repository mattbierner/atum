/**
 * @fileOverview Mapping of AST nodes to computations.
 */
define(['exports',
        'ecma_ast/node',
        'atum/compute',
        'atum/fun',
        'atum/compute/statement',
        'atum/operations/execution_context',
        'atum/semantics/declaration',
        'atum/semantics/expression',
        'atum/semantics/func',
        'atum/semantics/program',
        'atum/semantics/statement',
        'atum/semantics/value'],
function(exports,
        ecma_node,
        compute,
        fun,
        statement,
        execution_context,
        declaration_semantics,
        expression_semantics,
        function_semantics,
        program_semantics,
        statement_semantics,
        value_semantics){
"use strict";

/**
 * Is an array of source elements strict code?
 */
var isStrict = function(elems) {
    if (elems && elems.length && elems[0].type === 'ExpressionStatement') {
        var first = elems[0].expression;
        return (first && first.type === 'Literal' && first.kind ==='string' && first.value === 'use strict');
    }
    return false
};

var merge = function(x, y) {
    return [
        fun.concat(x[0], y[0]),
        fun.concat(x[1], y[1])];
};

/* Declaration
 ******************************************************************************/
/**
 * Extract the declarations from some code.
 * 
 * Returns a pair of function declarations and variable declarations/
 */
var decls = function(node) {
    if (!node) return [[], []];
    
    if (node.length) return fun.map(decls, node).reduceRight(merge, [[], []]);
    
    switch (node.type) {
    case 'SwitchCase':
        return decls(node.consequent);
    
    case 'CatchClause':
        return decls(node.body);
    
    case 'BlockStatement':
        return decls(node.body);
    
    case 'IfStatement':
        return merge(
            decls(node.consequent),
            decls(node.alternate));
    
    case 'SwitchStatement':
        return decls(node.cases);
    
    case 'TryStatement':
        return merge(
            decls(node.block),
            merge(
                decls(node.handler),
                decls(node.finalizer)));
    
    case 'WithStatement':
    case 'WhileStatement':
    case 'DoWhileStatement':
        return decls(node.body);
    
    case 'ForStatement':
        return merge(
            decls(node.init),
            decls(node.body));
    
    case 'ForInStatement':
        return merge(
            decls(node.left),
            decls(node.body));
    
    case 'FunctionDeclaration':
        var id = node.id.name,
            params = fun.map(function(x) { return x.name; }, node.params),
            strict = isStrict(node.body.body);
        return [
            [],
            [[id,
              declaration_semantics.functionDeclaration(
                  id,
                  strict,
                  params,
                  node.body,
                  decls(node.body),
                  mapSemantics(node.body))]]];
        
    case 'VariableDeclaration':
        return decls(node.declarations);
    
    case 'VariableDeclarator':
        return [
            [node.id.name],
            []]
    }
    return [[], []];
};

/* General Computations
 ******************************************************************************/
var expressionLoc = function(loc, body) {
    return compute.next(
        execution_context.setLoc(loc),
        body);
};

var statementLoc = function(loc, body) {
    return statement.next(
        statement.liftExpression(execution_context.setLoc(loc)),
        body);
};

/* Program Semantics
 ******************************************************************************/
/**
 * 
 */
var sourceBody = function(elems) {
    return program_semantics.sourceBody(
        isStrict(elems),
        mapSemantics(elems));
};


/**
 * 
 */
var sourceElements = function(elems) {
    return program_semantics.sourceElements(
        isStrict(elems),
        decls(elems),
        mapSemantics(elems));
};

var program = program_semantics.program;

var programBody = program_semantics.programBody;

/**
 * Maps AST nodes to semantics computations.
 */
var mapSemantics = (function(){
    var mapper = function(node, strict) {
        var loc = node.loc;
        
        switch (node.type) {
    // Clauses
        case 'SwitchCase':
            return {
                'test' : mapSemantics(node.test, strict),
                'consequent': mapSemantics(node.consequent, strict)
            };
           
        case 'CatchClause':
            return statementLoc(loc,
                mapSemantics(node.body, strict));
    
    // Statement
        case 'EmptyStatement':
            return statementLoc(loc,
                emptyStatement);
            
        case 'DebuggerStatement':
            return statementLoc(loc,
                debuggerStatement);
        
        case 'BlockStatement':
            return statementLoc(loc,
                blockStatement(
                    mapSemantics(node.body, strict)));
        
        case 'ExpressionStatement':
            return statementLoc(loc,
                expressionStatement(
                    mapSemantics(node.expression, strict)));
        
        case 'IfStatement':
            return statementLoc(loc,
                ifStatement(
                    mapSemantics(node.test, strict),
                    mapSemantics(node.consequent, strict),
                    mapSemantics(node.alternate, strict)));
            
        case 'LabeledStatement':
            break;
        
        case 'BreakStatement':
            return statementLoc(loc,
                breakStatement(node.label));
        
        case 'ContinueStatement':
            return statementLoc(loc,
                continueStatement(node.label));
        
        case 'ReturnStatement':
            return statementLoc(loc,
                returnStatement(
                    mapSemantics(node.argument, strict)));
        
        case 'ThrowStatement':
            return statementLoc(loc,
                throwStatement(
                    mapSemantics(node.argument, strict)));
        
        case 'WithStatement':
            return statementLoc(loc,
                withStatement(
                    mapSemantics(node.object, strict),
                    mapSemantics(node.body, strict)));
        
        case 'SwitchStatement':
            return statementLoc(loc,
                switchStatement(
                    mapSemantics(node.discriminant, strict),
                    mapSemantics(node.cases, strict)));
    
        case 'TryStatement':
            return statementLoc(loc,
                tryStatement(
                    mapSemantics(node.block, strict),
                    (node.handler && node.handler.param),
                    mapSemantics(node.handler, strict),
                    mapSemantics(node.finalizer, strict)));
            
        case 'WhileStatement':
            return statementLoc(loc,
                whileStatement(
                    mapSemantics(node.test, strict),
                    mapSemantics(node.body, strict)));
        
        case 'DoWhileStatement':
            return statementLoc(loc,
                doWhileStatement(
                    mapSemantics(node.body, strict),
                    mapSemantics(node.test, strict)));
        
        case 'ForStatement':
            return statementLoc(loc,
                forStatement(
                    mapSemantics(node.init, strict),
                    mapSemantics(node.test, strict),
                    mapSemantics(node.update, strict),
                    mapSemantics(node.body, strict)));
        
        case 'ForInStatement':
            if (node.left.type === 'VariableDeclaration')
                return statementLoc(loc,
                    forVarInStatement(
                        node.left.declarations[0].id.name,
                        mapSemantics(node.right, strict),
                        mapSemantics(node.body, strict)));
            
            return statementLoc(loc,
                forInStatement(
                    mapSemantics(node.left, strict),
                    mapSemantics(node.right, strict),
                    mapSemantics(node.body, strict)));
        
    // Expression
        case 'ThisExpression':
            return expressionLoc(loc,
                thisExpression);
        
        case 'SequenceExpression':
            return expressionLoc(loc,
                sequenceExpression(
                    mapSemantics(node.expressions, strict)));
        
        case 'UnaryExpression':
            return expressionLoc(loc,
                unaryExpression(
                    node.operator,
                    mapSemantics(node.argument, strict)));
        
        case 'UpdateExpression':
            return expressionLoc(loc,
                updateExpression(
                    node.operator,
                    node.prefix,
                    mapSemantics(node.argument, strict)));
        
        case 'BinaryExpression':
            return expressionLoc(loc,
                binaryExpression(
                    node.operator,
                    mapSemantics(node.left, strict),
                    mapSemantics(node.right, strict)));
        
        case 'LogicalExpression':
            return expressionLoc(loc,
                logicalExpression(
                    node.operator,
                    mapSemantics(node.left, strict),
                    mapSemantics(node.right, strict)));
        
        case 'AssignmentExpression':
            return expressionLoc(loc,
                assignmentExpression(
                    node.operator,
                    mapSemantics(node.left, strict),
                    mapSemantics(node.right, strict)));
        
        case 'ConditionalExpression':
            return expressionLoc(loc,
                conditionalExpression(
                    mapSemantics(node.test, strict),
                    mapSemantics(node.consequent, strict),
                    mapSemantics(node.alternate, strict)));
        
        case 'NewExpression':
            return expressionLoc(loc,
                newExpression(
                    mapSemantics(node.callee, strict),
                    mapSemantics(node.args, strict)));
        
        case 'CallExpression':
            return expressionLoc(loc,
                callExpression(
                    mapSemantics(node.callee, strict),
                    mapSemantics(node.args, strict)));
            
        case 'MemberExpression':
            return expressionLoc(loc,
                (node.computed ?
                    computedMemberExpression(
                        mapSemantics(node.object, strict),
                        mapSemantics(node.property, strict)) :
                memberExpression(
                    mapSemantics(node.object, strict),
                    node.property)));
        
        case 'ArrayExpression':
            return expressionLoc(loc,
                arrayExpression(
                    mapSemantics(node.elements, strict)));
        
        case 'ObjectExpression':
            return expressionLoc(loc,
                objectExpression(node.properties));
    
    // Function
        case 'FunctionExpression':
            return expressionLoc(loc,
                functionExpression(
                    node.id,
                    node.params,
                    node.body,
                    decls(node.body),
                    mapSemantics(node.body, strict)));
        
        case 'FunctionDeclaration':
            /*
             * Function declarations are handled when evaluating source elements
             * so this is a noop.
             */
            return statement.empty;
        
    // Program
        case 'Program':
            return expressionLoc(loc,
                program(node.body));
        
    // Declarations
        case 'VariableDeclaration':
            return statementLoc(loc,
                declarationStatement(
                    mapSemantics(node.declarations, strict)));
        
        case 'VariableDeclarator':
            return expressionLoc(loc,
                variableDeclarator(
                    node.id,
                    mapSemantics(node.init, strict)));
        
    // Value
        case 'Identifier':
            return expressionLoc(loc,
                identifier(node.name, strict));
        
        case 'Literal':
            return expressionLoc(loc,
                literal(node.kind, node.value));
        }
        return null;
    };
    
    return function(node, strict) {
        if (!node)
            return node;
        
        if (!(node instanceof ecma_node.Node) && 'length' in node)
            return fun.map(function(x) {
                return mapSemantics(x, strict);
            }, node);
        
        return mapper(node, strict);
    };
}());

/* Statement Semantics
 ******************************************************************************/
var emptyStatement = statement_semantics.emptyStatement;

var debuggerStatement = statement_semantics.debuggerStatement;

var blockStatement = statement_semantics.blockStatement;

var expressionStatement = statement_semantics.expressionStatement;

var ifStatement = function(test, consequent, alternate) {
    return statement_semantics.ifStatement(
        test,
        consequent,
        (alternate || statement_semantics.emptyStatement));
};

var breakStatement = function(label) {
    return statement_semantics.breakStatement(
        label ? label.name : null);
};

var continueStatement = function(label) {
    return statement_semantics.continueStatement(
        label ? label.name : null);
};

var returnStatement = function(argument) {
    return statement_semantics.returnStatement(
        argument || expression_semantics.emptyExpression);
};

var throwStatement = statement_semantics.throwStatement;

var withStatement = statement_semantics.withStatement;

var declarationStatement = statement_semantics.declarationStatement;

var switchStatement = function(discriminant, cases) {
    var pre = [], def = null, post =[];
    for (var i = 0; i < cases.length; ++i) {
        var e = cases[i];
        if (!e.test) {
            def = e;
            pre = cases.slice(0, i);
            post = cases.slice(i + 1);
            break;
        }
        pre = cases.slice(0, i + 1);
    }
    
    var caseMap = function(x) {
        return {
            'test' : x.test,
            'consequent': (x.consequent ?
                statement_semantics.statementList(x.consequent) :
                statement_semantics.emptyStatement)
        };
    };
    
    return statement_semantics.switchStatement(
        discriminant,
        fun.map(caseMap, pre), {
            'consequent': (def ?
                statement_semantics.statementList(def.consequent) :
                statement_semantics.emptyStatement)
        },
        fun.map(caseMap, post));
};

var tryStatement = function(block, param, handler, finalizer) {
    var finalizer = (finalizer|| statement_semantics.emptyStatement);
    return (handler ?
        statement_semantics.tryCatchFinallyStatement(block, param.name, handler, finalizer) :
        statement_semantics.tryFinallyStatement(block, finalizer));
};

var whileStatement = function(test, body) {
    return statement_semantics.whileStatement(
        (test || value_semantics.booleanLiteral(true)),
        body);
};

var doWhileStatement = statement_semantics.doWhileStatement;

var forStatement = function(init, test, update, body) {
    return statement_semantics.forStatement(
        (init || expression_semantics.emptyExpression),
        (test || value_semantics.booleanLiteral(true)),
        (update || expression_semantics.emptyExpression),
        body);
};

var forInStatement = statement_semantics.forInStatement;

var forVarInStatement = statement_semantics.forVarInStatement;

/* Expression Semantics
 ******************************************************************************/
var thisExpression = expression_semantics.thisExpression;

var sequenceExpression = expression_semantics.sequenceExpression;

var unaryExpression = function(operator, argument) {
    switch (operator) {
    case '+': return expression_semantics.unaryPlusOperator(argument);
    case '-': return expression_semantics.unaryMinusOperator(argument);
    case '!': return expression_semantics.logicalNotOperator(argument);
    case '~': return expression_semantics.bitwiseNotOperator(argument);
    case 'delete': return expression_semantics.deleteOperator(argument);
    case 'void': return expression_semantics.voidOperator(argument);
    case 'typeof': return expression_semantics.typeofOperator(argument);
    }
    throw "Unknown Unary Operator:" + operator;
};

var updateExpression = function(operator, prefix, a) {
    switch (operator) {
    case '++':  return (prefix ?
                    expression_semantics.prefixIncrement(a) :
                    expression_semantics.postfixIncrement(a));
    case '--':  return (prefix ?
                    expression_semantics.prefixDecrement(a) :
                    expression_semantics.postfixDecrement(a));
    }
    throw "Unknown Update Operator:" + operator;
};

var binaryExpression = function(operator, l, r) {
    switch (operator) {
    case '+': return expression_semantics.addOperator(l, r);
    case '-': return expression_semantics.subtractOperator(l, r);
    case '*': return expression_semantics.multiplyOperator(l, r);
    case '/': return expression_semantics.divideOperator(l, r);
    case '%': return expression_semantics.remainderOperator(l, r);
    
    case '<<':  return expression_semantics.leftShiftOperator(l, r);
    case '>>':  return expression_semantics.signedRightShiftOperator(l, r);
    case '>>>': return expression_semantics.unsignedRightShiftOperator(l, r);
    case '&':   return expression_semantics.bitwiseAndOperator(l, r);
    case '^':   return expression_semantics.bitwiseXorOperator(l, r);
    case '|':   return expression_semantics.bitwiseOrOperator(l, r);
    
    case '==':  return expression_semantics.equalOperator(l, r);
    case '===':  return expression_semantics.strictEqualOperator(l, r);
    case '!=':  return expression_semantics.notEqualOperator(l, r);
    case '!==':  return expression_semantics.strictNotEqualOperator(l, r);
    
    case '<':   return expression_semantics.ltOperator(l, r);
    case '<=':  return expression_semantics.lteOperator(l, r);
    case '>':   return expression_semantics.gtOperator(l, r);
    case '>=':  return expression_semantics.gteOperator(l, r);
    case 'instanceof':  return expression_semantics.instanceofOperator(l, r);
    case 'in':  return expression_semantics.inOperator(l, r);
    }
    throw "Unknown Binary Operator:" + operator;
};

var logicalExpression = function(operator, l, r) {
    switch (operator) {
    case '||':  return expression_semantics.logicalOr(l, r);
    case '&&':  return expression_semantics.logicalAnd(l, r)
    }
    throw "Unknown Logical Operator:" + operator;
};

var assignmentExpression = function(operator, l, r) {
    switch (operator) {
    case '=':   return expression_semantics.assignment(l, r);
    
    case '+=':  return expression_semantics.compoundAssignment(expression_semantics.addOperator, l, r);
    case '-=':  return expression_semantics.compoundAssignment(expression_semantics.subtractOperator, l, r);
    case '*=':  return expression_semantics.compoundAssignment(expression_semantics.multiplyOperator, l, r);
    case '/=':  return expression_semantics.compoundAssignment(expression_semantics.divideOperator, l, r);
    case '%=':  return expression_semantics.compoundAssignment(expression_semantics.remainderOperator, l, r);
    
    case '<<=':     return expression_semantics.compoundAssignment(expression_semantics.leftShiftOperator, l, r);
    case '>>=':     return expression_semantics.compoundAssignment(expression_semantics.signedRightShiftOperator, l, r);
    case '>>>=':    return expression_semantics.compoundAssignment(expression_semantics.unsignedRightShiftOperator, l, r);
    case '&=':      return expression_semantics.compoundAssignment(expression_semantics.bitwiseAndOperator, l, r);
    case '^=':      return expression_semantics.compoundAssignment(expression_semantics.bitwiseXorOperator, l, r);
    case '|=':      return expression_semantics.compoundAssignment(expression_semantics.bitwiseOrOperator, l, r);
    }
    throw "Unknown Assignment Operator:" + operator;
};


var variableDeclarator = function(id, init) {
    return (init ?
        declaration_semantics.variableInitDeclarator(id.name, init) :
        expression_semantics.emptyExpression);
};

var identifier = function(name, strict) {
    return value_semantics.identifier(name);
};

var literal = function(kind, value) {
    switch (kind) {
    case 'number':  return value_semantics.numberLiteral(value);
    case 'boolean': return value_semantics.booleanLiteral(value);
    case 'string':  return value_semantics.stringLiteral(value);
    case 'null':    return value_semantics.nullLiteral(value);
    case 'regexp':  return value_semantics.regularExpressionLiteral(value);
    }
    throw "Unknown Literal of kind:" + kind;
};

var conditionalExpression = expression_semantics.conditionalExpression;

var newExpression = expression_semantics.newExpression;

var callExpression = expression_semantics.callExpression;

var memberExpression = function(object, property) {
    return expression_semantics.memberExpression(
        object,
        value_semantics.stringLiteral(property.name));
};

var computedMemberExpression = expression_semantics.memberExpression;

var arrayExpression = value_semantics.arrayLiteral;

var objectExpression = fun.compose(
    value_semantics.objectLiteral,
    fun.curry(fun.map, function(property) {
        var type = 'value';
        switch (property.type) {
        case 'ObjectGetter': type = 'get'; break;
        case 'ObjectSetter': type = 'set'; break;
        case 'ObjectValue':  type = 'value'; break;
        }
        
        return {
            'key': (property.key.name === undefined ? property.key.value : property.key.name),
            'type': type,
            'value': mapSemantics(property.value)
        };
    }));

var functionExpression = function(id, params, code, declarations, body) {
    return function_semantics.fun(
        (id && id.name),
        isStrict(code.body),
        fun.map(function(x) { return x.name; }, params),
        body,
        declarations,
        body);
};

var program = fun.compose(
    program_semantics.program,
    sourceElements);


/* Export
 ******************************************************************************/
// Statements
exports.emptyStatement = emptyStatement;
exports.expressionStatement = expressionStatement;
exports.blockStatement = blockStatement;
exports.debuggerStatement = debuggerStatement;
exports.withStatement = withStatement;

exports.declarationStatement = declarationStatement;

exports.returnStatement = returnStatement;
exports.throwStatement = throwStatement;
exports.breakStatement = breakStatement;
exports.continueStatement = continueStatement;

exports.ifStatement = ifStatement;
exports.switchStatement = switchStatement;

exports.doWhileStatement = doWhileStatement;
exports.whileStatement = whileStatement;
exports.forStatement = forStatement;
exports.forInStatement =  forInStatement;
exports.forVarInStatement = forVarInStatement;

exports.tryStatement = tryStatement;

// Expression
exports.thisExpression = thisExpression;
exports.sequenceExpression = sequenceExpression;
exports.unaryExpression = unaryExpression;
exports.updateExpression = updateExpression;
exports.binaryExpression = binaryExpression;
exports.logicalExpression = logicalExpression;
exports.assignmentExpression = assignmentExpression;
exports.conditionalExpression = conditionalExpression;
exports.newExpression = newExpression;
exports.callExpression = callExpression;
exports.memberExpression = memberExpression;
exports.computedMemberExpression = computedMemberExpression;
exports.arrayExpression = arrayExpression;
exports.objectExpression = objectExpression;

// Function
exports.functionExpression = functionExpression;

// Declarations
exports.variableDeclarator = variableDeclarator;

// Value
exports.literal = literal;
exports.identifier = identifier;

// General
exports.sourceElements = sourceElements;

// Program
exports.program = program;
exports.programBody = programBody;

exports.mapSemantics = mapSemantics;

});