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


var Expression = function(expr) {
    return new statement.ExpressionStatement(null, expr);
};

var If = function(test, consequent, alternate) {
    return new statement.IfStatement(null, test, consequent, alternate);
};

var Switch = function(dis, cases) {
    return new statement.SwitchStatement(null, dis, cases);
};

var Case = function(test, consequent) {
    return new clause.SwitchCase(null, test, consequent);
};


var Var = function(/*...*/) {
    return new declaration.VariableDeclaration(null, arguments);
};

var Declarator = function(id, init) {
    return new declaration.VariableDeclarator(null, id, init);
};


var This = function() {
    return new expression.ThisExpression(null);
};

var Add = function(l, r) {
    return new expression.BinaryExpression(null, '+', l, r);
};

var Assign = function(l, r) {
    return new expression.AssignmentExpression(null, '=', l, r);
};

return {
    'Program': Program,
    
    'Number': Number,
    'String': String,
    'Boolean': Boolean,
    'Id': Id,
    
    'If': If,
    'Expression': Expression,

    'Switch': Switch,
    'Case': Case,
    
    'Var': Var,
    'Declarator': Declarator,
    
    'This': This,
    'Add': Add,
    'Assign': Assign
};
});