import {
    getLoaderType,
    createWorker,
    getURL,
    isCORS
} from "./loader.utils.mjs";
import worker from "./loader.worker.mjs";
import Data from "./loader.data.mjs";
import * as Loaders from "./loader.loaders.mjs";

export default class Loader {
    constructor() {
        this.worker = createWorker(worker);
    }

    /**
     *
     * @param {Array|String} url
     * @returns {Array|Promise}
     */
    fetch(url) {
        // ...
        // --------------------------------------------------------
        if (Array.isArray(url)) {
            return url.map(u => this.fetch.call(this, u));
        }

        // ...
        // --------------------------------------------------------
        const loc = getURL(url);
        url = loc.href;

        if (isCORS(loc)) {
            return this.load(getLoaderType(url), url);
        }

        return new Promise((resolve, reject) => {
            this.worker.postMessage(url);

            this.worker.addEventListener("message", event => {
                const data = event.data;

                if (data.url !== url) {
                    return;
                }

                if (data.response.status === 200) {
                    resolve(new Data(data));

                    return;
                }

                reject(
                    new Error(
                        `${data.response.statusText} ${data.response.url}`
                    )
                );
            });
        });
    }

    /**
     *
     */
    load(...args) {
        const arg = args[0];

        // ...
        // --------------------------------------------------------
        if (Data.isData(arg)) {
            const type = getLoaderType(arg);
            const url = arg.blob.type
                ? URL.createObjectURL(arg.blob)
                : arg.response.url;

            let el = type === "style" ? document : arg;
            el = type === "script" ? document.createElement("script") : el;
            el = args[1] instanceof HTMLElement ? args[1] : el;

            return this.load.call(this, type, url, el);
        }

        // ...
        // --------------------------------------------------------
        if (arg instanceof HTMLElement) {
            const el = arg;

            let url = el.dataset.src;
            if (args.length === 1 && !isCORS(url)) {
                return new Promise((resolve, reject) =>
                    this.fetch(url)
                        .then(data =>
                            this.load
                                .call(this, data, el)
                                .then(resolve)
                                .catch(reject)
                        )
                        .catch(reject)
                );
            }

            let attrs = args[1] || "src";
            attrs = typeof attrs === "string" ? [attrs] : attrs;

            attrs.forEach(attr => (el[attr] = el.dataset[attr]));

            url = el.currentSrc || el.src;

            return this.load.call(this, getLoaderType(url), url);
        }

        // ...
        // --------------------------------------------------------
        if (!(arg in Loaders)) {
            return Promise.reject(new Error("not valid"));
        }

        args.shift();

        return Loaders[arg]
            .apply(this, args)
            .finally(() => URL.revokeObjectURL(args[0]));
    }
}
