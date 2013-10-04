/**
 * @fileOverview `Function` builtin implementation.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/bound_function',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/object',
        'atum/builtin/operations/builtin_constructor',
        'atum/builtin/operations/builtin_function',
        'atum/operations/error',
        'atum/operations/evaluation',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/string',
        'atum/value/value'],
function(exports,
        compute,
        fun,
        func_builtin,
        object_builtin,
        bound_function,
        meta_builtin_constructor,
        meta_object,
        builtin_constructor,
        builtin_function,
        error,
        evaluation,
        func,
        object,
        string,
        type_conversion,
        value_reference,
        string_value,
        value){
"use strict";

/* Function
 ******************************************************************************/
/**
 * `Function(p1, p2, ..., pn, body)`
 */
var FunctionCall = function(ref, thisArg, args) {
    return this.construct(ref, args);
};

/**
 * `new Function(p1, p2, ..., pn, body)`
 */
var FunctionConstruct = function(ref, args) {
    if (args.length === 0)
        return object.construct(ref, [string_value.EMPTY]);
    return compute.binds(
        compute.enumerationa(args.args.map(type_conversion.toString)),
        function(/*...*/) {
            var parameterList = fun.slice(0, -1, arguments)
                .map(function(x) { return x.value; })
                .join(',');
            return evaluation.evaluateText(
                "(function(" + parameterList + ") {" + arguments[arguments.length - 1].value +"})");
        });
};

/**
 * `Function`
 */
var Function = new meta_builtin_constructor.BuiltinConstructor(
    func_builtin.FunctionPrototype,
    {},
    FunctionCall,
    FunctionConstruct);

/* FunctionPrototype
 ******************************************************************************/
/**
 * `Function.prototype`
 */
var FunctionPrototype = new meta_object.Object(object_builtin.ObjectPrototype, {
    'apply': {
        'value': func_builtin.FunctionPrototypeApply
    },
    'bind': {
        'value': func_builtin.FunctionPrototypeBind
    },
    'call': {
        'value': func_builtin.FunctionPrototypeCall
    },
    'constructor': {
        'value': func_builtin.Function
    }
});

/**
 * `Function.prototype.apply(thisArg, argArray)`
 */
var functionPrototypeApply = function(ref, thisObj, args) {
    return value_reference.dereference(thisObj, function(t) {
        if (!value.isCallable(t))
            return error.typeError(string.create("Function.prototype.apply on non-callable object"));
        
        var thisArg = args.getArg(0),
            argArray = args.getArg(1);
        return value_reference.dereference(argArray, function(argArray) {
            if (value.isUndefined(argArray) || value.isNull(argArray))
                return func.apply(thisObj, thisArg, args);
            else if (!value.isObject(argArray))
                return error.typeError(string.create("Function.prototype.apply non object argument array"));
            
            return func.call(
                compute.just(thisObj),
                compute.just(thisArg),
                compute.bind(
                    compute.bind(object.get(argArray, 'length'), type_conversion.toUint32),
                    function(len) {
                        var args = [];
                        for (var i = 0; i < len.value; ++i)
                            args.push(object.get(argArray, i));
                        return compute.enumerationa(args);
                    }));
        });
    });
};

/**
 * `Function.prototype.bind(thisArg, ...args)`
 */
var functionPrototypeBind = function(ref, thisObj, args) {
    var thisArg = args.getArg(0),
        boundArgs = args.slice(1);
    return value_reference.dereference(thisObj, function(t) {
        if (!value.isCallable(t))
            return error.typeError(string.create("Function.prototype.bind on non-callable object"));
        return value_reference.create(
            new bound_function.BoundFunction(
                func_builtin.FunctionPrototype,
                {},
                thisObj,
                thisArg,
                boundArgs));
    });
};

/**
 * `Function.prototype.call(thisArg, ...args)`
 */
var functionPrototypeCall = function(ref, thisObj, args) {
    return value_reference.dereference(thisObj, function(t) {
        if (!value.isCallable(t))
            return error.typeError(string.create("Function.prototype.call on non-callable object"));
        return func.apply(
            thisObj,
            args.getArg(0),
            args.slice(1));
    });
};

/* Initialize
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        builtin_constructor.create('Function', 1, func_builtin.FunctionPrototype, func_builtin.Function.setValue(Function)),

        func_builtin.FunctionPrototype.setValue(FunctionPrototype),
        builtin_function.create(func_builtin.FunctionPrototypeApply, 'apply', 2, functionPrototypeApply),
        builtin_function.create(func_builtin.FunctionPrototypeBind, 'bind', 1, functionPrototypeBind),
        builtin_function.create(func_builtin.FunctionPrototypeCall, 'call', 1, functionPrototypeCall));
};

var configure = function(mutableBinding, immutableBinding) {
    return mutableBinding('Function', func_builtin.Function);
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;
exports.configure = configure;

});