/**
 * 
 */
define(['require',
        'amulet/object',
        'atum/compute',
        'atum/value/object',
        'atum/value/undef',
        'atum/context/environment',
        'atum/context/execution_context',
        'atum/semantics/reference',
        'atum/iref',
        'atum/value/type',
        'atum/value/value',
        'atum/builtin/object',
                'atum/semantics/value_reference'],
function(require,
        amulet_object,
        compute,
        object,
        undef,
        environment,
        execution_context,
        reference,
        iref,
        type, value,
        builtin_object,
        value_reference){
//"use strict";

/* Helper
 ******************************************************************************/
var bindArguments = function(env, names, args, strict) {
    return names.reduce(function(env, name, i) {
        var v = (i >= args.length ? new undef.Undefined() : args[i]);
        return environment.putIdentifier(
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
                        (id ?
                            environment.putIdentifier(
                                new environment.DeclarativeLexicalEnvironment(scope),
                                id,
                                that) :
                            new environment.DeclarativeLexicalEnvironment(scope)),
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
                            return compute.next(
                                compute.setContext(funcCtx),
                                compute.bind(body, function(x) {
                                    return compute.next(compute.setContext(ctx), compute.always(x));
                                }));
                        });
                });
        });
};

/**
 * Internal function object construction
 * 
 * @TODO: hookup default object prototype.
 */
Function.prototype.construct = function(args) {
    var proto = (this.proto && value.type(this.proto) === type.OBJECT_TYPE ? 
        this.proto :
        require('atum/builtin/object').ObjectPrototypeRef);
    
    var obj = amulet_object.defineProperty(new object.Object(proto), 'Class', {
        'value': 'Object',
        'extensible': true
    });
    var that = this;
    return compute.bind(
        value_reference.create(compute.always(obj)),
        function(ref) {
            return compute.next(
                that.call(ref, args),
                compute.always(ref));
        });

};

/* Export
 ******************************************************************************/
return {
    'Function': Function,
};

});