define(['$',
        'expect',
        'atum/interpret'],
function($,
        expect,
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
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            ["Simple new constructor, this overrides prototype",
            function(){
                var root = $.Program(
                    $.FunctionDeclaration(a, [],
                        $.Block(
                           $.Expression($.AddAssign($.Member($.This(), x), $.Number(10))),
                           $.Return($.Number(1)))),
                    $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), x), $.Number(20))),
                    $.Expression($.Member($.New(a, []), x)));
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 30);
            }],
            ["Simple new constructor return object",
            function(){
                var root = $.Program(
                    $.FunctionDeclaration(a, [],
                        $.Block(
                           $.Expression($.Assign($.Member($.This(), x), $.Number(10))),
                           $.Return($.Object({'key': $.String('z'), 'kind': 'init', 'value': $.Number(20)})))),
                    $.Expression($.Member($.New(a, []), $.Id('z'))));
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 20);
            }],
            ["Simple new inherit",
            function(){
                var f = function(extract) {
                    return interpret.evaluate($.Program(
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
            ["Simple new inherit, override from this",
            function(){
                var f = function(extract) {
                    return interpret.evaluate($.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                               $.Expression($.Assign($.Member($.This(), x), $.Number(10))))),
                        $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), y), $.Number(20))),
                        $.FunctionDeclaration(b, [],
                            $.Block(
                               $.Expression($.Assign($.Member($.This(), x), $.Number(30))))),
                        $.Expression($.Assign($.Member(b, $.Id('prototype')), $.New(a, []))),
                        extract));
                };
                
                var xResult = f($.Expression($.Member($.New(b, []), x)));
                assert.equal(xResult.type, 'number');
                assert.equal(xResult.value, 30);
            }],
            ["Changing dervided prototype does not effect base",
            function(){
                var f = function(extract) {
                    return interpret.evaluate($.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block()),
                        $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), x), $.Number(10))),
                        $.FunctionDeclaration(b, [],
                            $.Block()),
                        $.Expression($.Assign($.Member(b, $.Id('prototype')), $.New(a, []))),
                        $.Expression($.Assign($.Member($.Member(b, $.Id('prototype')), x), $.Number(20))),
                        extract));
                };
                
                var xResult = f($.Expression($.Add($.Member($.New(b, []), x), $.Member($.New(a, []), x))));
                assert.equal(xResult.type, 'number');
                assert.equal(xResult.value, 30);
            }],
            ["Changing base prototype after does effect base",
            function(){
                var f = function(extract) {
                    return interpret.evaluate($.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block()),
                        $.FunctionDeclaration(b, [],
                            $.Block()),
                        $.Expression($.Assign($.Member(b, $.Id('prototype')), $.New(a, []))),
                        $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), x), $.Number(20))),
                        extract));
                };
                
                expect.type('number', 40)(
                    f($.Expression($.Add($.Member($.New(b, []), x), $.Member($.New(a, []), x)))));
            }],
            ["Changing prototype after creation effects instance",
            function(){
                var root = $.Program(
                    $.FunctionDeclaration(a, [],
                        $.Block()),
                    $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), x), $.Number(10))),
                    $.Expression($.Assign(b, $.New(a, []))),
                    $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), x), $.Number(20))),
                    $.Expression($.Member(b, x)));
                
                expect.type('number', 20)(
                    interpret.evaluate(root));
            }],
            ["Changing prototype after creation on mutated object does not effect",
            function(){
                var root = $.Program(
                    $.FunctionDeclaration(a, [],
                        $.Block()),
                    $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), x), $.Number(10))),
                    $.Expression($.Assign(b, $.New(a, []))),
                    $.Expression($.Assign($.Member(b, x), $.Number(300))),
                    $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), x), $.Number(20))),
                    $.Expression($.Member(b, x)));
                
                expect.type('number', 300)(
                    interpret.evaluate(root));
            }],
        ]
    };
});
