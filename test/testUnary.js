define(['$',
        'ecma/ast/value',
        'ecma/ast/expression',
        'atum/interpret'],
function($,
        value,
        expression,
        interpret){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c');
    
    return {
        'module': "Unary Tests",
        'tests': [
        // void
            ["Void",
            function(){
                var root = $.Program(
                    $.Void($.Number(10)));
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
            ["Void Side Effects",
            function(){
                var root = $.Program(
                    $.Expression($.Sequence(
                        $.Assign(a, $.Number(0)),
                        $.Void($.PreIncrement(a)),
                        a)));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
        // Unary plus
            ["Unary Plus Number",
            function(){
                 ([10, -10, 1e6, -1e6, 1.5, -1.5])
                    .forEach(function(x) {
                        var root = new expression.UnaryExpression(null, '+', new value.Literal(null, x, "number"));
                        var result = interpret.interpret(root);
                        assert.equal(result.type, 'number');
                        assert.equal(result.value, x);
                    });
            }],
        // Unary Minus
           ["Unary Minus Number",
           function(){
                 ([10, -10, 1e6, -1e6, 1.5, -1.5])
                    .forEach(function(x) {
                        var root = new expression.UnaryExpression(null, '-', new value.Literal(null, x, "number"));
                        var result = interpret.interpret(root);
                        assert.equal(result.type, 'number');
                        assert.equal(result.value, -x);
                    });
            }],
        
        // Logical Not
            ["Logical Not Boolean",
             function(){
                 ([true, false])
                    .forEach(function(x) {
                        var root = new expression.UnaryExpression(null, '!', new value.Literal(null, x, "boolean"));
                        var result = interpret.interpret(root);
                        assert.equal(result.type, 'boolean');
                        assert.equal(result.value, !x);
                    });
            }],
        
        // Bitwise Not
            ["Bitwise Not",
             function(){
                ([new value.Literal(null, 1, "number"),
                   new value.Literal(null, 1.5, "number"),
                   new value.Literal(null, -1, "number"),
                   new value.Literal(null, "1", "string")])
                   .forEach(function(x) {
                        var root = new expression.UnaryExpression(null, '~', x);
                        var result = interpret.interpret(root);
                        assert.equal(result.type, 'number');
                        assert.equal(result.value, ~x.value);
                    });
            }],
            
        // Typeof 
            ["Typeof string",
             function(){
                var root = new expression.UnaryExpression(null, 'typeof', new value.Literal(null, "", "string"));
                var result = interpret.interpret(root);
                assert.equal(result.type, 'string');
                assert.equal(result.value, "string");
            }],
        ],
    };
});
