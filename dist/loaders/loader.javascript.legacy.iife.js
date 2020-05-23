var javascriptLoader = (function () {
    'use strict';

    var loader_javascript_legacy = async (resource) => {
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
    };

    return loader_javascript_legacy;

}());
//# sourceMappingURL=loader.javascript.legacy.iife.js.map
