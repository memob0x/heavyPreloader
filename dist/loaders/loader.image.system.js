System.register('imageLoader', [], function (exports) {
    'use strict';
    return {
        execute: function () {

            var loader_image = exports('default', async (blob, options) => {
                //
                const image =
                    options && options.element instanceof HTMLImageElement
                        ? options.element
                        : new Image();

                //
                const url = URL.createObjectURL(blob);

                //
                const promise = new Promise((resolve, reject) => {
                    image.onload = resolve;
                    image.onerror = () =>
                        reject(new Error(`Error loading image ${blob.type}`));
                });

                //
                image.src = url;

                //
                const result = await promise;

                //
                URL.revokeObjectURL(url);

                //
                return result;
            });

        }
    };
});
//# sourceMappingURL=loader.image.system.js.map
