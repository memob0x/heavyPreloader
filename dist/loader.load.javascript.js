(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Loader', factory) :
    (global = global || self, global.Loader = factory());
}(this, (function () { 'use strict';

    var loader_load_javascript = async (blob) => {
        const url = URL.createObjectURL(blob);

        const result = await import(url);

        URL.revokeObjectURL(url);

        return result;
    };

    return loader_load_javascript;

})));

//# sourceMappingURL=loader.load.javascript.js.map
