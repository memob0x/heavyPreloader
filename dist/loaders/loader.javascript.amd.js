define(['require'], function (require) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) { return e; } else {
            var n = {};
            if (e) {
                Object.keys(e).forEach(function (k) {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                });
            }
            n['default'] = e;
            return n;
        }
    }

    var loader_javascript = async (blob) => {
        //
        const url = URL.createObjectURL(blob);

        //
        const result = await new Promise(function (resolve, reject) { require([url], function (m) { resolve(_interopNamespace(m)); }, reject) });

        //
        URL.revokeObjectURL(url);

        //
        return result;
    };

    return loader_javascript;

});
//# sourceMappingURL=loader.javascript.amd.js.map
