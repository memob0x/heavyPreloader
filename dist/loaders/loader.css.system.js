System.register('cssLoader', [], function (exports) {
    'use strict';
    return {
        execute: function () {

            var loader_css = exports('default', async (blob, options) => {
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
            });

        }
    };
});
//# sourceMappingURL=loader.css.system.js.map
