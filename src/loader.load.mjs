import css from "./loader.load.css.mjs";
import html from "./loader.load.html.mjs";
import image from "./loader.load.image.mjs";
import javascript from "./loader.load.javascript.mjs";

/**
 *
 */
export default new (class LoaderLoad {
    constructor() {
        // loaders closure, filled with default loaders
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
        this.loaders = {
            image: image,
            html: html,
            css: css,
            javascript: javascript,
        };
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
