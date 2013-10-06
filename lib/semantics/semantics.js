/**
 * @fileOverview Mapping of AST nodes to computations.
 * 
 * Mapping requires two passes, one for declarations and one for the actual
 * program. This is because Javascript initializes all values declared in a
 * scope to undefined even before they are declared. Function declarations are
 * also initialized during this pass.
 */
define(['atum/compute',
        'atum/fun',
        'atum/compute/statement',
        'atum/debug/operations',
        'atum/operations/execution_context',
        'atum/semantics/declaration',
        'atum/semantics/expression',
        'atum/semantics/func',
        'atum/semantics/program',
        'atum/semantics/program_fragment',
        'atum/semantics/value'],
function(compute,
        fun,
        statement,
        debug_operations,
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

/* General Computations
 ******************************************************************************/
var input = function(loc, body) {
    return compute.next(
        execution_context.setLoc(loc),
        body);
};

/* Declaration
 ******************************************************************************/
/**
 * Maps AST nodes for declarations to semantics computations.
 */
var declarations = function(node) {
        var empty = compute.bind(statement_semantics.emptyStatement, fun.compose(compute.just, compute.dispatch));

    if (!node)
        return empty;
    
    
    switch (node.type) {
    case 'BlockStatement':
        return compute.bind(
            compute.enumerationa(fun.map(declarations, node.body)),
            fun.compose(compute.just, statement_semantics.statementList));
    
    case 'IfStatement':
        return compute.bind(
            compute.enumeration(
                declarations(node.consequent),
                declarations(node.alternate)),
            fun.compose(compute.just, statement_semantics.statementList));
    
    case 'WithStatement':
        return declarations(node.body);
    
    case 'SwitchStatement':
        return empty;
    
    case 'TryStatement':
        return compute.next(
            declarations(node.block),
            compute.next(
                declarations(node.handler ? node.handler.body : null),
                declarations(node.finalizer)));
    
    case 'WhileStatement':
    case 'DoWhileStatement':
        return declarations(node.body);
        
    case 'ForStatement':
        return compute.bind(
            compute.enumeration(
                declarations(node.init),
                declarations(node.body)),
            fun.compose(compute.just, statement_semantics.statementList));
    
    case 'ForInStatement':
        return compute.bind(
            compute.enumeration(
                declarations(node.left),
                declarations(node.body)),
            fun.compose(compute.just, statement_semantics.statementList));
    
    case 'FunctionDeclaration':
        var id = (node.id === null ? null : node.id.name),
            params = fun.map(function(x) { return x.name; }, node.params),
            strict = isStrict(node.body.body);
        return compute.bind(
            sourceElements(node.body.body),
            function(body) {
                return input(node.loc, declaration_semantics.functionDeclaration(
                    id,
                    params,
                    body,
                    strict));
            });
        
    case 'VariableDeclaration':
        return compute.bind(
            compute.enumerationa(fun.map(declarations, node.declarations)),
            declaration_semantics.variableDeclaration);
    
    case 'VariableDeclarator':
        return input(node.loc, declaration_semantics.variableDeclarator(node.id.name));
    
    default:
        return empty
    }
};

/**
 * 
 */
var sourceElements = function(elems) {
    return compute.binary(
        compute.enumerationa(fun.map(declarations, elems)),
        compute.enumerationa(fun.map(mapSemantics, elems)),
        function(decls, vals) {
            return program_semantics.sourceElements(
                isStrict(elems),
                decls,
                vals.map(compute.dispatch));
        });
};

var program = function(body) {
    return compute.bind(body, program_semantics.program);
};

var programBody = function(body) {
    return compute.bind(body, program_semantics.programBody);
};

/* Program Semantics
 ******************************************************************************/

/**
 * Maps AST nodes to semantics computations.
 */
var mapSemantics = (function(){
    var mapper = function(node) {
        var loc = node.loc;
        
        switch (node.type) {
    // Clauses
        case 'SwitchCase':
           break;
           
        case 'CatchClause':
            return mapSemantics(node.body);
    
    // Statement
        case 'EmptyStatement':
            return emptyStatement();
            
        case 'DebuggerStatement':
            return debuggerStatement();
        
        case 'BlockStatement':
            return blockStatement(node.body);
        
        case 'ExpressionStatement':
            return expressionStatement(node.expression);
        
        case 'IfStatement':
            return ifStatement(node.test, node.consequent, node.alternate);
            
        case 'LabeledStatement':
            break;
        
        case 'BreakStatement':
            return statement_semantics.breakStatement(
                (node.label ? node.label.name : null));
        
        case 'ContinueStatement':
            return statement_semantics.continueStatement(
                (node.label ? node.label.name : null));
        
        case 'ReturnStatement':
            return returnStatement(node.argument);
        
        case 'ThrowStatement':
            return throwStatement(node.argument);
        
        case 'WithStatement':
            return withStatement(node.object, node.body);
        
        case 'SwitchStatement':
            return switchStatement(node.discriminant, node.cases);
    
        case 'TryStatement':
            return tryStatement(node.block, node.handler, node.finalizer);
            
        case 'WhileStatement':
            return whileStatement(node.test, node.body);
        
        case 'DoWhileStatement':
            return doWhileStatement(node.body, node.test);
        
        case 'ForStatement':
            return forStatement(node.init, node.test, node.update, node.body);
        
        case 'ForInStatement':
            return forInStatement(node.left, node.right, node.body);
        
    // Expression
        case 'ThisExpression':
            return thisExpression();
        
        case 'SequenceExpression':
            return sequenceExpression(node.expressions);
        
        case 'UnaryExpression':
            return unaryExpression(node.operator, node.argument);
        
        case 'UpdateExpression':
            return updateExpression(node.operator, node.prefix, node.argument);
        
        case 'BinaryExpression':
            return binaryExpression(node.operator, node.left, node.right);
        
        case 'LogicalExpression':
            return logicalExpression(node.operator, node.left, node.right);
        
        case 'AssignmentExpression':
            return assignmentExpression(node.operator, node.left, node.right);
        
        case 'ConditionalExpression':
            return conditionalExpression(node.test, node.consequent, node.alternate);
        
        case 'NewExpression':
            return newExpression(node.callee, node.args);
        
        case 'CallExpression':
            return callExpression(node.callee, node.args);
            
        case 'MemberExpression':
            return memberExpression(node.computed, node.object, node.property);
     
        case 'ArrayExpression':
            return arrayExpression(node.elements);
        
        case 'ObjectExpression':
            return objectExpression(node.properties);
        
    // Function
        case 'FunctionExpression':
            return functionExpression(node.id, node.params, node.body);
        
        case 'FunctionDeclaration':
            /*
             * Function declarations are handled when evaluating source elements
             * so this is a noop.
             */
            return statement_semantics.emptyStatement;
        
    // Program
        case 'Program':
            return program(node.body);
        
    // Declarations
        case 'VariableDeclaration':
            return variableDeclaration(node.declarations);
        
        case 'VariableDeclarator':
            return variableDeclarator(node.id, node.init);
        
    // Value
        case 'Identifier':
            return identifier(node.name);
        
        case 'Literal':
            return literal(node.kind, node.value);
        }
        
        throw "Unknown node: " + node;
    };
    return function(node) {
        if (!node) return node;
        return input(node.loc, mapper(node));
    };
}());

var emptyStatement = fun.constant(statement_semantics.emptyStatement);

var debuggerStatement = debug_operations.debuggerStatement();

var blockStatement = function(elems) {
    return compute.bind(
        compute.enumerationa(fun.map(mapSemantics, elems)),
        statement_semantics.blockStatement);
};

var expressionStatement = fun.compose(
    statement_semantics.expressionStatement,
    mapSemantics);

var ifStatement = function(test, consequent, alternate) {
    return compute.binary(
        mapSemantics(consequent),
        (alternate ?
            mapSemantics(alternate) :
            statement_semantics.emptyStatement),
        function(consequent, alternate) {
            return statement_semantics.ifStatement(
                mapSemantics(test),
                consequent,
                alternate);
    });
};

var breakStatement = function(label) {
    return statement_semantics.breakStatement(
        label ? label.name : null);
};

var continueStatement = function(label) {
    return statement_semantics.continueStatement(
        label ? label.name : null);
};

var returnStatement = fun.compose(
    statement_semantics.returnStatement,
    mapSemantics);

var throwStatement = fun.compose(
    statement_semantics.throwStatement,
    mapSemantics);

var withStatement = function(object, body) {
    return compute.bind(
        mapSemantics(body),
        function(body) {
            return statement_semantics.withStatement(
                mapSemantics(object),
                body);
        });
};

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
        return compute.bind(
            compute.bind(
                compute.enumerationa(fun.map(mapSemantics, x.consequent)),
                statement_semantics.blockStatement),
            function(consequent) {
                return compute.just({
                    'test' : mapSemantics(x.test),
                    'consequent': compute.dispatch(consequent)
                });
            });
    };
    
    var d = function(x) {
        return compute.bind(
            (def ?
                compute.bind(
                    compute.enumerationa(fun.map(mapSemantics, def.consequent)),
                    statement_semantics.blockStatement) :
                statement_semantics.emptyStatement),
            function(consequent){
                return compute.just({
                    'consequent': compute.dispatch(consequent)
                });
        });
    };
    
    return compute.binds(
        compute.enumeration(
            compute.enumerationa(fun.map(caseMap, pre)),
            d(def),
            compute.enumerationa(fun.map(caseMap, post))),
        function(pre, def, post) {
            return statement_semantics.switchStatement(
                mapSemantics(discriminant),
                pre,
                def,
                post);
        });
};

var tryStatement = function(block, handler, finalizer) {
    return compute.binds(
        compute.enumeration(
        mapSemantics(block),
        (handler ? mapSemantics(handler) : compute.empty),
        (finalizer ? mapSemantics(finalizer) : statement_semantics.emptyStatement)),
        function(body, h, finalizer) {
            return (handler ?
                statement_semantics.tryCatchFinallyStatement(body, handler.param.name, h, finalizer) :
                statement_semantics.tryFinallyStatement(body, finalizer));
        });
};

var whileStatement = function(test, body) {
    return compute.bind(
        mapSemantics(body),
        function(body) {
            return statement_semantics.whileStatement(
                mapSemantics(test),
                body);
        });
};

var doWhileStatement = function(body, test) {
    return compute.bind(
        mapSemantics(body),
        function(body) {
            return statement_semantics.doWhileStatement(
                body,
                mapSemantics(test));
        });
};

var forStatement = function(init, test, update, body) {
    return compute.bind(
        mapSemantics(body),
        function(body) {
            return statement_semantics.forStatement(
                mapSemantics(init),
                mapSemantics(test),
                mapSemantics(update),
                body);
        });
};

var forInStatement = function(left, right, body) {
    return compute.bind(
        mapSemantics(body),
        function(body) {
            if (left.type === 'VariableDeclaration')
                return statement_semantics.forVarInStatement(
                    left.declarations[0].id.name,
                    mapSemantics(right),
                    body);
            return statement_semantics.forInStatement(
                mapSemantics(left),
                mapSemantics(right),
                body);
        });
};

var thisExpression = expression_semantics.thisExpression;

var sequenceExpression = fun.compose(
    expression_semantics.sequenceExpression,
    fun.curry(fun.map, mapSemantics));

var unaryExpression = function(operator, argument) {
    var argument = mapSemantics(argument);
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

var updateExpression = function(operator, prefix, argument) {
    var a = mapSemantics(argument);
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

var binaryExpression = function(operator, left, right) {
    var l = mapSemantics(left), r = mapSemantics(right);
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

var logicalExpression = function(operator, left, right) {
    var l = mapSemantics(left), r = mapSemantics(right);
    switch (operator) {
    case '||':  return expression_semantics.logicalOr(l, r);
    case '&&':  return expression_semantics.logicalAnd(l, r)
    }
    throw "Unknown Logical Operator:" + operator;
};

var assignmentExpression = function(operator, left, right) {
    var l = mapSemantics(left), r = mapSemantics(right);
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

var conditionalExpression = function(test, consequent, alternate) {
    return expression_semantics.conditionalExpression(
        mapSemantics(test),
        mapSemantics(consequent),
        mapSemantics(alternate));
};

var newExpression = function(callee, args) {
    return expression_semantics.newExpression(
        mapSemantics(callee),
        fun.map(mapSemantics, args));
};

var callExpression = function(callee, args) {
    return expression_semantics.callExpression(
        mapSemantics(callee),
        fun.map(mapSemantics, args));
};

var memberExpression = function(computed, object, property) {
    return expression_semantics.memberExpression(
        mapSemantics(object),
        (computed ?
            mapSemantics(property) :
            value_semantics.stringLiteral(property.name)));
};

var arrayExpression = fun.compose(
    value_semantics.arrayLiteral,
    fun.curry(fun.map, mapSemantics));

var objectExpression = (function(){
    var getProperty = function(key, property, properties) {
        var value = mapSemantics(property.value);
        if (!properties.hasOwnProperty(key)) {
            properties[key] = {
                'enumerable': true,
                'configurable': true
            };
        }
        switch (property.kind) {
        case 'get':
            properties[key]['get'] = value; 
            break;
        case 'set':
            properties[key]['set'] = value;
            break;
        case 'init':
            properties[key]['writable'] = true;
            properties[key]['value'] = value;
            break;
        }
        return properties;
    };
    
    var getProperties = function(properties) {
        return fun.reduce(function(p, c) {
            var key = (c.key.name === undefined ? c.key.value : c.key.name);
            return getProperty(key, c, p);
        }, {}, properties);
    };
    
    return fun.compose(value_semantics.objectLiteral, getProperties);
}());

var functionExpression = function(id, params, body) {
    var id = (id === null ? null : id.name),
        p = fun.map(function(x) { return x.name; }, params),
        strict = isStrict(body.body);
    return compute.bind(
        sourceElements(body.body),
        function(body) {
            return function_semantics.fun(
                id,
                p,
                body,
                strict);
        });
};

var program = fun.compose(
    program_semantics.program,
    sourceElements);

var variableDeclaration = function(declarations) {
    return compute.bind(
        compute.bind(
            compute.enumerationa(fun.map(mapSemantics, declarations)),
            declaration_semantics.variableDeclaration),
        compute.createBlock);
};

var variableDeclarator = function(id, init) {
    return (init ?
        declaration_semantics.variableInitDeclarator(id.name, mapSemantics(init)) :
        compute.just(statement.empty));
};

var identifier = value_semantics.identifier;

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

/* Export
 ******************************************************************************/
return {
    'sourceElements': sourceElements,
    'program': program,
    'programBody': programBody,
    
    'mapSemantics': mapSemantics
};

});