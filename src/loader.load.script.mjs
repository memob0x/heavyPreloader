import { loadGeneric } from "./loader.load.generic.mjs";

/**
 *
 * @param url
 */
export const loadScript = url =>
    loadGeneric(
        url,
        "script",
        "onloaded",
        "onError",
        document.querySelector(appendTarget)
    );
