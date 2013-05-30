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

var Add = function(l, r) {
    return new expression.BinaryExpression(null, '+', l, r);
};

var PreIncrement = function(x) {
    return new expression.UpdateExpression(null, '++', x, true);
};

var PostIncrement = function(x) {
    return new expression.UpdateExpression(null, '++', x, false);
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

var Call = function(l, args) {
    return new expression.CallExpression(null, l, args);
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
    'Break': Break,
    'Continue': Continue,
    'Return': Return,
    
    'Switch': Switch,
    'Case': Case,
    
    'Var': Var,
    'Declarator': Declarator,
    'FunctionDeclaration': FunctionDeclaration,
    
    'This': This,
    'Add': Add,
    'PreIncrement': PreIncrement,
    'PostIncrement': PostIncrement,
    'Assign': Assign,
    'AddAssign': AddAssign,
    'Member': Member,
    'Call': Call,
    'FunctionExpression': FunctionExpression,
    'Object': Object
};
});