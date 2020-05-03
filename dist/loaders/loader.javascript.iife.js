var javascriptLoader = (function () {
    'use strict';

    var loader_javascript = async (blob) => {
        //
        const url = URL.createObjectURL(blob);

        //
        const result = await import(url);

        //
        URL.revokeObjectURL(url);

        //
        return result;
    };

    return loader_javascript;

}());
//# sourceMappingURL=loader.javascript.iife.js.map
