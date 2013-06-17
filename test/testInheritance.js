define(['$',
        'atum/interpret'],
function($,
        interpret){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        w = $.Id('w'),
        x = $.Id('x'),
        y = $.Id('y'),
        z = $.Id('z');

    return {
        'module': "Inheritance",
        'tests': [
            ["Simple new constructor",
            function(){
                var root = $.Program(
                    $.FunctionDeclaration(a, [],
                        $.Block(
                           $.Expression($.Assign($.Member($.This(), x), $.Number(10))),
                           $.Return($.Number(1)))),
                    $.Expression($.Member($.New(a, []), x)));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            ["Simple new constructor return object",
            function(){
                var root = $.Program(
                    $.FunctionDeclaration(a, [],
                        $.Block(
                           $.Expression($.Assign($.Member($.This(), x), $.Number(10))),
                           $.Return($.Object({'key': $.String('z'), 'kind': 'init', 'value': $.Number(20)})))),
                    $.Expression($.Member($.New(a, []), $.Id('z'))));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 20);
            }],
            ["Simple new inherit",
            function(){
                var f = function(extract) {
                    return interpret.interpret($.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                               $.Expression($.Assign($.Member($.This(), x), $.Number(10))))),
                        $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), y), $.Number(20))),
                        $.FunctionDeclaration(b, [],
                            $.Block(
                               $.Expression($.Assign($.Member($.This(), z), $.Number(30))))),
                        $.Expression($.Assign($.Member(b, $.Id('prototype')), $.New(a, []))),
                        extract));
                };
                
                var xResult = f($.Expression($.Member($.New(b, []), x)));
                assert.equal(xResult.type, 'number');
                assert.equal(xResult.value, 10);
                
                var yResult = f($.Expression($.Member($.New(b, []), y)));
                assert.equal(yResult.type, 'number');
                assert.equal(yResult.value, 20);
                
                var zResult = f($.Expression($.Member($.New(b, []), z)));
                assert.equal(zResult.type, 'number');
                assert.equal(zResult.value, 30);
            }],
            
        ]
    };
});
