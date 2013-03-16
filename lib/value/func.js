/**
 * 
 */
define(['atum/value/object',
        'atum/value/undef',
        'atum/context/environment',
        'atum/context/execution_context'],
function(object,
        undef,
        environment,
        execution_context){

/**
 * 
 */
var Function = function(scope, id, names, body, strict) {
    this.id = id;
    this.names = (names || []);
    this.scope = scope;
    this.body = body;
    this.strict = strict;
};

Function.prototype = new object.Object;

/**
 * 
 */
Function.prototype.call = function(thisObj, args) {
    var strict = this.strict,
        names = this.names,
        scope = this.scope,
        body = this.body;
    
    return function(ctx, ok, err) {
        var localEnv = names.reduce(function(env, name, i) {
            var v = (i > args.length ? new undef.Undefined() : args[i]);
            if (!environment.hasIdentifierReference(env, name)) {
                return environment.putIdentifierReference(
                    env,
                    name,
                    v,
                    strict);
            }
            return environment.setIdentifierReference(
                env,
                name,
                v,
                strict);
        }, environment.newDeclarativeEnvironment(scope));
        
        var funcCtx = new execution_context.ExecutionContext(
            execution_context.FUNCTION,
            this.strict,
            localEnv,
            localEnv,
            thisObj,
            ctx.values);
        
        return body(funcCtx, function(x) {
            return ok(x, ctx);
        }, err);
    };
};

return {
    'Function': Function,
};

});