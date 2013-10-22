/**
 */
require(['knockout-2.2.1',
        'parse/parse',
        'nu/stream',
        'atum/interpret',
        'atum/compute',
        'atum/compute/context',
        'atum/builtin/impl/global',
        'atum/semantics/semantics',
        'atum/debug/debugger',
        'ecma/lex/lexer',
        'ecma/parse/parser'],
function(ko,
        parse,
        stream,
        interpret,
        compute,
        context,
        global,
        semantics,
        atum_debugger,
        lexer,
        parser) {

var reduce = Function.prototype.call.bind(Array.prototype.reduce);

var get = function(p, c) {
    return p[c];
};

/* 
 ******************************************************************************/
var printBindings = function(d, record) {
    if (record.ref) {
        var obj = d.getValue(record, function(x, ctx) { return x; }, function(x, ctx) { return x; });
        record = obj.properties;
    }
    return Object.keys(record).reduce(function(p, c) {
        p.push({'name': c, 'value': record[c] });
        return p;
    }, []);
};


var printFrame = function(d, lex) {
    return {
        'bindings': printBindings(d, lex.record)
    };
};

var printEnvironments = function(d, ctx) {
    var environments = [];
    if (ctx.userData) {
        var environment = d.getValue(ctx.userData.lexicalEnvironment, function(x, ctx) { return x; }, function(x, ctx) { return x; });
        do {
            environments.push(printFrame(d, environment));
            environment = d.getValue(environment.outer, function(x, ctx) { return x; }, function(x, ctx) { return x; });
        } while (environment);
    };
    return environments;
};


/* 
 ******************************************************************************/
var out = {
    'write': function(x, ctx) {
        model.push(x, ctx, false);
    }
};

var errorOut = {
    'write': function(x, ctx) {
        model.push(x, ctx, true);
    }
};

var run = function (input, ok, err) {
    try {
        var ast = parser.parse(input);
    } catch(e) {
        return err(e, null)();
    }
    return interpret.complete(
        semantics.programBody(semantics.sourceElements(ast.body)),
        globalCtx,
        ok,
        err);
};

var runContext = function(input, ctx, ok, err) {
    try {
        var ast = parser.parse(input);
        return interpret.complete(
            semantics.programBody(semantics.sourceElements(ast.body)),
            ctx,
            ok,
            err);
    } catch (e) {
        return err(e, null);
    }
};


/* Code Mirror
 ******************************************************************************/
var doc = CodeMirror(document.getElementById('input'), {
    'mode': 'javascript',
    'lineNumbers': true
}).doc;

var interactive = CodeMirror(document.getElementById('output-interactive-textarea'), {
    'mode': 'javascript',
    'lineNumbers': false,
});
interactive.setSize(null, 20);
interactive.on('beforeChange', function(instance, change) {
    change.update(change.from, change.to, [change.text.join("").replace(/\n/g, "")]);
    return true;
});

interactive.on('keyHandled', function(instance, name, event) {
    if (name === 'Enter') {
        runContext(interactiveDoc.getValue(), model.debug().ctx, out.write, errorOut.write);
    }
});

var interactiveDoc = interactive.doc;

/* 
 ******************************************************************************/
var AtumObject = function(d, x, ctx) {
    var self = this;
    var value = d.getValue(x, function(x, ctx){ return x; }, function(x, ctx){ return x; });
    
    self.value = ko.observable(value);
    self.children = ko.observableArray();
    
    self.getChildren = function(data) {
        var value = data.value().value();
        if (data.value().children().length === 0) {
            if (value && value.type && value.type === 'object') {
                Object.keys(value.properties).map(function(key) {
                    data.value().children.push(
                        new AtumChild(key, new AtumObject(d, value.properties[key].value, ctx)));
                });
            }
        }
        $('.object-browser').accordion()
            .accordion('refresh');
    };
};

var AtumChild = function(key, value) {
    var self = this;

    self.key = ko.observable(key);
    self.value = ko.observable(value);
};

/* ConsoleViewModel
 ******************************************************************************/
var ConsoleViewModel = function() {
    var self = this;
    
    this.debug = ko.observable();
    
    this.output = ko.observableArray();
    
    this.environments = ko.computed(function(){
        return (self.debug() ?
            printEnvironments(self.debug(), self.debug().ctx) :
            []);
    });
    
    this.stack = ko.computed(function(){
        return (self.debug() && self.debug().ctx.userData ? 
            self.debug().ctx.userData.metadata.stack :
            [])
    });
};

ConsoleViewModel.prototype.finish = function() {
    return this.debug(this.debug().finish());
};

ConsoleViewModel.prototype.run = function() {
    return this.debug(this.debug().stepToDebugger());
};

ConsoleViewModel.prototype.stepOver = function() {
    return this.debug(this.debug().stepOver());
};

ConsoleViewModel.prototype.stepInto = function() {
    return this.debug(this.debug().step());
};

ConsoleViewModel.prototype.stepOut = function() {
    return this.debug(this.debug().stepOut());
};

ConsoleViewModel.prototype.push = function(value, ctx, error) {
    var obj = new AtumObject(atum_debugger.Debugger.create(compute.just(value), ctx, interpret.noop, interpret.noop), value, ctx);
    obj.getChildren({'key':'', 'value': ko.observable(obj) });
    this.output.push({
        'value': obj,
        'error': !!error
    });
    return this;
};

ConsoleViewModel.prototype.stop = function() {
    return this.debug(null);
};

/* 
 ******************************************************************************/
var model = new ConsoleViewModel();
ko.applyBindings(model);

var globalCtx = interpret.complete(
    compute.sequence(
        global.enterGlobal(),
        global.initialize(),
        compute.computeContext),
    context.ComputeContext.empty,
    function(x) { return x },
    function(x) { return x });

$(function(){
    var stopButton = $('button#stop-button'),
        runButton = $('button#run-button'),
        stepButton = $('button#step-button'),
        stepOutButton = $('button#step-out-button'),
        stepIntoButton = $('button#step-into-button');
    
    $('#container').layout();

    $('button#eval-button')
        .button()
        .click(function(e){
            run(doc.getValue(), out.write, errorOut.write);
                $('.object-browser')
                    .accordion({
                        'collapsible': true,
                        'animate': 100
                    });
        });
    
    $('.object-browser')
        .accordion();
    
    $('button#debug-button')
        .button()
        .click(function () {
            var input = doc.getValue();
            
            try {
                var ast = parser.parse(input);
                var p = semantics.programBody(semantics.sourceElements(ast.body));
                
                var ctx = globalCtx;
                model.debug(atum_debugger.Debugger.create(p, ctx,
                    out.write,
                    errorOut.write));
                
                stopButton.attr("disabled", false);
                runButton.attr("disabled", false);
                stepButton.attr("disabled", false);
                stepIntoButton.attr("disabled", false);
                stepOutButton.attr("disabled", false);

            } catch (e) {
                $('.ParseError').text(e);
            }
        });
    
    stopButton
        .button()
        .attr("disabled", true)
        .click(function(e){
            model.stop();
        })

    runButton
        .button()
        .attr("disabled", true)
        .click(function(e) {
            if (model.debug()) {
                model.run();
            } else {
                model.finish();
            }
        });
    
    stepButton
        .button()
        .attr("disabled", true)
        .click(function(e){
            model.stepOver();
        });
    
    stepIntoButton
        .button()
        .attr("disabled", true)
        .click(function(e){
            model.stepInto();
        });
    
    stepOutButton
        .button()
        .attr("disabled", true)
        .click(function(e){
            model.stepOut();
        });
});

});
