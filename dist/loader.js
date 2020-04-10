(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Loader', factory) :
    (global = global || self, global.Loader = factory());
}(this, (function () { 'use strict';

    const a = document.createElement("a");

    const getURL = (path) => {
        a.href = path;

        return new URL(a.href);
    };

    const createDynamicWorker = (body) => {
        const url = URL.createObjectURL(
            new Blob(["(", body.toString(), ")()"], {
                type: "application/javascript",
            })
        );

        const worker = new Worker(url);

        URL.revokeObjectURL(url);

        return worker;
    };

    const createFetchWorker = () =>
        createDynamicWorker(
            () =>
                (onmessage = async (event) => {
                    try {
                        const response = await fetch(
                            event.data.href,
                            event.data.options
                        );
                        const blob = await response.blob();

                        event.data.status = response.status;
                        event.data.statusText = response.statusText;
                        event.data.blob = blob;
                    } catch (e) {
                        event.data.statusText = e;
                    }

                    postMessage(event.data);
                })
        );

    var lworker = new (class LoaderWorker {
        constructor() {
            this._worker = null;

            this._requests = 0;
        }

        terminate() {
            if (this._requests > 0) {
                this._requests--;
            }

            if (this._requests === 0) {
                this._worker.terminate();

                this._worker = null;
            }

            return this._worker;
        }

        worker() {
            this._requests++;

            if (this._worker) {
                return this._worker;
            }

            this._worker = createFetchWorker();

            return this._worker;
        }
    })();

    var lfetch = new (class LoaderFetch {
        constructor() {
            this.cache = {};
        }

        async fetch(href, options) {
            options = {
                ...{
                    cache: true,
                    fetch: {},
                },
                ...options,
            };

            if (options.cache === true && href in this.cache) {
                return await this.cache[href];
            }

            return (this.cache[href] = new Promise((resolve, reject) => {
                const worker = lworker.worker();

                worker.postMessage({
                    href: href,
                    options: options.fetch,
                });

                worker.addEventListener("message", (event) => {
                    const data = event.data;

                    if (data.href !== href) {
                        return;
                    }

                    lworker.terminate();

                    if (data.status === 200) {
                        resolve(data.blob);

                        return;
                    }

                    reject(
                        new Error(`${data.statusText} for ${data.href} resource.`)
                    );
                });
            }));
        }
    })();

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

    var lload = new (class LoaderLoad {
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

    class Loader {
        constructor() {}

        async fetch(resource, options) {
            if (Array.isArray(resource)) {
                return await resource.map((a) => this.fetch(a, options));
            }

            if (typeof resource === "string") {
                return await this.fetch(getURL(resource), options);
            }

            if (resource instanceof URL) {
                return await lfetch.fetch(resource.href, options);
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

            return await lload.load(blob, options);
        }

        register(type, loader) {
            return lload.register(type, loader);
        }
    }

    return Loader;

})));

//# sourceMappingURL=loader.js.map
