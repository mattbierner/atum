/**
 * 
 */
define(['atum/compute',
        'atum/value/object',
        'atum/value/undef',
        'atum/context/environment',
        'atum/context/execution_context',
        'atum/semantics/reference',
        'atum/iref'],
function(compute,
        object,
        undef,
        environment,
        execution_context,
        reference,
        iref){

/* Function
 ******************************************************************************/
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
        body = this.body,
        id = this.id;
    var that = this;
    
    return compute.bind(
        compute.context,
        function(ctx){
            return compute.bind(
                reference.getValue(compute.always(ctx.lexicalEnvironment)),
                function(env) {
                    var localEnv = names.reduce(
                        function(env, name, i) {
                            var v = (i >= args.length ? new undef.Undefined() : args[i]);
                            return environment.putIdentifierReference(
                                env,
                                name,
                                v,
                                strict);
                            },
                        environment.putIdentifierReference(
                            new environment.DeclarativeLexicalEnvironment(scope), id, that));
                    
            
             var lexRef = new iref.Iref();
    
            var funcCtx = new execution_context.ExecutionContext(
                execution_context.GLOBAL,
                false,
                strict,
                null,
                null,
                ctx.values)
                .setValue(lexRef.key, localEnv)
                .setLexicalEnvironment(lexRef)
                .setVariableEnvironment(lexRef);
            
            return function(ctx, ok, err){
                return body(funcCtx, function(x) {
                    return ok(x, ctx);
                }, err);
                
            };
        });
        });
};

return {
    'Function': Function,
};

});