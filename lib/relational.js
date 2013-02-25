define(['atum/compute',
        'atum/reference',
        'atum/value/type_conversion',
        'atum/value/boolean'],
function(compute,
        reference,
        type_conversion,
        boolean){

/*
 ******************************************************************************/
var ltOperation = function(left, right) { return left < right; };
var lteOperation = function(left, right) { return left <= right; };
var gtOperation = function(left, right) { return left > right; };
var gteOperation = function(left, right) { return left >= right; };

/*
 ******************************************************************************/
var _relationalOperator = function(op) {
    return function(left, right) {
        var x = type_conversion.toPrimitive(reference.getValue(left), 'number'),
            y = type_conversion.toPrimitive(reference.getValue(right), 'number');
        return compute.bind(x, function(px) {
            return compute.bind(y, function(py) {
                return compute.always(new boolean.Boolean(op(px.value, py.value)));
            });
        });
    };
};

/* Numeric Relational Operators
 * 
 * @TODO Actually implement that '<' op in library instead of using host version.
 * @TODO Should we return undefined values when NaN is used?
 ******************************************************************************/
/**
 *
 */
var ltOperator = _relationalOperator(ltOperation);

/**
 * 
 */
var lteOperator = _relationalOperator(lteOperation);

/**
 * 
 */
var gtOperator = _relationalOperator(gtOperation);

/**
 * 
 */
var gteOperator = _relationalOperator(lteOperation);

/* 
 ******************************************************************************/
var instanceofOperator = function(left, right) {
    return compute.bind(
        reference.getValue(left),
        function(l) {
            return compute.bind(
                reference.getValue(right),
                function(r) {
                    return function(ctx, ok, err) {
                        if (value.type(r) !== 'object') {
                            return err('Instanceof', ctx);
                        }
                        return ok(value.hasInstance(l), ctx);
                    };
                });
        });
};

var inOperator;

/* Export
 ******************************************************************************/
return {
    'ltOperator': ltOperator,
    'lteOperator': lteOperator,
    'gtOperator': gtOperator,
    'gteOperator': gteOperator,
    'instanceofOperator': instanceofOperator,
    'inOperator': inOperator
};

});