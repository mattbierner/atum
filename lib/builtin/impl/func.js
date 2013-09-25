/**
 * @fileOverview Hosted language `Function` builtin
 */
define(['exports',
        'atum/compute',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/bound_function',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/object',
        'atum/operations/error',
        'atum/operations/evaluation',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/args',
        'atum/value/number',
        'atum/value/string',
        'atum/value/value'],
function(exports,
        compute,
        func_ref,
        builtin_object,
        bound_function,
        meta_builtin_constructor,
        meta_object,
        error,
        evaluation,
        func,
        object,
        string,
        type_conversion,
        value_reference,
        value_args,
        number,
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
        return this.construct(new value_args.Args([string_value.EMPTY]));
    return compute.binds(
        compute.enumerationa(args.args.map(type_conversion.toString)),
        function(/*...*/) {
            var parameterList = [].slice.call(arguments, 0, -1)
                .map(function(x){ return x.value; })
                .join(',');
            return evaluation.evaluate(
                "(function(" + parameterList + ") {" + arguments[arguments.length - 1].value +"})");
        });
};

/**
 * `Function`
 */
var Function = new meta_builtin_constructor.BuiltinConstructor(
    func_ref.FunctionPrototype,
    {},
    FunctionCall,
    FunctionConstruct);

/* FunctionPrototype
 ******************************************************************************/
/**
 * `Function.prototype`
 */
var FunctionPrototype = new meta_object.Object(builtin_object.ObjectPrototype, {
    'apply': {
        'value': func_ref.FunctionPrototypeApply
    },
    'bind': {
        'value': func_ref.FunctionPrototypeBind
    },
    'call': {
        'value': func_ref.FunctionPrototypeCall
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
                            args.push(object.get(argArray, i + ''));
                        return compute.enumerationa(args);
                    }));
        });
    });
};

/**
 * `Function.prototype.bind(thisArg, ...args)`
 */
var functionPrototypeBind = function(ref, thisObj, args) {
    return value_reference.create(
        new bound_function.BoundFunction(
            func_ref.FunctionPrototype,
            {},
            thisObj,
            args.getArg(0),
            args.slice(1)));
};

/**
 * `Function.prototype.call(thisArg, ...args)`
 */
var functionPrototypeCall = function(ref, thisObj, args) {
    return value_reference.dereference(thisObj, function(t) {
        if (!value.isCallable(t))
            return error.typeError(string.create("Function.prototype.call on non-callable object"));
        return t.call(thisObj, args.getArg(0), args.slice(1));
    });
};

/* Initialize
 ******************************************************************************/
var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function');
    return compute.sequence(
        func.createConstructor('Function', 1, func_ref.FunctionPrototype, func_ref.Function.setValue(Function)),

        func_ref.FunctionPrototype.setValue(FunctionPrototype),
        builtin_function.create(func_ref.FunctionPrototypeApply, 'apply', 2, functionPrototypeApply),
        builtin_function.create(func_ref.FunctionPrototypeBind, 'bind', 1, functionPrototypeBind),
        builtin_function.create(func_ref.FunctionPrototypeCall, 'call', 1, functionPrototypeCall));
};

var configure = function(mutableBinding, immutableBinding) {
    return mutableBinding('Function', func_ref.Function);
};


/* Export
 ******************************************************************************/
exports.initialize = initialize;
exports.configure = configure;

exports.Function = func_ref.Function;
exports.FunctionPrototype = func_ref.FunctionPrototype;

});