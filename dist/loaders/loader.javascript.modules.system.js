System.register('javascriptLoader', [], function (exports, module) {
    'use strict';
    return {
        execute: function () {

            var loader_javascript_modules = exports('default', async (resource) => {
                //
                const url =
                    resource instanceof Blob ? URL.createObjectURL(resource) : resource;

                //
                const result = await module.import(url);

                //
                URL.revokeObjectURL(url);

                //
                return result;
            });

        }
    };
});
//# sourceMappingURL=loader.javascript.modules.system.js.map
