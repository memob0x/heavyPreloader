(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Loader', factory) :
    (global = global || self, global.Loader = factory());
}(this, (function () { 'use strict';

    var loader_load_image = async (blob, options) => {
        const image =
            options && options.element instanceof HTMLImageElement
                ? options.element
                : new Image();

        const url = URL.createObjectURL(blob);

        const promise = new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = () =>
                reject(new Error(`Error loading image ${blob.type}`));
        });

        image.src = url;

        const result = await promise;

        URL.revokeObjectURL(url);

        return result;
    };

    return loader_load_image;

})));

//# sourceMappingURL=loader.load.image.js.map
