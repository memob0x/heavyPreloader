import { ILoad } from "./loader.load.interface.mjs";

/**
 *
 * @param url
 */
export const loadImage = url =>
    ILoad({
        url: url,
        proxy: document.createElement("img")
    });
