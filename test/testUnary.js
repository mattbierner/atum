define(['$',
        'atum/interpret'],
function($,
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
                var result = interpret.evaluate(root);
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
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
        // Unary plus
            ["Unary Plus Number",
            function(){
                 ([10, -10, 1e6, -1e6, 1.5, -1.5])
                    .forEach(function(x) {
                        var root = $.Plus($.Number(x));
                        var result = interpret.evaluate(root);
                        assert.equal(result.type, 'number');
                        assert.equal(result.value, x);
                    });
            }],
        // Unary Minus
           ["Unary Minus Number",
           function(){
                 ([10, -10, 1e6, -1e6, 1.5, -1.5])
                    .forEach(function(x) {
                        var root = $.Negate($.Number(x));
                        var result = interpret.evaluate(root);
                        assert.equal(result.type, 'number');
                        assert.equal(result.value, -x);
                    });
            }],
        
        // Logical Not
            ["Logical Not Boolean",
             function(){
                 ([true, false])
                    .forEach(function(x) {
                        var root = $.LogicalNot($.Boolean(x));
                        var result = interpret.evaluate(root);
                        assert.equal(result.type, 'boolean');
                        assert.equal(result.value, !x);
                    });
            }],
        
        // Bitwise Not
            ["Bitwise Not",
             function(){
                ([$.Number(1),
                  $.Number(1.5),
                  $.Number(-1),
                  $.String("1")])
                   .forEach(function(x) {
                        var root = $.BitwiseNot(x);
                        var result = interpret.evaluate(root);
                        assert.equal(result.type, 'number');
                        assert.equal(result.value, ~x.value);
                    });
            }],
            
        // Typeof 
            ["Typeof string",
             function(){
                var root = $.Typeof($.String(""));
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'string');
                assert.equal(result.value, "string");
            }],
        ],
    };
});
