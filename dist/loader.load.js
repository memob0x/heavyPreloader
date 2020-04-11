(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Loader', factory) :
    (global = global || self, global.Loader = factory());
}(this, (function () { 'use strict';

    var css = async (blob, options) => {
        options = { ...{ element: document }, options };

        const url = URL.createObjectURL(blob);

        const sheet = new CSSStyleSheet();

        await sheet.replace(`@import url("${url}")`);

        URL.revokeObjectURL(url);

        if (
            typeof options.element === "object" &&
            "adoptedStyleSheets" in options.element
        ) {
            options.element.adoptedStyleSheets = [
                ...options.element.adoptedStyleSheets,
                sheet,
            ];
        }

        return sheet;
    };

    var html = async (blob, options) => {
        const reader = new FileReader();

        const promise = new Promise((resolve) =>
            reader.addEventListener("loadend", (buffer) =>
                resolve(buffer.srcElement.result)
            )
        );

        reader.readAsText(blob);

        let result = await promise;

        if (
            options &&
            typeof options.filter === "string" &&
            options.filter.length
        ) {
            result = new DOMParser().parseFromString(result, "text/html").body;
            result = [...result.querySelectorAll(options.filter)];
            result = result.length
                ? result.map((x) => x.outerHTML).reduce((x, y) => x + y)
                : result;
        }

        if (
            options &&
            options.element &&
            options.element instanceof HTMLElement &&
            result &&
            typeof result === "string" &&
            result.length
        ) {
            options.element.innerHTML = result;
        }

        return promise;
    };

    var image = async (blob, options) => {
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

    var javascript = async (blob) => {
        const url = URL.createObjectURL(blob);

        const result = await import(url);

        URL.revokeObjectURL(url);

        return result;
    };

    var loader_load = new (class LoaderLoad {
        constructor() {
            this.loaders = {
                image: image,
                html: html,
                css: css,
                javascript: javascript,
            };
        }

        register(type, loader) {
            this.loaders[type] = loader;
        }

        async load(blob, options) {
            const type = blob.type;

            const keys = type.split("/").reduce((x, y) => [type, x, y]);

            for (const key in keys) {
                const loader = keys[key];

                if (loader in this.loaders) {
                    return await this.loaders[loader](blob, options);
                }
            }

            throw new TypeError(
                `Invalid ${blob.type} media type passed to Loader class "load" method.`
            );
        }
    })();

    return loader_load;

})));

//# sourceMappingURL=loader.load.js.map
