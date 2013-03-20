/**
 * 
 */
define(['amulet/object',
        'atum/compute',
        'atum/value/object',
        'atum/value/undef',
        'atum/context/environment',
        'atum/context/execution_context',
        'atum/semantics/reference',
        'atum/iref'],
function(amulet_object,
        compute,
        object,
        undef,
        environment,
        execution_context,
        reference,
        iref){

/* Helper
 ******************************************************************************/
var bindArguments = function(env, names, args, strict) {
    return names.reduce(function(env, name, i) {
        var v = (i >= args.length ? new undef.Undefined() : args[i]);
        return environment.putIdentifierReference(
            env,
            name,
            v,
            strict);
        },
        env);
};

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
                    var localEnv = bindArguments(
                        environment.putIdentifierReference(
                            new environment.DeclarativeLexicalEnvironment(scope),
                            id,
                            that),
                        names,
                        args,
                        strict);
                    
                    return compute.bind(
                        (new iref.Iref()).set(compute.always(localEnv)),
                        function(lexRef) {
                            var funcCtx = new execution_context.ExecutionContext(
                                execution_context.GLOBAL,
                                strict,
                                lexRef,
                                lexRef,
                                thisObj);
                            
                            return function(ctx, v, ok, err) {
                                return body(funcCtx, v, function(x, fc, v) {
                                    return ok(x, ctx, v);
                                }, err);
                            };
                        });
                });
        });
};

/**
 * Internal function object construction
 * 
 * @TODO: hookup default object prototype.
 */
Function.prototype.construct = function(/*...*/) {
    var proto = (value.type(this.proto) === object.OBJECT_TYPE ? 
        this.proto :
        null);
    
    var obj = amulet_object.defineProperty(new object.Object(proto), 'Class', {
        'value': 'Class',
        'extensible': true
    });
    return this.call(compute.always(obj), arguments);
};



return {
    'Function': Function,
};

});