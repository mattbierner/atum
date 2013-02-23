define(['atum/compute', 'atum/value'],
function(compute, value) {
//"use strict";

var Number = function(v) {
    value.Value.call(this, "Number", v);
};
Number.prototype = new value.Value;

var add = function(a, b) {
    return compute.always(new Number(a.value + b.value));
};

var subtract = function(a, b) {
    return compute.always(new Number(a.value - b.value));
};


/**
 * 
 */
var multiply = function(left, right) {
    return compute.bind(
        left,
        function(lnum) {
            return compute.bind(
                right,
                function(rnum) {
                    return compute.always(new Number(lnum.value * rnum.value));
                });
        });
};


/**
 * 
 */
var divide = function(left, right) {
    return compute.bind(
        left,
        function(lnum) {
            return compute.bind(
                right,
                function(rnum) {
                    return compute.always(new Number(lnum.value / rnum.value));
                });
        });
};


return {
    'Number': Number,
    'add': add,
    'subtract': subtract,
    'multiply': multiply,
    'divide': divide
};

});