define(['ecma/ast/program',
        'ecma/ast/value',
        'ecma/ast/expression',
        'ecma/ast/statement',
        'ecma/ast/clause',
        '$',
        'atum/interpret'],
function(program,
        value,
        expression,
        statement,
        clause,
        $,
        interpret){
    
    var a = new value.Identifier(null, 'a');
    var withCases = function(init, cases) {
         return $.Program(
            $.Expression(
                new expression.AssignmentExpression(null, '=',
                    a,
                    init)),
            $.Switch(new value.Literal(null, 1, "number"), cases),
            new statement.ExpressionStatement(null,  a));
    };
    

    
    return {
        'module': "Switch",
        'tests': [
            ["Empty Switch",
            function(){
                var root = $.Program(
                    $.Expression(
                        $.Assign($.Id('a'), $.Number(5))),
                    $.Switch($.Id('a'), []),
                    $.Expression($.Id('a')));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 5);
            }],
            ["Covered Cases",
            function(){
                var root = withCases(new value.Literal(null, 1, 'number'), [
                    $.Case(new value.Literal(null, 2, 'number'), [
                        new statement.ExpressionStatement(null,
                            new expression.AssignmentExpression(null, '=',
                                a,
                                new value.Literal(null, 10, 'number'))),
                        new statement.BreakStatement(null)]),
                    $.Case(new value.Literal(null, 1, 'number'), [
                        new statement.ExpressionStatement(null,
                            new expression.AssignmentExpression(null, '=',
                                a,
                                new value.Literal(null, 5, 'number'))),
                        new statement.BreakStatement(null)])]);
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 5);
            }],
        ],
    };
});
