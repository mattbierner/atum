define(['$',
        'expect'],
function($,
        expect){
    
    var compareValue = function(a, b) {
        return expect.run(
            $.Program(
                $.Expression($.Equals(a, b))));
    };
    
    var compareValues = function(input) {
        input.forEach(function(x) {
            compareValue(x[0], x[1])
                .testResult()
                    .type('boolean', x[2]);
            
            compareValue(x[1], x[0])
                .testResult()
                    .type('boolean', x[2]);
        });
    };
    
    return {
        'module': "Compare",
        'tests': [
            ["==, Number and Number",
            function(){
                compareValues([[$.Number(5), $.Number(5), true],
                  [$.Number(0), $.Number(0), true],
                  [$.Number(1.24), $.Number(1.24), true],
                  [$.Number(1.24e4), $.Number(1.24e4), true],
                  [$.Number(5.000), $.Number(5), true],
                  [$.Number(NaN), $.Number(3), false],
                  [$.Number(NaN), $.Number(0), false],
                  [$.Number(NaN), $.Number(NaN), false],
                  [$.Number(NaN), $.Number(Infinity), false],
                  [$.Number(Infinity), $.Number(Infinity), true],
                  [$.Number(-Infinity), $.Number(Infinity), false],
                  [$.Number(-Infinity), $.Number(-Infinity), true]]);
            }],
            ["==, Number and String",
            function(){
                compareValues([
                  [$.Number(5), $.String("5"), true],
                  [$.Number(5), $.String("    5"), true],
                  [$.Number(5), $.String("4"), false],
                  [$.Number(5), $.String("a"), false],
                  [$.Number(5), $.String("5a"), false],
                  [$.Number(5), $.String("a5"), false],
                  [$.Number(5.54), $.String(" 5.54"), true],
                  [$.Number(-5.54), $.String("  -5.54"), true],
                  [$.Number(-5.54), $.String("  -  5.54"), false],
                  [$.Number(5.54e13), $.String("  5.54e13"), true],
                  [$.Number(0), $.String(""), true],
                  [$.Number(0), $.String("3"), false],
                  [$.Number(0), $.String("0"), true],
                  [$.Number(0), $.String("a"), false],
                  [$.Number(0), $.String(""), true],
                  [$.Number(0), $.String("    "), true],
                  [$.Number(0), $.String("    a"), false],
                  [$.Number(Infinity), $.String("Infinity"), true],
                  [$.Number(-Infinity), $.String(" -Infinity"), true],
                  [$.Number(NaN), $.String(""), false],
                  [$.Number(NaN), $.String("a"), false],]);
            }],
            ["==, Number and boolean",
            function(){
                compareValues([
                  [$.Number(5), $.Boolean(true), false],
                  [$.Number(5), $.Boolean(false), false],
                  [$.Number(-5), $.Boolean(false), false],
                  [$.Number(0), $.Boolean(false), true],
                  [$.Number(NaN), $.Boolean(false), false],
                  [$.Number(NaN), $.Boolean(true), false],]);
            }],
            ["==, Number and null",
            function(){
                compareValues([
                  [$.Number(5), $.Null(), false],
                  [$.Number(0), $.Null(), false],
                  [$.Number(-5), $.Null(), false],
                  [$.Number(NaN), $.Null(), false],]);
            }],
            ["==, Number and undefined",
            function(){
                compareValues([
                  [$.Number(5), $.Id('undefined'), false],
                  [$.Number(0), $.Id('undefined'), false],
                  [$.Number(-5), $.Id('undefined'), false],
                  [$.Number(NaN), $.Id('undefined'), false],]);
            }],
            ["==, Number and Object",
            function(){
                compareValues([
                  [$.Number(5), $.Object(), false],
                  [$.Number(0), $.Object(), false],
                  [$.Number(-5), $.Object(), false],
                  [$.Number(NaN), $.Object(), false],]);
            }],
            
            ["==, String and String",
            function(){
                compareValues([
                  [$.String('abc'), $.String('abc'), true],
                  [$.String('abc'), $.String('ab'), false],
                  [$.String('abc'), $.String('abc  '), false],
                  [$.String(''), $.String(''), true],]);
            }],
            ["==, String and Boolean",
            function(){
                compareValues([
                  [$.String('abc'), $.Boolean(true), false],
                  [$.String('abc'), $.Boolean(false), false],
                  [$.String(''), $.Boolean(true), false],
                  [$.String(''), $.Boolean(false), true],]);
            }],
            ["==, String and Null",
            function(){
                compareValues([
                  [$.String('abc'), $.Null(), false],
                  [$.String(''), $.Null(), false],]);
            }],
            ["==, String and Undef",
            function(){
                compareValues([
                  [$.String('abc'), $.Id('undefined'), false],
                  [$.String(''), $.Id('undefined'), false],]);
            }],
            ["==, String and Object",
            function(){
                compareValues([
                  [$.String('abc'), $.Object(), false],
                  [$.String(''), $.Object(), false],]);
            }],
            
            ["==, Boolean and Boolean",
            function(){
                compareValues([
                  [$.Boolean(true), $.Boolean(true), true],
                  [$.Boolean(true), $.Boolean(false), false],
                  [$.Boolean(false), $.Boolean(false), true],]);
            }],
            ["==, Boolean and Null",
            function(){
                compareValues([
                  [$.Boolean(true), $.Null(), false],
                  [$.Boolean(false), $.Null(), false],]);
            }],
            ["==, Boolean and Undefined",
            function(){
                compareValues([
                  [$.Boolean(true), $.Id('undefined'), false],
                  [$.Boolean(false), $.Id('undefined'), false],]);
            }],
            ["==, Boolean and Object",
            function(){
                compareValues([
                  [$.Boolean(true), $.Object(), false],
                  [$.Boolean(false), $.Object(), false],]);
            }],
            
            ["==, Null and Null",
            function(){
                compareValues([
                  [$.Null(), $.Null(), true],]);
            }],
            ["==, Null and Undefined",
            function(){
                compareValues([
                  [$.Null(), $.Id('undefined'), true],]);
            }],
            ["==, Null and Object",
            function(){
                compareValues([
                  [$.Null(), $.Object(), false],]);
            }],
            
            ["==, Undefined and Undefined",
            function(){
                compareValues([
                  [$.Id('undefined'), $.Id('undefined'), true],]);
            }],
            ["==, Undefined and Object",
            function(){
                compareValues([
                  [$.Id('undefined'), $.Object(), false],]);
            }],
            
            ["==, Object and Object",
            function(){
                compareValues([
                  [$.Object(), $.Object(), false],
                  [$.Object(
                      $.ObjectValue($.String('x'), $.Number(4))),
                  $.Object(
                      $.ObjectValue($.String('x'), $.Number(4))),
                  false],]);
                
                expect.run(
                    $.Program(
                        $.Expression($.Assign($.Id('a'), $.Object())),
                        $.Expression($.Assign($.Id('b'), $.Id('a'))),
                        $.Expression($.Equals($.Id('a'), $.Id('b')))))
                    .testResult()
                        .type('boolean', true);
            }],
        ],
    };
});
