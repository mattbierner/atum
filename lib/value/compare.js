define(['atum/value/value',
        'atum/value/type_conversion',
        'atum/value/number',
        'atum/value/string',
        'atum/value/undef',
        'atum/value/nil',
        'atum/value/object'],
function(value,
        type_conversion,
        number,
        string,
        undef,
        nil,
        object){


var equal = function(x, y) {
    var xType = value.type(x),
        yType = value.type(y);
    
    if (xType === yType) {
        switch (xType) {
        case undef.UNDEFINED_TYPE:
        case nil.NULL_TYPE:
            return true;
        case number.NUMBER_TYPE:
            if (x.value === NaN || y.value === NaN) {
                return false
            }
            return (x.value === y.value);
        case string.STRING_TYPE:
        case boolean.BOOLEAN_TYPE:
        case object.OBJECT_TYPE:
            return (x.value === y.value);
        }
    }
    
    if ((xType === nil.NULL_TYPE && yType === undef.UNDEFINED_TYPE) ||
      (xType === undef.UNDEFINED_TYPE && yType === nil.NULL_TYPE)) {
        return true;
    } else if (xType === number.NUMBER_TYPE && yType === string.STRING_TYPE) {
        return equal(x, type_conversion.toNumber(y));
    } else if (xType === string.STRING_TYPE && yType === number.NUMBER_TYPE) {
        return equal(type_conversion.toNumber(x), y);
    } else if (xType === boolean.BOOLEAN_TYPE) {
        return equal(type_conversion.toNumber(x), y);
    } else if (yType === boolean.BOOLEAN_TYPE) {
        return equal(x, type_conversion.toNumber(y));
    } else if ((xType === string.STRING_TYPE || x.Type === number.NUMBER_TYPE) &&
      yType === object.OBJECT_TYPE) {
        return equal(x, type_conversion.toPrimitive(y));
    } else if ((yType === string.STRING_TYPE || y.Type === number.NUMBER_TYPE) &&
      xType === object.OBJECT_TYPE) {
        return equal(type_conversion.toPrimitive(x), y);
    } else {
        return false;
    }
};

var strictEqual = function(x, y) {
    var xType = value.type(x),
        yType = value.type(y);
    
    if (xType !== yType) {
        return false;
    }
    
    switch (xType) {
    case undef.UNDEFINED_TYPE:
    case nil.NULL_TYPE:
        return true;
    case number.NUMBER_TYPE:
        if (x.value === NaN || y.value === NaN) {
            return false
        }
        return (x.value === y.value);
    case string.STRING_TYPE:
    case boolean.BOOLEAN_TYPE:
    case object.OBJECT_TYPE:
    default:
        return (x.value === y.value);
    }
};

return {
    'equal': equal
};

});