import { head } from "./loader.client.mjs";
import { ILoad } from "./loader.load.interface.mjs";

/**
 *
 * @param url
 */
export const loadScript = url =>
    ILoad({
        url: url,
        proxy: document.createElement("script"),
        host: head
    });
