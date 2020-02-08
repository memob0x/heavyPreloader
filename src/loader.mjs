const FetchModes = {
    CORS: "cors",
    NOCORS: "no-cors"
};

const defaults = {
    mode: FetchModes.NOCORS
};

/**
 *
 * @param data
 */
const loadStylesheet = data => {
    const sheet = new CSSStyleSheet();

    const url = data.blob.url ? URL.createObjectURL(data.blob) : data.url;

    const promise = sheet
        .replace(`@import url("${url}")`)
        .finally(() => URL.revokeObjectURL(url));

    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

    return promise;
};

/**
 *
 * @param data
 */
const loadScript = data =>
    new Promise((resolve, reject) => {
        const script = document.createElement("script");

        const url = data.blob.url ? URL.createObjectURL(data.blob) : data.url;

        script.src = url;
        script.async = true;

        document.head.appendChild(script);

        URL.revokeObjectURL(url);

        resolve(script);
    });

/**
 *
 * @param target
 * @param data
 */
const loadImage = data => {
    /* TODO const targets = [...document.querySelectorAll("img")].filter(target => {
        const attrs = target.attributes;

        for (var i = attrs.length - 1; i >= 0; i--) {
            if (attrs[i].value === data.url) {
                return true;
            }
        }

        return false;
    });

    if (!targets.length) {
        return Promise.reject();
    }

    const url = data.blob.url ? URL.createObjectURL(data.blob) : data.url;
    let i = 0;

    const promise = new Promise((resolve, reject) => {
        targets.forEach(target => {
            target.onload = () => i++;
            target.onerror = () => i++;

            target.src = url;
        });

        if (i === targets.length) {
            resolve();
        }

        // TODO : reject
    });

    promise.finally(() => URL.revokeObjectURL(url));

    return promise; */
};

export class Loader {
    /**
     *
     * @param {object} options
     */
    constructor(options = {}) {
        this._options = {
            ...options,
            ...defaults
        };
    }

    /**
     * @param {string} url
     * @returns {Promise}
     */
    fetch = url =>
        new Promise((resolve, reject) => {
            try {
                const worker = new Worker("../src/loader.worker.mjs");

                worker.postMessage({
                    url: url,
                    options: {
                        mode: (mode =>
                            mode === FetchModes.CORS ||
                            mode === FetchModes.NOCORS
                                ? mode
                                : defaults.mode)(this._options.mode)
                    }
                });

                worker.addEventListener("message", event => {
                    let data = event.data;

                    if (data.status !== 200 && data.responseType !== "opaque") {
                        reject(new Error(`${data.statusText} ${data.url}`));

                        return;
                    }

                    switch (data.blobType) {
                        case "text/css":
                            data.load = () => loadStylesheet(data);
                            break;

                        case "application/javascript":
                            data.load = () => loadScript(data);
                            break;

                        case "image/jpeg":
                        case "image/png":
                        case "image/svg+xml":
                            data.load = () => loadImage(data);
                            break;

                        default:
                            data.load = () =>
                                Promise.reject("Not recognized blabla");
                            break;
                    }

                    resolve(data);
                });
            } catch (e) {
                reject(e);
            }
        });

    static appendScript() {}
}

const loader = new Loader();

[...document.querySelectorAll("img[data-src]")].forEach(el =>
    loader
        .fetch(el.dataset.src)
        .then(x => x.load())
        .catch(e => console.error(e))
);

loader
    .fetch("../demo/dist/styles.css")
    .then(x => x.load())
    .catch(e => console.error(e));
loader
    .fetch("../demo/dist/extra.css")
    .then(x => x.load())
    .catch(e => console.error(e));

loader
    .fetch("../demo/dist/scripts.js")
    .then(x => x.load())
    .catch(e => console.error(e));

loader
    .fetch("../non/existent.js")
    .then(x => console.log(x))
    .catch(e => console.error(e));
