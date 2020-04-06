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

    var css = async (blob, el = document) => {
        const url = URL.createObjectURL(blob);

        const sheet = new CSSStyleSheet();

        await sheet.replace(`@import url("${url}")`);

        URL.revokeObjectURL(url);

        if ("adoptedStyleSheets" in el) {
            el.adoptedStyleSheets = [...el.adoptedStyleSheets, sheet];
        }

        return sheet;
    };

    var html = async (blob, el) => {
        const reader = new FileReader();

        const promise = new Promise((resolve) =>
            reader.addEventListener("loadend", (buffer) =>
                resolve(buffer.srcElement.result)
            )
        );

        reader.readAsText(blob);

        const result = await promise;

        if (el && typeof el === "object" && "innerHTML" in el) {
            el.innerHTML = result;
        }

        return promise;
    };

    var image = async (blob, el = new Image()) => {
        const url = URL.createObjectURL(blob);

        const promise = new Promise((resolve, reject) => {
            el.onload = resolve;
            el.onerror = reject;
        });

        el.src = url;

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

    var lload = async (blob, el) => {
        switch (blob.type) {
            case "image/png":
            case "image/jpeg":
                return await image(blob, el);

            case "text/html":
                return await html(blob, el);

            case "text/css":
                return await css(blob, el);

            case "text/javascript":
                return await javascript(blob);
        }

        throw new TypeError(
            `Invalid argment of type ${typeof blob} passed to Loader class "fetch" method.`
        );
    };

    class Loader {
        constructor(options) {
            this.options = {
                ...{ fetch: { cors: "no-cors" } },
                ...options,
            };
        }

        async fetch(arg) {
            if (Array.isArray(arg)) {
                return await arg.map((a) => this.fetch(a));
            }

            if (typeof arg === "string") {
                const a = document.createElement("a");

                a.href = arg;

                return await this.fetch(new URL(a));
            }

            if (arg instanceof URL) {
                return await lfetch(arg.href, this.options);
            }

            throw new TypeError(
                `Invalid argment of type ${typeof arg} passed to Loader class "fetch" method.`
            );
        }

        async load(arg, el) {
            if (Array.isArray(arg)) {
                return await arg.map((a) => this.load(a, el));
            }

            const blob = await this.fetch(arg);

            return await lload(blob, el);
        }
    }

    return Loader;

})));

//# sourceMappingURL=loader.js.map
