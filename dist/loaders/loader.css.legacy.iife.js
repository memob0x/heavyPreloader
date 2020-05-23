var cssLoader = (function () {
    'use strict';

    var loader_css_legacy = async (resource) => {
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

    return loader_css_legacy;

}());
//# sourceMappingURL=loader.css.legacy.iife.js.map
