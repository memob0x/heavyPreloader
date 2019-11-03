import { loadStyle } from "./loader.load.style.mjs";
import { loadScript } from "./loader.load.script.mjs";
import { loadImage } from "./loader.load.image.mjs";
import { loadAudio, loadVideo } from "./loader.load.audio-video.mjs";
import { parseResource } from "./loader.resource-parser.mjs";

const loaders = {
    image: loadImage,
    audio: loadAudio,
    video: loadVideo,
    style: loadStyle,
    script: loadScript
};

export const load = resource =>
    new Promise((resolve, reject) => {
        try {
            resource = parseResource(resource);
        } catch (e) {
            reject(e);
        }

        loaders[resource.type](resource.url)
            .then(resolve)
            .catch(reject);
    });
