(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('Loader', ['exports'], factory) :
    (global = global || self, factory(global.Loader = {}));
}(this, (function (exports) { 'use strict';

    /**
     *
     * @param url
     */
    const parseUrl = url => {
        const a = document.createElement("a");
        a.href = url;
        return a;
    };

    /**
     *
     * @param data
     */
    const urlFromDataObject = data =>
        data.blob.type ? URL.createObjectURL(data.blob) : data.response.url;

    /**
     * TODO: do it
     * @param url
     */
    const getLoaderTypeFromUrl = url => "image";

    /**
     *
     * @param url
     */
    const isCORSUrl = url => url.host !== window.location.host;

    const image = (url, attributeName = "src", el = new Image()) =>
        new Promise((resolve, reject) => {
            el.onload = resolve;
            el.onerror = reject;

            el.setAttribute(attributeName, url);
        });

    const style = (url, el = document.createElement("div")) => {
        const sheet = new CSSStyleSheet();

        const promise = sheet.replace(`@import url("${url}")`);

        if ("adoptedStyleSheets" in el) {
            el.adoptedStyleSheets = [...el.adoptedStyleSheets, sheet];
        }

        return promise;
    };

    const object = (url, el) =>
        new Promise((resolve, reject) => {
            el.onload = resolve;
            el.onerror = reject;

            el.data = preload[i];

            el.width = 0;
            el.height = 0;

            document.body.append(el);
        });

    const script = (url, el = document.createElement("object")) =>
        el.tagName === "OBJECT"
            ? object(url, el)
            : new Promise((resolve, reject) => {
                  el.onload = resolve;
                  el.onerror = reject;

                  el.src = url;
                  el.async = true;

                  document.head.append(el);
              });

    var Loaders = /*#__PURE__*/Object.freeze({
        __proto__: null,
        image: image,
        style: style,
        script: script
    });

    var worker = () => {
        onmessage = async event => {
            let data = event.data;

            try {
                const response = await fetch(data.url);
                const blob = await response.blob();

                data.response = {
                    url: response.url,
                    status: response.status,
                    statusText: response.statusText
                };

                data.blob = blob;
            } catch (e) {
                data.response = {
                    url: data.url,
                    status: 200
                };

                data.blob = { type: null };
            }

            postMessage(data);
        };
    };

    class Loader {
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

            return style(url, document).finally(() =>
                URL.revokeObjectURL(url)
            );
        }

        /**
         *
         * @param data
         */
        static insertScript(data) {
            const url = urlFromDataObject(data);

            return script(
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

            return image(url, name, el).finally(() =>
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

    exports.Loader = Loader;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=loader.js.map
