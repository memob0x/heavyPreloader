import { IMediaLoad } from "./loader.load.interface.media.mjs";

/**
 *
 * @param url
 */
export const loadVideo = url =>
    IMediaLoad({
        url: url,
        tag: document.createElement("video")
    });
