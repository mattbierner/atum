define(['ecma_ast/clause',
        'ecma_ast/declaration',
        'ecma_ast/expression',
        'ecma_ast/statement',
        'ecma_ast/program',
        'ecma_ast/value'],
function(clause,
        declaration,
        expression,
        statement,
        program,
        value){
"use strict";
/* 
 ******************************************************************************/
var binary = function(op) {
    return function(l, r) {
        return new expression.BinaryExpression(null, op, l, r);
    };
};

var logical = function(op) {
    return function(l, r) {
        return new expression.LogicalExpression(null, op, l, r);
    };
};

var unary = function(op) {
    return function(x) {
        return new expression.UnaryExpression(null, op, x);
    };
};

var update = function(op, prefix) {
    return function(x) {
        return new expression.UpdateExpression(null, op, x, prefix);
    };
};

var literal = function(type) {
    return function(val) {
        return new value.Literal(null, type, val);
    };
};

var assign = function(op) {
    return function(l, r) {
        return new expression.AssignmentExpression(null, op, l, r);
    };
};

/*
 ******************************************************************************/
var Program = function(/*...*/) {
    return new program.Program(null, arguments);
};

var Number = literal('number');
var Boolean = literal('boolean');
var String = literal('string');
var Null = literal('null');

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

var With = function(obj, body) {
    return new statement.WithStatement(null, obj, body);
};

var While = function(test, body) {
    return new statement.WhileStatement(null, test, body);
};

var For = function(init, test, update, body) {
    return new statement.ForStatement(null, init, test, update, body);
};

var ForIn = function(lhs, rhs, body) {
    return new statement.ForInStatement(null, lhs, rhs, body);
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

var Sequence = function(/*...*/) {
    return new expression.SequenceExpression(null, arguments);
};

var Conditional = function(test, left, right) {
    return new expression.ConditionalExpression(null, test, left, right);
};

var This = function() {
    return new expression.ThisExpression(null);
};

var Plus = unary('+');
var Negate = unary('-');
var Typeof = unary('typeof');
var BitwiseNot = unary('~');
var LogicalNot = unary('!');

var Void = unary('void');
var Delete = unary('delete');

var Add = binary('+');
var Sub = binary('-');
var Mul = binary('*');
var Div = binary('/');
var Mod = binary('%');

var Lt = binary('<');
var Lte = binary('<=');
var Gt = binary('>');
var Gte = binary('>=');
var Equals = binary('==');
var StrictEquals = binary('===');

var In = binary('in');
var Instanceof = binary('instanceof');

var LogicalAnd = logical('&&');
var LogicalOr = logical('||');

var PreIncrement = update('++', true);
var PostIncrement = update('++', false);
var PreDecrement = update('--', true);
var PostDecrement = update('--', false);

var Assign = assign('=');
var AddAssign = assign('+=');
var SubAssign = assign('-=');
var MulAssign = assign('*=');
var DivAssign = assign('/=');
var ModAssign = assign('%=');

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

var Array = function(/*...*/) {
    return new expression.ArrayExpression(null, arguments);
};

return {
    'Program': Program,
    
    'Number': Number,
    'String': String,
    'Boolean': Boolean,
    'Null': Null,
    'Id': Id,
    
    'Block': Block,
    'Expression': Expression,
    'If': If,
    'With': With,
    'While': While,
    'For': For,
    'ForIn': ForIn,
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
    
    'Sequence': Sequence,
    'Conditional': Conditional,
    
    'This': This,
    
    'Plus': Plus,
    'Negate': Negate,
    'Typeof': Typeof,
    'BitwiseNot': BitwiseNot,
    'LogicalNot': LogicalNot,

    'Void': Void,
    'Delete': Delete,
    
    'Add': Add,
    'Sub': Sub,
    'Mul': Mul,
    'Div': Div,
    'Mod': Mod,
    'In': In,
    'Instanceof': Instanceof,
    'Lt': Lt,
    'Lte': Lte,
    'Gt': Gt,
    'Gte': Gte,
    'Equals': Equals,
    'StrictEquals': StrictEquals,
    'LogicalAnd': LogicalAnd,
    'LogicalOr': LogicalOr,
    'PreIncrement': PreIncrement,
    'PostIncrement': PostIncrement,
    'PreDecrement': PreDecrement,
    'PostDecrement': PostDecrement,

    'Assign': Assign,
    'AddAssign': AddAssign,
    'SubAssign': SubAssign,
    'MulAssign': MulAssign,
    'DivAssign': DivAssign,
    'ModAssign': ModAssign,
    
    'ComputedMember': ComputedMember,
    'Member': Member,
    'Call': Call,
    'New': New,
    'FunctionExpression': FunctionExpression,
    'Object': Object,
    'Array': Array
};
});