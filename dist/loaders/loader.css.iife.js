var cssLoader = (function () {
    'use strict';

    var loader_css = async (blob, options) => {
        //
        options = { ...{ element: document }, options };

        //
        const url = URL.createObjectURL(blob);

        //
        const sheet = new CSSStyleSheet();

        //
        await sheet.replace(`@import url("${url}")`);

        //
        URL.revokeObjectURL(url);

        //
        if (
            typeof options.element === "object" &&
            "adoptedStyleSheets" in options.element
        ) {
            options.element.adoptedStyleSheets = [
                ...options.element.adoptedStyleSheets,
                sheet
            ];
        }

        //
        return sheet;
    };

    return loader_css;

}());
//# sourceMappingURL=loader.css.iife.js.map
