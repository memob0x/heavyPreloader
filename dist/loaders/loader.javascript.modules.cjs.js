'use strict';

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

var loader_javascript_modules = async (resource) => {
    //
    const url =
        resource instanceof Blob ? URL.createObjectURL(resource) : resource;

    //
    const result = await Promise.resolve().then(function () { return _interopNamespace(require(url)); });

    //
    URL.revokeObjectURL(url);

    //
    return result;
};

module.exports = loader_javascript_modules;
//# sourceMappingURL=loader.javascript.modules.cjs.js.map
