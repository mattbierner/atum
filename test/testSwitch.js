define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a');
    
    return {
        'module': "Switch",
        'tests': [
            ["Empty Switch",
            function(){
                expect.run(
                    $.Program(
                        $.Switch($.Number(0))))
                        
                    .testResult()
                        .type('undefined', undefined);
            }],
            ["Not Covered Case Switch",
            function(){
                expect.run(
                    $.Program(
                        $.Switch($.Number(0),
                            $.Case($.Number(5),
                                $.Expression($.Number(100)),
                                $.Break()))))
                            
                    .testResult()
                        .type('undefined', undefined);
            }],
            ["Covered Case",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                            $.Assign(a, $.Number(5))),
                        $.Switch(a,
                            $.Case($.Number(1),
                                $.Expression(
                                    $.Assign(a, $.Number(0))),
                                $.Break()),
                                
                            $.Case($.Number(5),
                                $.Expression(
                                    $.Assign(a, $.Number(1))),
                                $.Break()),
                                
                            $.Case($.Number(10),
                                $.Expression(
                                    $.Assign(a, $.Number(2))),
                                $.Break()))))
                            
                    .test($.Expression(a))
                        .type('number', 1);
            }],
            ["Multiple Covered Cases",
            function(){
                expect.run(
                    $.Program(
                        $.Switch($.Number(0),
                            $.Case($.Boolean(false),
                                $.Expression(
                                    $.Number(0)),
                                $.Break()),
                            $.Case($.Number(0),
                                $.Expression(
                                    $.Number(1)),
                                $.Break()),
                            $.Case($.String(""),
                                $.Expression(
                                    $.Number(2)),
                                $.Break()),
                            $.Case(null,
                                $.Expression(
                                    $.Number(2)),
                                $.Break()))))
                                
                    .testResult()
                        .type('number', 1);
            }],
            ["Break Return Last Value",
            function(){
                expect.run(
                    $.Program(
                        $.Switch($.Number(5),
                            $.Case($.Number(1),
                                $.Expression($.Number(0)),
                                $.Break()),
                            $.Case($.Number(5),
                                 $.Expression($.Number(1)),
                                $.Break()),
                            $.Case($.Number(10),
                                 $.Expression($.Number(2)),
                                 $.Break()))))
                                 
                     .testResult()
                         .type('number', 1);
            }],
            ["Covered Case Fall",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                            $.Assign(a, $.Number(5))),
                        $.Switch(a,
                            $.Case($.Number(1),
                                $.Expression(
                                    $.Assign(a, $.Number(0)))),
                            $.Case($.Number(5),
                                $.Expression(
                                    $.AddAssign(a, $.Number(1)))),
                            $.Case($.Number(10),
                                $.Expression(
                                    $.AddAssign(a, $.Number(2)))))))
                                    
                    .test($.Expression(a))
                        .type('number', 8);
            }],
            ["Default Case",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                            $.Assign(a, $.Number(5))),
                        $.Switch(a,
                            $.Case($.Number(1),
                                $.Expression(
                                    $.Assign(a, $.Number(0))),
                                $.Break()),
                            $.Case(null,
                                $.Expression(
                                    $.Assign(a, $.Number(1))),
                                $.Break()),
                            $.Case($.Number(10),
                                $.Expression(
                                    $.Assign(a, $.Number(2))),
                                    $.Break()))))
                                    
                    .test($.Expression(a))
                        .type('number', 1);
            }],
            ["Default Case Fall",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                            $.Assign(a, $.Number(5))),
                        $.Switch(a,
                            $.Case($.Number(1),
                                $.Expression(
                                    $.Assign(a, $.Number(0))),
                                $.Break()),
                            $.Case(null,
                                $.Expression(
                                    $.AddAssign(a, $.Number(1)))),
                            $.Case($.Number(10),
                                $.Expression(
                                    $.AddAssign(a, $.Number(2)))))))
                                    
                    .test($.Expression(a))
                        .type('number', 8);
            }],
        ],
    };
});
