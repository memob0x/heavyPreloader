import { IMediaLoad } from "./loader.load.interface.media.mjs";

/**
 *
 * @param url
 */
export const loadVideo = url =>
    IMediaLoad({
        url: url,
        proxy: document.createElement("video")
    });
