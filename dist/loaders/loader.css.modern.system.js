System.register('cssLoader', [], function (exports) {
    'use strict';
    return {
        execute: function () {

            var loader_css_modern = exports('default', async (resource, options) => {
                //
                const url =
                    resource instanceof Blob ? URL.createObjectURL(resource) : resource;

                //
                const sheet = new CSSStyleSheet();

                //
                await sheet.replace(`@import url("${url}")`);

                //
                URL.revokeObjectURL(url);

                //
                const element = options?.element || document;

                //
                if (element instanceof Document || element instanceof ShadowRoot) {
                    element.adoptedStyleSheets = [...element.adoptedStyleSheets, sheet];
                }

                //
                return sheet;
            });

        }
    };
});
//# sourceMappingURL=loader.css.modern.system.js.map
