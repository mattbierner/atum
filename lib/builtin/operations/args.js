/**
 * @fileOverview 
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/args',
        'atum/builtin/operations/builtin_function',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/internal_reference',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/value_reference',
        'atum/value/property'],
function(exports,
        compute,
        vr,
        args_builtin,
        builtin_function,
        environment,
        error,
        internal_reference,
        number,
        object,
        string,
        value_reference,
        property){
"use strict";

var makeArgGetter = function(env, name) {
    return builtin_function.create(new vr.ValueReference(), '', 0, function(ref, thisObj, args) {
        return internal_reference.getFrom(
            environment.getEnvironmentBinding(compute.just(env), name));
    });
};

var makeArgSetter = function(env, name) {
    return builtin_function.create(new vr.ValueReference(), '', 1, function(ref, thisObj, args) {
        return internal_reference.getFrom(
            environment.setEnvironmentMutableBinding(
                compute.just(env),
                name,
                false,
                compute.just(args.getArg(0))));
    });
};

/* Operations
 ******************************************************************************/
/**
 * Create a new object.
 */
var create = function(func, names, args, env, strict) {
    var len = args.length;
    var map = {};
    var mappedNames = [];
    
    var props = {
        'length': property.createValuePropertyFlags(
            number.create(len),
            property.WRITABLE | property.CONFIGURABLE)
    };
    
    for (var indx = len - 1; indx >= 0; --indx) {
        props[indx] = property.createValuePropertyFlags(
            compute.just(args.getArg(indx)),
            property.ENUMERABLE | property.WRITABLE | property.CONFIGURABLE);
        if (indx < names.length) {
            var name = names[indx];
            if (!strict && mappedNames.indexOf(name) === -1) {
                mappedNames.push(name);
                props[indx] = property.createAccessorPropertyFlags(
                    makeArgGetter(env, name),
                    makeArgSetter(env, name),
                    property.CONFIGURABLE);
            }
        }
    }
    
    if (strict) {
        props['callee'] = property.createAccessorPropertyFlags(
            compute.just(args_builtin.strictCalleeThrower),
            compute.just(args_builtin.strictCalleeThrower));
        props['caller'] = property.createAccessorPropertyFlags(
            compute.just(args_builtin.strictCallerThrower),
            compute.just(args_builtin.strictCallerThrower));
    } else {
        props['callee'] = property.createValuePropertyFlags(
            compute.just(func),
            property.CONFIGURABLE | property.WRITABLE);
    }
    
    return object.defineProperties(
        object.construct(args_builtin.Arguments, []),
        props);
};

/* Export
 ******************************************************************************/
exports.create = create;

});