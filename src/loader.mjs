import { getURL } from "./loader.utils.mjs";
import fetch from "./loader.fetch.mjs";

export default class Loader {
    /**
     *
     * @param {Object} options
     */
    constructor(options) {
        this.options = {
            ...{ fetch: { cors: "no-cors" } },
            ...options,
        };
    }

    /**
     *
     * @param {Array.<String>|Array.<URL>|String|URL} arg
     * @returns {Array.<Promise>|Promise}
     */
    async fetch(arg) {
        // ...
        if (Array.isArray(arg)) {
            return await arg.map((a) => this.fetch(a));
        }

        // ...
        if (typeof arg === "string") {
            return await this.fetch(getURL(arg));
        }

        // ...
        if (arg instanceof URL) {
            return await fetch(arg.href, this.options);
        }

        // ...
        throw new TypeError(
            `Invalid argment of type ${typeof arg} passed to Loader class "fetch" method.`
        );
    }

    /**
     *
     * @param {Array.<String>|Array.<URL>|String|URL} arg
     * @returns {Array.<Promise>|Promise}
     */
    async load(arg, el) {
        // ...
        if (Array.isArray(arg)) {
            return await arg.map((a) => this.load(a));
        }

        // ...
        const blob = await this.fetch(arg);

        //...
        switch (blob.type) {
            //...
            case "image/png":
            case "image/jpeg":
                //
                el = undefined === el ? new Image() : el;

                //
                const imageUrl = URL.createObjectURL(blob);

                //
                await new Promise((resolve, reject) => {
                    el.onload = resolve;
                    el.onerror = reject;

                    el.src = imageUrl;
                });

                //
                URL.revokeObjectURL(imageUrl);

                //
                return el;

            //...
            case "text/html":
                return new Promise((resolve, reject) => {
                    //
                    const reader = new FileReader();

                    //
                    reader.addEventListener("loadend", (load) =>
                        resolve(load.srcElement.result)
                    );

                    // TODO: error?

                    //
                    reader.readAsText(blob);
                });

            //...
            case "text/css":
                //
                el = undefined === el ? document : el;

                //
                const styleUrl = URL.createObjectURL(blob);

                //
                const sheet = new CSSStyleSheet();

                //
                await sheet.replace(`@import url("${styleUrl}")`);

                //
                URL.revokeObjectURL(styleUrl);

                //
                if ("adoptedStyleSheets" in el) {
                    el.adoptedStyleSheets = [...el.adoptedStyleSheets, sheet];
                }

                //
                return sheet;

            //...
            case "text/javascript":
                //
                const jsUrl = URL.createObjectURL(blob);

                //
                const result = await import(jsUrl);

                //
                URL.revokeObjectURL(jsUrl);

                //
                return result;
        }

        // ...
        throw new TypeError(
            `Invalid argment of type ${typeof arg} passed to Loader class "fetch" method.`
        );
    }
}
