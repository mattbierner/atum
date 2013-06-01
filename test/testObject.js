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
            ["Non Member Object Expression",
            function(){
                var root = $.Program(
                    $.Var(
                        $.Declarator(a, $.Object())),
                    $.Expression(
                        $.Member(a, b)));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
            ["Multiple Duplicate Property Member Object Expression",
            function(){
                var root = $.Program(
                    $.Var(
                        $.Declarator(a,
                            $.Object({
                                 'kind': 'init',
                                 'key': $.String('b'),
                                 'value': $.Number(1)
                             }, {
                                 'kind': 'init',
                                 'key': $.String('b'),
                                 'value': $.Number(2)
                             }))),
                    $.Expression(
                        $.Member(a, b)));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 2);
            }],
            ["Getter Property Member Object Expression",
            function(){
                var root = $.Program(
                    $.Var(
                        $.Declarator(a,
                            $.Object({
                                 'kind': 'get',
                                 'key': $.String('b'),
                                 'value': $.FunctionExpression(null, [],
                                     $.Block(
                                        $.Return($.Number(1))))
                             }))),
                    $.Expression(
                        $.Member(a, b)));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Getter This Property Member Object Expression",
            function(){
                var root = $.Program(
                    $.Var(
                        $.Declarator(a,
                            $.Object({
                                 'kind': 'init',
                                 'key': $.String('c'),
                                 'value': $.Number(1)
                             }, {
                                 'kind': 'get',
                                 'key': $.String('b'),
                                 'value': $.FunctionExpression(null, [],
                                     $.Block(
                                        $.Return(
                                            $.Member($.This(), c))))
                             }))),
                    $.Expression(
                        $.Member(a, b)));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            
            ["Objects passed by reference",
            function(){
                var root = $.Program(
                    $.Var(
                        $.Declarator(a,
                            $.Object({
                                 'kind': 'init',
                                 'key': $.String('c'),
                                 'value': $.Number(1)
                             })),
                             $.Declarator(b, a)),
                     $.Expression(
                         $.Assign(
                             $.Member(a, c),
                             $.Number(2))),
                    $.Expression(
                        $.Member(b, c)));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 2);
            }],
        ]
    };
});
