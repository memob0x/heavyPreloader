System.register('javascriptLoader', [], function (exports) {
    'use strict';
    return {
        execute: function () {

            var loader_javascript_legacy = exports('default', async (resource) => {
                //
                const url =
                    resource instanceof Blob ? URL.createObjectURL(resource) : resource;

                //
                const result = await new Promise((resolve) => {
                    //
                    var script = document.createElement("script");
                    //
                    script.async = true;
                    script.src = url;

                    //
                    const events = (type) => {
                        script[`${type}EventListener`]("readystatechange", onload);
                        script[`${type}EventListener`]("load", onload);
                    };

                    //
                    const onload = () => {
                        events("remove");

                        resolve(script);
                    };

                    //
                    events("add");

                    //
                    document.head.prepend(script);
                });

                //
                URL.revokeObjectURL(url);

                //
                return result;
            });

        }
    };
});
//# sourceMappingURL=loader.javascript.legacy.system.js.map
