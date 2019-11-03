import { loadGeneric } from "./loader.load.generic.mjs";

/**
 *
 * @param url
 */
const loadAudioVideo = url => loadGeneric(url, "audio", "onloadedmetadata");

/**
 *
 * @param url
 */
export const loadAudio = url => loadAudioVideo(url);
/**
 *
 * @param url
 */
export const loadVideo = url => loadAudioVideo(url);
