define(['atum/context/environment'],
function(environment) {
//"use strict";


var globalEnvironment = environment.newObjectEnvironment(null,
    {
        'NaN': {
            'value': NaN,
            'writable': false,
            'enumerable': false,
            'configurable': false
        },
        'Infinity': {
            'value': Infinity,
            'writable': false,
            'enumerable': false,
            'configurable': false
        },
        'undefined': {
            'value': undefined,
            'writable': false,
            'enumerable': false,
            'configurable': false
        },
        
        'eval': {
            'value': function(x) {
                if (type(x) !== 'String') {
                    return x;
                }
            }
        }
    });


return {
    'globalEnvironment': globalEnvironment
    
};

});