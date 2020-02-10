import {
    parseUrl,
    urlFromDataObject,
    getLoaderTypeFromUrl,
    isCORSUrl
} from "./loader.utils.mjs";
import * as Loaders from "./loader.loaders.mjs";
import worker from "./loader.worker.mjs";

const loader = function() {
    let args = [...arguments];
    const name = args[0];

    args.shift();

    args[0] = urlFromDataObject(args[0]);

    return Loaders[name]
        .apply(this, args)
        .finally(() => URL.revokeObjectURL(args[0]));
};

export default class Loader {
    /**
     *
     * @param {object} options
     */
    constructor(options = {}) {
        this._options = { ...options, ...{} };

        const url = URL.createObjectURL(
            new Blob(["(", worker.toString(), ")()"], {
                type: "application/javascript"
            })
        );

        this.worker = new Worker(url);

        URL.revokeObjectURL(url);
    }

    /**
     *
     * @param {string} url
     * @returns {Promise}
     */
    fetch(url) {
        const parsedUrl = parseUrl(url);

        url = parsedUrl.href;

        return new Promise((resolve, reject) => {
            if (isCORSUrl(parsedUrl)) {
                const type = getLoaderTypeFromUrl(url);

                if (type in Loaders) {
                    return Loaders[type](url)
                        .then(() =>
                            resolve({
                                response: {
                                    url: url,
                                    status: 200
                                },
                                blob: {
                                    type: null
                                }
                            })
                        )
                        .catch(reject);
                }

                reject(new Error("cors whatev"));

                return;
            }

            this.worker.postMessage(url);

            this.worker.addEventListener("message", event => {
                const data = event.data;

                if (data.url !== url) {
                    return;
                }

                if (data.response.status === 200) {
                    resolve(data);

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
     * @param data
     * @param el
     */
    static adoptStyleSheet(data) {
        return loader("style", data, document);
    }

    /**
     *
     * @param data
     */
    static insertScript(data) {
        return loader("script", data, document.createElement("script"));
    }

    /**
     *
     * @param data
     * @param el
     * @param name
     */
    static setImageAttribute(data, el, name = "src") {
        return loader("image", data, name, el);
    }

    /**
     *
     * @param data
     * @param el
     * @param name
     */
    static setMediaAttribute(data, el, name = "src") {
        return loader("media", data, name, el);
    }
}
