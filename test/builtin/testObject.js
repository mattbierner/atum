define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        Object = $.Id('Object'),
        defineProperty = $.Member(Object, $.Id('defineProperty'));

    return {
        'module': "Builtin Object",
        'tests': [
        // Object.defineProperty
            ["Object.defineProperty set value",
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
                        .type('number', 1);
            }],
        ]
    };
});
