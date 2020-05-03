System.register('javascriptLoader', [], function (exports, module) {
    'use strict';
    return {
        execute: function () {

            var loader_javascript = exports('default', async (blob) => {
                //
                const url = URL.createObjectURL(blob);

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
//# sourceMappingURL=loader.javascript.system.js.map
