System.register('cssLoader', [], function (exports) {
    'use strict';
    return {
        execute: function () {

            var modern = async (resource, options) => {
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
            };

            var legacy = async (resource) => {
                //
                const url =
                    resource instanceof Blob ? URL.createObjectURL(resource) : resource;

                //
                const sheet = await new Promise((resolve) => {
                    //
                    const link = document.createElement("link");

                    //
                    link.rel = "stylesheet";
                    link.href = url;

                    //
                    const callback = () => {
                        link.removeEventListener("load", callback);
                        link.removeEventListener("error", callback);

                        resolve(link);
                    };

                    //
                    const sheets = document.styleSheets;
                    let i = sheets.length;
                    while (i--) {
                        if (sheets[i].href === url) {
                            callback();
                        }
                    }

                    //
                    link.addEventListener("load", callback);
                    link.addEventListener("error", callback);

                    //
                    document.head.append(link);
                });

                //
                URL.revokeObjectURL(url);

                //
                return sheet;
            };

            var loader_css = exports('default', async (blob, options) => {
                const url = URL.createObjectURL(blob);

                try {
                    return await modern(url, options);
                } catch {
                    return await legacy(url);
                }
            });

        }
    };
});
//# sourceMappingURL=loader.css.system.js.map
