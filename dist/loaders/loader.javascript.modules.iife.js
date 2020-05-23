var javascriptLoader = (function () {
    'use strict';

    var loader_javascript_modules = async (resource) => {
        //
        const url =
            resource instanceof Blob ? URL.createObjectURL(resource) : resource;

        //
        const result = await import(url);

        //
        URL.revokeObjectURL(url);

        //
        return result;
    };

    return loader_javascript_modules;

}());
//# sourceMappingURL=loader.javascript.modules.iife.js.map
