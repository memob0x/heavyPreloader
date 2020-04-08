(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Loader', factory) :
    (global = global || self, global.Loader = factory());
}(this, (function () { 'use strict';

    const body = () =>
        (onmessage = async (event) => {
            try {
                const response = await fetch(event.data.href, event.data.options);
                const blob = await response.blob();

                event.data.status = response.status;
                event.data.statusText = response.statusText;
                event.data.blob = blob;
            } catch (e) {
                event.data.statusText = e;
            }

            postMessage(event.data);
        });

    let lworker = null;
    let requests = 0;

    const get = () => {
        requests++;

        if (lworker) {
            return lworker;
        }

        const url = URL.createObjectURL(
            new Blob(["(", body.toString(), ")()"], {
                type: "application/javascript",
            })
        );

        lworker = new Worker(url);

        URL.revokeObjectURL(url);

        return lworker;
    };

    const terminate = () => {
        requests--;

        if (requests <= 0) {
            lworker.terminate();

            lworker = null;
        }
    };

    const cache = {};

    var lfetch = async (href, options) => {
        options = {
            ...{
                cache: true,
                fetch: {},
            },
            ...options,
        };

        if (options.cache === true && href in cache) {
            return await cache[href];
        }

        return (cache[href] = new Promise((resolve, reject) => {
            const worker = get();

            worker.postMessage({
                href: href,
                options: options.fetch,
            });

            worker.addEventListener("message", (event) => {
                const data = event.data;

                if (data.href !== href) {
                    return;
                }

                terminate();

                if (data.status === 200) {
                    resolve(data.blob);

                    return;
                }

                reject(new Error(`${data.statusText} for ${data.href} resource.`));
            });
        }));
    };

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

        if (typeof options.filter === "string" && options.filter.length) {
            result = new DOMParser().parseFromString(result, "text/html").body;
            result = [...result.querySelectorAll(options.filter)];
            result = result.map((x) => x.outerHTML).reduce((x, y) => x + y);
        }

        if (options.element && options.element instanceof HTMLElement) {
            options.element.innerHTML = result;
        }

        return promise;
    };

    var image = async (blob, options) => {
        const image =
            options.element instanceof HTMLImageElement
                ? options.element
                : new Image();

        const url = URL.createObjectURL(blob);

        const promise = new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
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

    var lload = async (blob, options) => {
        switch (blob.type) {
            case "image/png":
            case "image/jpeg":
                return await image(blob, options);

            case "text/html":
                return await html(blob, options);

            case "text/css":
                return await css(blob, options);

            case "text/javascript":
                return await javascript(blob);
        }

        throw new TypeError(
            `Invalid argment of type ${typeof blob} passed to Loader class "fetch" method.`
        );
    };

    class Loader {
        constructor() {}

        async fetch(resource, options) {
            if (Array.isArray(resource)) {
                return await resource.map((a) => this.fetch(a, options));
            }

            if (typeof resource === "string") {
                const a = document.createElement("a");

                a.href = resource;

                return await this.fetch(new URL(a), options);
            }

            if (resource instanceof URL) {
                return await lfetch(resource.href, options);
            }

            throw new TypeError(
                `Invalid argment of type ${typeof resource} passed to Loader class "fetch" method.`
            );
        }

        async load(resource, options) {
            if (Array.isArray(resource)) {
                const isArrayOpts = Array.isArray(options);

                return await resource.map((a, i) =>
                    this.load(a, isArrayOpts ? options[i] : options)
                );
            }

            const blob =
                resource instanceof Blob
                    ? resource
                    : await this.fetch(resource, options);

            return await lload(blob, options);
        }
    }

    return Loader;

})));

//# sourceMappingURL=loader.js.map
