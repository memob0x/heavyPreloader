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

    var lfetch = async (href, options = {}) => {
        if (href in cache) {
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

        if ("adoptedStyleSheets" in options.element) {
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

        async fetch(arg, options) {
            if (Array.isArray(arg)) {
                return await arg.map((a) => this.fetch(a));
            }

            if (typeof arg === "string") {
                const a = document.createElement("a");

                a.href = arg;

                return await this.fetch(new URL(a));
            }

            if (arg instanceof URL) {
                return await lfetch(arg.href, (options && options.fetch) || {});
            }

            throw new TypeError(
                `Invalid argment of type ${typeof arg} passed to Loader class "fetch" method.`
            );
        }

        async load(arg, options) {
            if (Array.isArray(arg)) {
                return await arg.map((a) => this.load(a, options));
            }

            const blob = arg instanceof Blob ? arg : await this.fetch(arg, options);

            return await lload(blob, options);
        }
    }

    return Loader;

})));

//# sourceMappingURL=loader.js.map
