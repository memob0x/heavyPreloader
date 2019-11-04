import { IMediaLoad } from "./loader.load.interface.media.mjs";

/**
 *
 * @param url
 */
export const loadAudio = url =>
    IMediaLoad({
        url: url,
        proxy: document.createElement("audio")
    });
