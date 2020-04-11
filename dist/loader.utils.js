(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('Loader', ['exports'], factory) :
    (global = global || self, factory(global.Loader = {}));
}(this, (function (exports) { 'use strict';

    const a = document.createElement("a");

    const getURL = (path) => {
        a.href = path;

        return new URL(a.href);
    };

    exports.getURL = getURL;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=loader.utils.js.map
