define(function () { 'use strict';

    const a = document.createElement("a");

    /**
     *
     * @param {String} path
     * @returns {URL}
     */
    const getURL = (path) => {
        a.href = path;

        return new URL(a.href);
    };

    /**
     *
     * @private
     * @static
     * TODO: provide unit test
     */
    const createDynamicWorker = (body) => {
        // ...
        const url = URL.createObjectURL(
            new Blob(["(", body.toString(), ")()"], {
                type: "application/javascript"
            })
        );

        // ...
        const worker = new Worker(url);

        // ...
        URL.revokeObjectURL(url);

        // ...
        return worker;
    };

    /**
     *
     * @private
     * @static
     * TODO: provide unit test
     */
    const createFetchWorker = () =>
        createDynamicWorker(
            () =>
                (onmessage = async (event) => {
                    //
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

                    // ...
                    postMessage(event.data);
                })
        );

    /**
     *
     */
    var lworker = new (class LoaderWorker {
        constructor() {
            this._worker = null;

            this._requests = 0;
        }

        terminate() {
            //
            //
            if (this._requests > 0) {
                this._requests--;
            }

            //
            if (this._requests === 0) {
                this._worker.terminate();

                this._worker = null;
            }

            //
            return this._worker;
        }

        worker() {
            // ...
            this._requests++;

            // ...
            if (this._worker) {
                return this._worker;
            }

            // ...
            this._worker = createFetchWorker();

            //
            return this._worker;
        }
    })();

    /**
     *
     */
    var lfetch = new (class LoaderFetch {
        constructor() {
            // ...
            this.cache = {};
        }

        /**
         * Fetches a resource url in the secondary thread and retrieves it as a blob
         * @private
         * @param {String} href The resource url to be fetched
         * @param {Object} options The fetch options object
         * @returns {Promise} The fetch promise
         */
        async fetch(href, options) {
            // ...
            options = {
                ...{
                    cache: true,
                    fetch: {}
                },
                ...options
            };

            // ...
            if (options.cache === true && href in this.cache) {
                return await this.cache[href];
            }

            // ...
            return (this.cache[href] = new Promise((resolve, reject) => {
                //
                const worker = lworker.worker();

                // ...
                worker.postMessage({
                    href: href,
                    options: options.fetch
                });

                // ...
                // TODO: possibly use messageerror for reject?
                worker.addEventListener("message", (event) => {
                    const data = event.data;

                    // ...
                    if (data.href !== href) {
                        return;
                    }

                    //
                    lworker.terminate();

                    // ...
                    if (data.status === 200) {
                        resolve(data.blob);

                        return;
                    }

                    // ...
                    reject(
                        new Error(`${data.statusText} for ${data.href} resource.`)
                    );
                });
            }));
        }
    })();

    /**
     *
     */
    var lload = new (class LoaderLoad {
        constructor() {
            // loaders closure, filled with default loaders
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
            this.loaders = {};
        }

        /**
         *
         * @param {String} type
         * @param {Function} loader
         * @returns {void}
         */
        register(type, loader) {
            this.loaders[type] = loader;
        }

        /**
         * Loads a resource, which usually consists in attaching it to an existent DOM element
         * @private
         * @param {Blob} blob The resource to be loaded in Blob form
         * @param {Object} options The resource load options
         * @returns {Promise} The resource load in promise form
         */
        async load(blob, options) {
            const type = blob.type;

            //...
            const keys = type.split("/").reduce((x, y) => [type, x, y]);

            // ...
            for (const key in keys) {
                const loader = keys[key];

                if (loader in this.loaders) {
                    return await this.loaders[loader](blob, options);
                }
            }

            // ...
            throw new TypeError(
                `Invalid ${blob.type} media type passed to Loader class "load" method.`
            );
        }
    })();

    class Loader {
        constructor() {}

        /**
         * Fetches one or more resources url
         * @param {Array.<String>|Array.<URL>|String|URL} resource The resource(s) url to be fetched in a separate thread
         * @param {Object} options The fetch options object
         * @returns {Array.<Promise>|Promise} The fetch promise(s)
         */
        async fetch(resource, options) {
            // ...
            if (Array.isArray(resource)) {
                return await resource.map((a) => this.fetch(a, options));
            }

            // ...
            if (typeof resource === "string") {
                return await this.fetch(getURL(resource), options);
            }

            // ...
            if (resource instanceof URL) {
                return await lfetch.fetch(resource.href, options);
            }

            // ...
            throw new TypeError(
                `Invalid argment of type ${typeof resource} passed to Loader class "fetch" method.`
            );
        }

        /**
         * Loads one or more resources url considering the passed options object and the resource mime type to be loaded
         * @param {Array.<String>|Array.<URL>|Array.<Blob>|String|URL|Blob} resource The resource(s) to be loaded
         * @param {Object} options The loader type options
         * @returns {Array.<Promise>|Promise} The load promise(s)
         */
        async load(resource, options) {
            // ...
            if (Array.isArray(resource)) {
                const isArrayOpts = Array.isArray(options);

                return await resource.map((a, i) =>
                    this.load(a, isArrayOpts ? options[i] : options)
                );
            }

            // ...
            const blob =
                resource instanceof Blob
                    ? resource
                    : await this.fetch(resource, options);

            // ...
            return await lload.load(blob, options);
        }

        /**
         *
         * @param {String} type
         * @param {Function} loader
         * @returns {void}
         */
        register(type, loader) {
            return lload.register(type, loader);
        }
    }

    return Loader;

});
//# sourceMappingURL=loader.amd.js.map
