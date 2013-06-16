define(['ecma/ast/clause',
        'ecma/ast/declaration',
        'ecma/ast/expression',
        'ecma/ast/statement',
        'ecma/ast/program',
        'ecma/ast/value'],
function(clause,
        declaration,
        expression,
        statement,
        program,
        value){
"use strict";

var Program = function(/*...*/) {
    return new program.Program(null, arguments);
};


var Number = function(val) {
    return new value.Literal(null, val, 'number');
};

var Boolean = function(val) {
    return new value.Literal(null, val, 'boolean');
};

var String = function(val) {
    return new value.Literal(null, val, 'string');
};

var Id = function(id) {
    return new value.Identifier(null, id);
};


var Block = function(/*...*/) {
    return new statement.BlockStatement(null, arguments);
};

var Expression = function(expr) {
    return new statement.ExpressionStatement(null, expr);
};

var If = function(test, consequent, alternate) {
    return new statement.IfStatement(null, test, consequent, alternate);
};

var While = function(test, body) {
    return new statement.WhileStatement(null, test, body);
};

var For = function(init, test, update, body) {
    return new statement.ForStatement(null, init, test, update, body);
};

var Try = function(body, handler, finalizer) {
    return new statement.TryStatement(null, body, handler, finalizer);
};

var Switch = function(dis /*, ...*/) {
    return new statement.SwitchStatement(null, dis, [].slice.call(arguments, 1));
};

var Break = function(target) {
    return new statement.BreakStatement(null, target);
};

var Continue = function(target) {
    return new statement.ContinueStatement(null, target);
};

var Return = function(value) {
    return new statement.ReturnStatement(null, value);
};

var Throw = function(value) {
    return new statement.ThrowStatement(null, value);
};


var Catch = function(param, body) {
    return new clause.CatchClause(null, param, body);
};

var Case = function(test /*, ...*/) {
    return new clause.SwitchCase(null, test, [].slice.call(arguments, 1));
};


var Var = function(/*...*/) {
    return new declaration.VariableDeclaration(null, arguments);
};

var Declarator = function(id, init) {
    return new declaration.VariableDeclarator(null, id, init);
};

var FunctionDeclaration = function(id, args, body) {
    return new declaration.FunctionDeclaration(null, id, args, body);
};

var This = function() {
    return new expression.ThisExpression(null);
};

var Plus = function(x) {
    return new expression.UnaryExpression(null, '+', x);
};

var Negate = function(x) {
    return new expression.UnaryExpression(null, '-', x);
};

var Add = function(l, r) {
    return new expression.BinaryExpression(null, '+', l, r);
};

var Sub = function(l, r) {
    return new expression.BinaryExpression(null, '-', l, r);
};

var Mul = function(l, r) {
    return new expression.BinaryExpression(null, '*', l, r);
};

var Div = function(l, r) {
    return new expression.BinaryExpression(null, '/', l, r);
};

var Mod = function(l, r) {
    return new expression.BinaryExpression(null, '%', l, r);
};

var Lt = function(l, r) {
    return new expression.BinaryExpression(null, '<', l, r);
};

var Lte = function(l, r) {
    return new expression.BinaryExpression(null, '<=', l, r);
};

var Gt = function(l, r) {
    return new expression.BinaryExpression(null, '>', l, r);
};

var Gte = function(l, r) {
    return new expression.BinaryExpression(null, '>=', l, r);
};


var PreIncrement = function(x) {
    return new expression.UpdateExpression(null, '++', x, true);
};

var PostIncrement = function(x) {
    return new expression.UpdateExpression(null, '++', x, false);
};

var PreDecrement = function(x) {
    return new expression.UpdateExpression(null, '--', x, true);
};

var PostDecrement = function(x) {
    return new expression.UpdateExpression(null, '--', x, false);
};

var Assign = function(l, r) {
    return new expression.AssignmentExpression(null, '=', l, r);
};

var AddAssign = function(l, r) {
    return new expression.AssignmentExpression(null, '+=', l, r);
};

var Member = function(l, r) {
    return new expression.MemberExpression(null, l, r, false);
};

var ComputedMember = function(l, r) {
    return new expression.MemberExpression(null, l, r, true);
};


var Call = function(l, args) {
    return new expression.CallExpression(null, l, args);
};

var New = function(l, args) {
    return new expression.NewExpression(null, l, args);
};

var FunctionExpression = function(id, params, body) {
    return new expression.FunctionExpression(null, id, params, body);
};

var Object = function(/*...*/) {
    return new expression.ObjectExpression(null, arguments);
};

return {
    'Program': Program,
    
    'Number': Number,
    'String': String,
    'Boolean': Boolean,
    'Id': Id,
    
    'Block': Block,
    'Expression': Expression,
    'If': If,
    'While': While,
    'For': For,
    'Try': Try,
    'Switch': Switch,
    'Break': Break,
    'Continue': Continue,
    'Return': Return,
     'Throw': Throw,

    'Catch': Catch,
    'Case': Case,
    
    'Var': Var,
    'Declarator': Declarator,
    'FunctionDeclaration': FunctionDeclaration,
    
    'This': This,
    'Plus': Plus,
    'Negate': Negate,
    'Add': Add,
    'Sub': Sub,
    'Mul': Mul,
    'Div': Div,
    'Mod': Mod,
    'Lt': Lt,
    'Lte': Lte,
    'Gt': Gt,
    'Gte': Gte,
    'PreIncrement': PreIncrement,
    'PostIncrement': PostIncrement,
    'PreDecrement': PreDecrement,
    'PostDecrement': PostDecrement,
    'Assign': Assign,
    'AddAssign': AddAssign,
    'ComputedMember': ComputedMember,
    'Member': Member,
    'Call': Call,
    'New': New,
    'FunctionExpression': FunctionExpression,
    'Object': Object
};
});