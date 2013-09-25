define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        x = $.Id('x'),
        y = $.Id('y'),
        z = $.Id('z'),
        Object = $.Id('Object'),
        create = $.Member(Object, $.Id('create')),
        prototype = $.Id('prototype'),
        defineProperty = $.Member(Object, $.Id('defineProperty')),
        hasOwnProperty = $.Id('hasOwnProperty'),
        length = $.Id('length');
        keys = $.Member(Object, $.Id('keys'));


    return {
        'module': "Builtin Object",
        'tests': [
        // Object.defineProperty
            ["Object.defineProperty value",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a,
                            $.Call(defineProperty, [
                                $.Object(),
                                $.String('b'),
                                $.Object({
                                    'kind': 'init',
                                    'key': $.String('value'),
                                    'value': $.Number(1)
                                })])))))
                    
                    .test($.Expression($.Member(a, b)))
                        .type('number', 1)
                    
                    .test($.Expression($.Member($.Call(keys, [a]), length)))
                        .type('number', 0);
            }],
            ["Object.defineProperty enumerable",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a,
                            $.Call(defineProperty, [
                                $.Object(),
                                $.String('b'),
                                $.Object({
                                    'kind': 'init',
                                    'key': $.String('value'),
                                    'value': $.Number(1)
                                }, {
                                    'kind': 'init',
                                    'key': $.String('enumerable'),
                                    'value': $.Boolean(true)
                                })])))))
                    
                    .test($.Expression($.Member(a, b)))
                        .type('number', 1)
                    
                    .test($.Expression($.Member($.Call(keys, [a]), length)))
                        .type('number', 1)
                        
                    .test($.Expression($.ComputedMember($.Call(keys, [a]), $.Number(0))))
                        .type('string', 'b');
            }],
            ["Object.defineProperty getter",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a,
                            $.Call(defineProperty, [
                                $.Object({
                                    'kind': 'init',
                                    'key': $.String('c'),
                                    'value': $.Number(432)
                                }),
                                $.String('b'),
                                $.Object({
                                    'kind': 'init',
                                    'key': $.String('get'),
                                    'value': $.FunctionExpression(null, [], $.Block($.Return($.Member($.This(), c))))
                                })])))))
                    
                    .test($.Expression($.Member(a, b)))
                        .type('number', 432)
                        
                    .test($.Expression($.Member($.Call(keys, [a]), length)))
                        .type('number', 1)
                    
                    .test($.Expression($.ComputedMember($.Call(keys, [a]), $.Number(0))))
                        .type('string', 'c');
            }],
            ["Object.defineProperty setter",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a,
                            $.Call(defineProperty, [
                                $.Object({
                                    'kind': 'init',
                                    'key': $.String('c'),
                                    'value': $.Number(5)
                                }),
                                $.String('b'),
                                $.Object({
                                    'kind': 'init',
                                    'key': $.String('set'),
                                    'value': $.FunctionExpression(null, [b],
                                        $.Block(
                                            $.Expression($.AddAssign($.Member($.This(), c), b)),
                                            $.Return(b)))
                                })])))))
                    
                    .test($.Expression($.Member(a, b)))
                        .type('undefined')
                    
                    .test($.Expression($.Assign($.Member(a, b), $.Number(100))))
                        .type('number', 100)
                        
                    .test(
                        $.Expression(
                            $.Sequence(
                                $.Assign($.Member(a, b), $.Number(100)),
                                $.Member(a, c))))
                        .type('number', 105)
                    
                    .test($.Expression($.ComputedMember($.Call(keys, [a]), $.Number(0))))
                        .type('string', 'c');
            }],
        // Object.create
            ["Object.create simple",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a,
                            $.Call(create, [
                                $.Object(),
                                $.Object({
                                    'kind': 'init',
                                    'key': $.String('b'),
                                    'value': $.Object({
                                        'kind': 'init',
                                        'key': $.String('value'),
                                        'value': $.Number(1)
                                    })
                                })])))))
                    
                    .test($.Expression($.Member(a, b)))
                        .type('number', 1);
            }],
            ["Object.create inherited",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a,
                            $.Call(create, [
                                $.Object({
                                    'kind': 'init',
                                    'key': $.String('b'),
                                    'value': $.Number(1)
                                },
                                {
                                    'kind': 'init',
                                    'key': $.String('c'),
                                    'value': $.Number(5)
                                }),
                                $.Object({
                                    'kind': 'init',
                                    'key': $.String('b'),
                                    'value':$.Object({
                                        'kind': 'init',
                                        'key': $.String('value'),
                                        'value': $.Number(3)
                                    })
                                })])))))
                    
                    .test($.Expression($.Member(a, b)))
                        .type('number', 3)
                        
                    .test($.Expression($.Member(a, c)))
                        .type('number', 5);
            }],
             ["Object.create null does not inherit Object.prototype",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a,
                            $.Call(create, [
                                $.Null(),
                                $.Object({
                                    'kind': 'init',
                                    'key': $.String('b'),
                                    'value': $.Object({
                                        'kind': 'init',
                                        'key': $.String('value'),
                                        'value': $.Number(1)
                                    })
                                })])))))
                    
                    .test($.Expression($.Member(a, b)))
                        .type('number', 1)
                        
                    .test($.Expression($.In($.String('hasOwnProperty'), a)))
                        .type('boolean', false);
            }],
        // Object.prototype.hasOwnProperty
            ["Object.prototype.hasOwnProperty",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a,
                            $.Object({
                                'kind': 'init',
                                'key': $.String('b'),
                                'value': $.Number(1)
                            })))))
                    
                    .test($.Expression($.Call($.Member(a, hasOwnProperty), [$.String('x')])))
                        .type('boolean', false)
                    
                    .test($.Expression($.Call($.Member(a, hasOwnProperty), [$.String('b')])))
                        .type('boolean', true);
            }],
            ["Object.prototype.hasOwnProperty enumerable",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a,
                            $.Call(defineProperty, [
                                $.Object(),
                                $.String('b'),
                                $.Object({
                                    'kind': 'init',
                                    'key': $.String('value'),
                                    'value': $.Number(1)
                                }, {
                                    'kind': 'init',
                                    'key': $.String('enumerable'),
                                    'value': $.Boolean(false)
                                })])))))
                    
                    .test($.Expression($.Call($.Member(a, hasOwnProperty), [$.String('b')])))
                        .type('boolean', true);
            }],
            ["Object.prototype.hasOwnProperty inheritance",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [], $.Block()),
                        $.Expression($.Assign($.Member($.Member(a, prototype), x), $.Number(1))),
                        $.Expression($.Assign($.Member($.Member(a, prototype), y), $.Number(5))),
                        
                        $.Expression($.Assign(b, $.New(a, []))),
                        $.Expression($.Assign($.Member(b, x), $.Number(14))),
                        $.Expression($.Assign($.Member(b, z), $.Number(5)))))
                       
                    .test($.Expression($.Call($.Member(b, hasOwnProperty), [$.String('x')])))
                        .type('boolean', true)
                        
                    .test($.Expression($.Call($.Member(b, hasOwnProperty), [$.String('y')])))
                        .type('boolean', false)
                        
                    .test($.Expression($.Call($.Member(b, hasOwnProperty), [$.String('z')])))
                        .type('boolean', true);
            }],
        ]
    };
});
