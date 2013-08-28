define(['$',
        'expect',
        'atum/interpret'],
function($,
        expect,
        interpret){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        d = $.Id('d');

    return {
        'module': "Object",
        'tests': [
            ["Simple Object Expression",
            function(){
                var f = function(extract) {
                    return  $.Program(
                        $.Expression($.Assign(a, 
                            $.Object({
                                 'kind': 'init',
                                 'key': $.String('ab'),
                                 'value': $.Number(1)
                             }))),
                        $.Expression(extract));
                };
                
                expect.type('number', 1)(
                    interpret.evaluate(f($.Member(a, $.Id('ab')))));
                
                expect.type('number', 1)(
                    interpret.evaluate(f($.ComputedMember(a, $.Add($.String('a'), $.String('b'))))));
            }],
            ["Non Member Object Expression",
            function(){
                var root = $.Program(
                    $.Var(
                        $.Declarator(a, $.Object())),
                    $.Expression(
                        $.Member(a, b)));
                
                expect.type('undefined', undefined)(
                    interpret.evaluate(root));
            }],
            ["Multiple Properties Member Object Literal",
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
                                 'key': $.String('c'),
                                 'value': $.Number(2)
                             }))),
                    $.Expression(
                        $.Add(
                            $.Member(a, b),
                            $.Member(a, c))));
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 3);
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
                
                var result = interpret.evaluate(root);
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
                
                var result = interpret.evaluate(root);
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
                
                var result = interpret.evaluate(root);
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
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 2);
            }],
            
            ["setter yields set value",
            function(){
                var root = $.Program(
                    $.Expression($.Assign(a, $.Object({
                        'kind': 'set',
                        'key': $.String('b'),
                        'value': $.FunctionExpression(null, [c],
                             $.Block(
                                $.Expression($.Assign($.Member($.This(), d), $.Number(23))),
                                $.Return($.Number(13))))
                    }))),
                    $.Expression($.Add(
                        $.Assign($.Member(a, b), $.Number(100)),
                        $.Member(a, d))));
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 123);
            }],
            
            ["Delete property",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Object({
                                     'kind': 'init',
                                     'key': $.String('b'),
                                     'value': $.Number(1)
                                 }))),
                         $.Expression(
                             $.Delete($.Member(a, b)))))
                     
                     .testResult()
                         .type('boolean', true)
                         
                     .test($.Expression($.Member(a, b)))
                         .type('undefined', undefined);
            }],
            ["Delete undefined property",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Object())),
                         $.Expression(
                             $.Delete($.Member(a, b)))))
                             
                      .testResult()
                         .type('boolean', true)
                     
                     .test($.Expression($.Member(a, b)))
                         .type('undefined', undefined);
            }],
        ]
    };
});
