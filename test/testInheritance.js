define(['$',
        'atum/interpret'],
function($,
        interpret){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c');

    return {
        'module': "Object Tests",
        'tests': [
            ["Simple new constructor",
            function(){
                var root = $.Program(
                    $.FunctionDeclaration(a, [],
                        $.Block(
                           $.Expression($.Assign($.Member($.This(), b), $.Number(10))),
                           $.Return($.Number(1)))),
                    $.Expression($.Member($.New(a, []), b)));
                
                var nonComputedresult = interpret.interpret(root);
                assert.equal(nonComputedresult.type, 'number');
                assert.equal(nonComputedresult.value, 10);
            }],
            
        ]
    };
});
