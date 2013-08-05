define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        Object = $.Id('Object'),
        defineProperty = $.Member(Object, $.Id('defineProperty')),
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
                    
                    .test($.Expression($.ComputedMember($.Call(keys, [a]), $.Number(0))))
                        .type('string', 'c');
            }],
        ]
    };
});
