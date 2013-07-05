/**
 * @fileOverview Functions for interpreting an ECMAScript abstract syntax tree.
 */
define(['ecma/ast/node',
        'atum/compute',
        'atum/completion',
        'atum/debug/operations',
        'atum/semantics/semantics',
        'atum/operations/undef'],
function(ast,
        compute,
        completion,
        debug_operations,
        semantics,
        undef){

/* Interpretation
 ******************************************************************************/
/**
 * 
 */
var ret = function(x, ctx) {
    return function() {
        console.log(ctx);
        return x;
    };
};

/**
 * 
 */
var thr = function(x, ctx) {
    return function() {
        console.log(ctx);
        throw x;
    };
};

/**
 * 
 */
var exec2 = function(p, ctx, ok, err) {
    return p(ctx, ok, err)();
};

/**
 */
var exec = function(p, ctx, ok, err) {
    var done = false;
    var z = p(ctx,
        function(){ done = true; return ok.apply(undefined, arguments); },
        function(){ done = true; return err.apply(undefined, arguments); });
    while (!done) {
        z = z.k()();
    }
    return z();
};

/**
 * Evaluates 'comp' in an given execution context 'ctx'.
 * 
 * @param comp Computation to evaluate
 * @param ctx Execution context to interpret 'root' in.
 */
var evalContext = function(comp, ctx) {
    return exec(comp, ctx, ret, thr);
};

/**
 */
var eval = function(comp) {
    return evalContext(comp, compute.ComputeContext.empty);
};

var extract = function(body) {
    return compute.bind(body, function(x) {
        if (x instanceof completion.Completion) {
            switch (x.type) {
            case completion.NormalCompletion.type: 
                return (x.value === null ? undef.create() : compute.just(x.value));
            case completion.ReturnCompletion.type:
                return compute.error("Return not in function");
            case completion.BreakCompletion.type:
                return compute.error("Break not in loop");
            case completion.ContinueCompletion.type:
                return compute.error("Continue not in loop");
            case completion.ThrowCompletion.type:
                return compute.error(x.value);
            }
        }
        return compute.just(x);
    });
};

/**
 * Interprets AST 'root'.
 * 
 * Interpretation is performed in a global execution context.
 * 
 * @param root An abstract syntax tree to interpret.
 * 
 * @return Result of interpretation of 'root'.
 */
var interpret = function(root) {
    return eval(extract(semantics.mapSemantics(root)));
};



/* Export
 ******************************************************************************/
return {
    'interpret': interpret,
        
    'exec': exec,
    
    'evalContext': evalContext,
    'eval': eval,
    'extract': extract
};

});