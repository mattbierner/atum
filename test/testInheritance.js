define(['$',
        'atum/interpret'],
function($,
        interpret){
    
    var a = $.Id('a');
    var b = $.Id('b');
    var c = $.Id('c');

    return {
        'module': "Object Tests",
        'tests': [
            ["Simple Object Expression",
            function(){
                var decl = $.Var(
                    $.Declarator(a,
                        $.Object({
                             'kind': 'init',
                             'key': $.String('b'),
                             'value': $.Number(1)
                         })));
                
                var nonComputedRoot = $.Program(
                    decl,
                    $.Expression(
                        $.Member(a, b)));
                
                var nonComputedresult = interpret.interpret(nonComputedRoot);
                assert.equal(nonComputedresult.type, 'number');
                assert.equal(nonComputedresult.value, 1);
                
                var computedRoot = $.Program(
                    decl,
                    $.Expression(
                        $.ComputedMember(a, $.String('b'))));
                
                var computedResult = interpret.interpret(computedRoot);
                assert.equal(computedResult.type, 'number');
                assert.equal(computedResult.value, 1);
            }],
            
        ]
    };
});
