/**
 * 
 */

requirejs.config({
    paths: {
        'atum': 'lib',
        'amulet': 'dependencies/amulet/lib',
        'parse': 'dependencies/parse/lib',
        'nu': 'dependencies/nu/lib',
        'ecma': 'dependencies/parse-ecma/lib',
    }
});

var get = function(p, c) {
    return p[c];
};

var format = function(str, obj) {
    return str.replace(/@([a-z][a-z0-9\.]*)|@/gi, function(path) {
        if (path === '@')
            return obj;
        return [].reduce.call(path, get, obj);
    });
};

var printFrame = function(d, lex) {
    var d = $('<ul></ul>');
    Object.keys(lex.record).forEach(function(x) {
        d.append('<li>' + x + '</li>');
    });
    return d;
};

var printState = function(d, ctx) {
    var template = $('<li></li>');
    $('.frames').empty();
    var lex = d.getValue(ctx.userData.lexicalEnvironment);
    while (lex) {
        $('.frames').append($('<li></li>').append(printFrame(d, lex)));
        lex = d.getValue(lex.outer);
    }
};

$(function () {
    var mirror = CodeMirror(document.getElementById('input'), {
        'mode':  'javascript',
        'lineNumbers': true
    });
    
    $('#container').layout();
    
    require([
        'parse/parse',
        'nu/stream',
        'atum/interpret',
        'atum/compute',
        'atum/debug/debugger',
        'atum/debug/operations',
        'ecma/lex/lexer', 'ecma/parse/parser'],
    function(parse,
            stream,
            interpret,
            compute,
            atum_debugger,
            debug,
            lexer, parser) {
            
        $('button#eval-button').click(function () {
            var input = mirror.doc.getValue();
            $('.ParseError').text('');
            $('#text_out').text('');
            
            try {
                var lex = lexer.lexRegExp(input);
                var ast = parser.parseStream(lex);
                var out = interpret.interpret(ast);
                $('#text_out').text(out);
            } catch (e) {
                $('.ParseError').text(e);
            }
        });
        
        $('button#debug-button').click(function () {
            var input = mirror.doc.getValue();
            $('.ParseError').text('');
            $('#text_out').text('');
            
            try {
                var lex = lexer.lexRegExp(input);
                var ast = parser.parseStream(lex);
                var p = interpret.evaluateProgram(ast);
                var done = false;
                var ctx = new compute.ComputeContext({}, null);
                var z = new atum_debugger.Debugger(p(ctx,
                    function(x, ctx){ done = true; return function() { $('#text_out').text(x); }; },
                    function(x, ctx){ done = true; return function() { $('.ParseError').text(x);} }));
                 if (!done) {
                    printState(z, z.k.ctx);
                }
                while (!done) {
                    z = z.step();
                    if (!done) {
                        printState(z, z.k.ctx);
                       
                    }
                }
                
                z.k();
            } catch (e) {
                $('.ParseError').text(e);
            }
        });
    });
});