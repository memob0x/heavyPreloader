import css from "./loader.load.css.mjs";
import html from "./loader.load.html.mjs";
import image from "./loader.load.image.mjs";
import javascript from "./loader.load.javascript.mjs";

/**
 *
 * @param {Blob} blob
 * @param {Object} options
 */
export default async (blob, options) => {
    //...
    // TODO: get all major mimetypes
    switch (blob.type) {
        //...
        case "image/png":
        case "image/jpeg":
            return await image(blob, options);

        //...
        case "text/html":
            return await html(blob, options);

        //...
        case "text/css":
            return await css(blob, options);

        //...
        case "text/javascript":
            return await javascript(blob);
    }

    // ...
    throw new TypeError(
        `Invalid argment of type ${typeof blob} passed to Loader class "fetch" method.`
    );
};
