(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Loader', factory) :
    (global = global || self, global.Loader = factory());
}(this, (function () { 'use strict';

    var loader_load_css = async (blob, options) => {
        options = { ...{ element: document }, options };

        const url = URL.createObjectURL(blob);

        const sheet = new CSSStyleSheet();

        await sheet.replace(`@import url("${url}")`);

        URL.revokeObjectURL(url);

        if (
            typeof options.element === "object" &&
            "adoptedStyleSheets" in options.element
        ) {
            options.element.adoptedStyleSheets = [
                ...options.element.adoptedStyleSheets,
                sheet,
            ];
        }

        return sheet;
    };

    return loader_load_css;

})));

//# sourceMappingURL=loader.load.css.js.map
