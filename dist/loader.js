(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Loader', factory) :
    (global = global || self, global.Loader = factory());
}(this, (function () { 'use strict';

    /**
     *
     * @param {Object} o
     * @param {String} p
     */
    const prop = (o, p) =>
        p.split(".").reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o);

    /**
     *
     * @param {String|LoaderResource} url
     * @returns {URL}
     */
    const getURL = arg => {
        arg = prop(arg, "url") || arg;
        arg = prop(arg, "href") || arg;

        const a = document.createElement("a");
        a.href = arg;

        return new URL(a);
    };

    /**
     *
     * @param {HTMLElement} el
     * @returns {Boolean}
     */
    const isSupportedElement = el => {
        return (
            el instanceof HTMLImageElement ||
            el instanceof HTMLPictureElement ||
            el instanceof HTMLSourceElement ||
            el instanceof HTMLVideoElement ||
            el instanceof HTMLAudioElement
        );
    };

    /**
     *
     * @param {Function} work
     * @returns {Worker}
     */
    const createWorker = work => {
        work = typeof work !== "function" ? () => {} : work;

        const url = URL.createObjectURL(
            new Blob(["(", work.toString(), ")()"], {
                type: "application/javascript"
            })
        );

        const worker = new Worker(url);

        URL.revokeObjectURL(url);

        return worker;
    };

    /**
     * TODO: check
     * @param {String|LoaderResource} arg
     */
    const getLoaderType = arg => {
        arg = getURL(arg).href;

        let ext = arg.split(".");
        ext = ext[ext.length - 1];

        switch (ext) {
            case "jpg":
            case "jpe":
            case "jpeg":
            case "jif":
            case "jfi":
            case "jfif":
            case "gif":
            case "tif":
            case "tiff":
            case "bmp":
            case "dib":
            case "webp":
            case "ico":
            case "cur":
            case "svg":
            case "png":
                return "image";
            case "css":
                return "style";
            case "js":
            case "mjs":
                return "script";
            case "mp3":
            case "ogg":
            case "oga":
            case "spx":
            case "ogg":
            case "wav":
            case "mp4":
            case "ogg":
            case "ogv":
            case "webm":
                return "media";
            default:
                return "noop";
        }
    };

    /**
     *
     * @param {URL|String|LoaderResource} arg
     * @returns {Boolean}
     */
    const isCORS = arg => {
        arg = getURL(arg);

        return (
            arg.hostname !== window.location.hostname ||
            arg.protocol !== window.location.protocol
        );
    };

    // ...
    const collection = new WeakMap();

    // ...
    const build = data => {
        let o = {};

        if (isSupportedElement(data)) {
            o.el = data;
            o.url = getURL(prop(o.el, "dataset.src")); // TODO: find a way to get currentSrc without triggering load
        } else {
            o.el = prop(data, "el");
            o.url = data instanceof URL ? data : prop(data, "url");
        }

        o.blob = prop(data, "blob");

        return o;
    };

    // ...
    // TODO: refactor to avoid "override" param
    class LoaderResource {
        constructor(data, override) {
            let o = build(data);

            if (collection.has(o.url) && !override) {
                o = collection.get(o.url);
            }

            if (collection.has(o.el) && !override) {
                o = collection.get(o.el);
            }

            this.el = o.el;
            this.url = o.url;
            this.blob = o.blob;

            collection.set(o.el || o.url, this);
        }

        static isLoaderResource(data) {
            return data instanceof this;
        }
    }

    const loadImage = (url, el = new Image()) =>
        new Promise((resolve, reject) => {
            el.onload = () => resolve(el);
            el.onerror = reject;

            el.src = url;
        });

    const loadMedia = (url, el = new Image()) =>
        // TODO:
        new Promise((resolve, reject) => {
            el.onload = () => resolve(el);
            el.onerror = reject;

            el.src = url;
        });

    const loadStyle = (url, el = document.createElement("div")) => {
        const sheet = new CSSStyleSheet();

        const promise = sheet.replace(`@import url("${url}")`);

        if ("adoptedStyleSheets" in el) {
            el.adoptedStyleSheets = [...el.adoptedStyleSheets, sheet];
        }

        return promise;
    };

    const loadObject = (url, el = document.createElement("object")) =>
        new Promise((resolve, reject) => {
            // TODO: check
            el.onload = () => resolve(el);
            el.onerror = reject;

            el.data = url;

            el.width = 0;
            el.height = 0;

            document.body.append(el);
        });

    const loadScript = (url, el = document.createElement("script")) =>
        new Promise((resolve, reject) => {
            // TODO: check
            el.onload = () => resolve(el);
            el.onerror = reject;

            el.src = url;
            el.async = true;

            document.head.append(el);
        });

    var Loaders = {
        image: (url, bool, el) => loadImage(url, bool ? el : void 0),
        media: (url, bool, el) => loadMedia(url, bool ? el : void 0),
        script: (url, bool) => (bool ? loadScript(url) : loadObject(url)),
        style: (url, bool) => loadStyle(url, bool ? document : void 0)
    };

    const work = () => {
        onmessage = async event => {
            const data = event.data;

            // ...
            let message;
            try {
                const response = await fetch(data.href, data.options);
                const blob = await response.blob();

                message = {
                    status: response.status,
                    statusText: response.statusText,
                    blob: blob
                };
            } catch (e) {
                message = {
                    status: 0,
                    statusText: e
                };
            }

            // ...
            message.href = data.href;
            postMessage(message);
        };
    };

    let worker = null;
    var loaderWorker = () => {
        // ...
        if (worker) {
            return worker;
        }

        // ...
        return (worker = createWorker(work));
    };

    // ...
    const collection$1 = {};

    /**
     *
     * @param {LoaderResource} resource
     * @param {Object} options
     */
    var _fetch = async (resource, options = {}) => {
        // ...
        if (resource.url.href in collection$1) {
            return collection$1[resource.url.href];
        }

        // ...
        if (isCORS(resource) && options.fetch.cors !== "no-cors") {
            return (collection$1[resource.url.href] = _load(
                resource,
                options,
                false
            ));
        }

        // ...
        return (collection$1[resource.url.href] = new Promise((resolve, reject) => {
            const worker = loaderWorker();

            // ...
            worker.postMessage({
                href: resource.url.href,
                options: options.fetch
            });

            // ...
            worker.addEventListener("message", event => {
                const data = event.data;

                // ...
                if (data.href !== resource.url.href) {
                    return;
                }

                // ...
                if (data.status === 200) {
                    resolve(
                        new LoaderResource(
                            {
                                ...resource,
                                ...{
                                    blob: data.blob
                                }
                            },
                            true
                        )
                    );

                    return;
                }

                // ...
                reject(new Error(`${data.statusText} ${data.href}`));
            });
        }));
    };

    /**
     *
     * @param {LoaderResource} resource
     * @param {Object} options
     */
    var _load = async (resource, options, bool) => {
        // ...
        if (!isCORS(resource) || options.fetch.cors === "no-cors") {
            try {
                const el = resource.el;
                resource = await _fetch(resource, options);
                resource.el = el;
            } catch (e) {}
        }

        // ...
        const type = getLoaderType(resource);
        if (!(type in Loaders)) {
            return Promise.reject(new Error("invalid type"));
        }

        // ...
        const url = !!resource.blob
            ? URL.createObjectURL(resource.blob)
            : resource.url.href;

        // ...
        return new Promise((resolve, reject) =>
            Loaders[type](url, bool, resource.el)
                .finally(() => URL.revokeObjectURL(url))
                .then(() => resolve(resource))
                .catch(reject)
        );
    };

    class Loader {
        constructor(options) {
            this.options = {
                ...{
                    fetch: {
                        // this way fetch throws but you don't get double download
                        // TODO: check if opt makes sense
                        cors: "no-cors"
                    }
                },
                ...options
            };
        }

        /**
         *
         * @param {String|Array|LoaderResource|HTMLElement|NodeList} arg
         * @returns {Array|Promise}
         */
        fetch(arg) {
            // ...
            if (arg instanceof NodeList) {
                return this.fetch([...arg]);
            }

            // ...
            if (Array.isArray(arg)) {
                return arg.map(a => this.fetch(a));
            }

            // ...
            if (typeof arg === "string") {
                return this.fetch(getURL(arg));
            }

            // ...
            if (isSupportedElement(arg) || arg instanceof URL) {
                return this.fetch(new LoaderResource(arg));
            }

            // ...
            if (LoaderResource.isLoaderResource(arg)) {
                return _fetch(arg, this.options);
            }

            // ...
            return Promise.reject(new Error("invalid argument"));
        }

        /**
         * @param {String|Array|LoaderResource|HTMLElement|NodeList|URL} arg
         * @returns {Array|Promise}
         */
        load(arg) {
            if (arg instanceof NodeList) {
                return this.load([...arg]);
            }

            // ...
            if (Array.isArray(arg)) {
                return arg.map(a => this.load(a));
            }

            // ...
            if (typeof arg === "string") {
                return this.load(getURL(arg));
            }

            // ...
            if (isSupportedElement(arg) || arg instanceof URL) {
                return this.load(new LoaderResource(arg));
            }

            // ...
            if (LoaderResource.isLoaderResource(arg)) {
                return _load(arg, this.options, true);
            }

            // ...
            return Promise.reject(new Error("invalid argument"));
        }
    }

    return Loader;

})));

//# sourceMappingURL=loader.js.map
