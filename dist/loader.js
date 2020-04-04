(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Loader', factory) :
    (global = global || self, global.Loader = factory());
}(this, (function () { 'use strict';

    const getURL = (href) =>
        new URL(
            ((a) => {
                a.href = href;

                return a;
            })(document.createElement("a"))
        );

    const createWorker = (work) => {
        if (typeof work !== "function") {
            throw new TypeError(
                `Invalid argment of type ${typeof work} passed to Loader class internal "createWorker" function.`
            );
        }

        const url = URL.createObjectURL(
            new Blob(["(", work.toString(), ")()"], {
                type: "application/javascript",
            })
        );

        const worker = new Worker(url);

        URL.revokeObjectURL(url);

        return worker;
    };

    const work = () => {
        onmessage = async (event) => {
            const data = event.data;

            let message;
            try {
                const response = await fetch(data.href, data.options);
                const blob = await response.blob();

                message = {
                    status: response.status,
                    statusText: response.statusText,
                    blob: blob,
                };
            } catch (e) {
                message = {
                    status: 0,
                    statusText: e,
                };
            }

            message.href = data.href;
            postMessage(message);
        };
    };

    let worker = null;

    const getOrCreateWorker = () =>
        worker ? worker : (worker = createWorker(work));

    const cache = {};

    var fetch$1 = async (href, options = {}) => {
        if (href in cache) {
            return await cache[href];
        }

        return (cache[href] = new Promise((resolve, reject) => {
            const worker = getOrCreateWorker();

            worker.postMessage({
                href: href,
                options: options.fetch,
            });

            worker.addEventListener("message", (event) => {
                const data = event.data;

                if (data.href !== href) {
                    return;
                }

                if (data.status === 200) {
                    resolve(data.blob);

                    return;
                }

                reject(new Error(`${data.statusText} for ${data.href} resource.`));
            });
        }));
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
                return await this.fetch(getURL(arg));
            }

            if (arg instanceof URL) {
                return await fetch$1(arg.href, this.options);
            }

            throw new TypeError(
                `Invalid argment of type ${typeof arg} passed to Loader class "fetch" method.`
            );
        }

        async load(arg, el) {
            if (Array.isArray(arg)) {
                return await arg.map((a) => this.load(a));
            }

            const blob = await this.fetch(arg);

            switch (blob.type) {
                case "image/png":
                case "image/jpeg":
                    el = undefined === el ? new Image() : el;

                    const imageUrl = URL.createObjectURL(blob);

                    await new Promise((resolve, reject) => {
                        el.onload = resolve;
                        el.onerror = reject;

                        el.src = imageUrl;
                    });

                    URL.revokeObjectURL(imageUrl);

                    return el;

                case "text/html":
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();

                        reader.addEventListener("loadend", (load) =>
                            resolve(load.srcElement.result)
                        );


                        reader.readAsText(blob);
                    });

                case "text/css":
                    el = undefined === el ? document : el;

                    const styleUrl = URL.createObjectURL(blob);

                    const sheet = new CSSStyleSheet();

                    await sheet.replace(`@import url("${styleUrl}")`);

                    URL.revokeObjectURL(styleUrl);

                    if ("adoptedStyleSheets" in el) {
                        el.adoptedStyleSheets = [...el.adoptedStyleSheets, sheet];
                    }

                    return sheet;

                case "text/javascript":
                    const jsUrl = URL.createObjectURL(blob);

                    const result = await import(jsUrl);

                    URL.revokeObjectURL(jsUrl);

                    return result;
            }

            throw new TypeError(
                `Invalid argment of type ${typeof arg} passed to Loader class "fetch" method.`
            );
        }
    }

    return Loader;

})));

//# sourceMappingURL=loader.js.map
