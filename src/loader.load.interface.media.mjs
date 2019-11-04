import { ILoad } from "./loader.load.interface.mjs";

const defaults = {
    url: "",
    proxy: null
};

/**
 *
 * @param url
 * @param tag
 */
export const IMediaLoad = (options = defaults) =>
    ILoad({
        ...{ ...options, ...defaults },
        ...{ success: "onloadedmetadata" }
    });
