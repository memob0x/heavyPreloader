import {
    parseUrl,
    urlFromDataObject,
    getLoaderTypeFromUrl,
    isCORSUrl
} from "./loader.utils.mjs";
import * as Loaders from "./loader.loaders.mjs";
import worker from "./loader.worker.mjs";

export class Loader {
    /**
     *
     * @param {object} options
     */
    constructor(options = {}) {
        this.worker = new Worker(
            URL.createObjectURL(
                new Blob(["(", worker.toString(), ")()"], {
                    type: "application/javascript"
                })
            )
        );

        this._options = { ...options, ...{} };
    }

    /**
     * @param {string} url
     * @returns {Promise}
     */
    fetch(url) {
        const parsedUrl = parseUrl(url);

        url = parsedUrl.href;

        return new Promise((resolve, reject) => {
            try {
                if (isCORSUrl(parsedUrl)) {
                    const type = getLoaderTypeFromUrl(url);

                    const defaultData = {
                        response: {
                            url: url,
                            status: 200
                        },
                        blob: {
                            type: null
                        }
                    };

                    if (type in Loaders) {
                        return Loaders[type](url)
                            .then(() => resolve(defaultData))
                            .catch(reject);
                    }

                    resolve(defaultData);

                    return;
                }

                this.worker.postMessage({
                    url: url
                });

                this.worker.addEventListener("message", event => {
                    const data = event.data;

                    if (data.url !== url) {
                        return;
                    }

                    if (data.response.status !== 200) {
                        reject(
                            new Error(
                                `${data.response.statusText} ${data.response.url}`
                            )
                        );

                        return;
                    }

                    resolve(data);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     *
     * @param data
     * @param el
     */
    static adoptStyleSheet(data) {
        const url = urlFromDataObject(data);

        return Loaders.style(url, document).finally(() =>
            URL.revokeObjectURL(url)
        );
    }

    /**
     *
     * @param data
     */
    static insertScript(data) {
        const url = urlFromDataObject(data);

        return Loaders.script(
            url,
            document.createElement("script")
        ).finally(() => URL.revokeObjectURL(url));
    }

    /**
     *
     * @param data
     * @param el
     * @param name
     */
    static setImageAttribute(data, el, name = "src") {
        const url = urlFromDataObject(data);

        return Loaders.image(url, name, el).finally(() =>
            URL.revokeObjectURL(url)
        );
    }
}

const loader = new Loader();

[...document.querySelectorAll("img[data-src]")].forEach(el =>
    loader
        .fetch(el.dataset.src)
        .then(x => Loader.setImageAttribute(x, el))
        .catch(e => console.error(e))
);

loader
    .fetch("dist/styles.css")
    .then(x => Loader.adoptStyleSheet(x))
    .catch(e => console.error(e));

loader
    .fetch("dist/extra.css")
    .then(x => Loader.adoptStyleSheet(x))
    .catch(e => console.error(e));

loader
    .fetch("dist/scripts.js")
    .then(x => Loader.insertScript(x))
    .catch(e => console.error(e));

loader
    .fetch("dist/not-existent.js")
    .then(x => Loader.insertScript(x))
    .catch(e => console.error(e));
