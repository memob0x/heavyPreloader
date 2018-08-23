import { generateInstanceID } from './loader.utils';

export const pluginInstance = generateInstanceID();
export const eventNamespaceParserSeparator = '__namespace__';

export const supportedExtensions = {
    image: 'jp[e]?g|jpe|jif|jfif|jfi|gif|png|tif[f]?|bmp|dib|webp|ico|cur|svg',
    audio: 'mp3|ogg|oga|spx|ogg|wav',
    video: 'mp4|ogv|webm'
};

export const supportedTags = {
    image: 'img|picture|source',
    audio: 'audio|source',
    video: 'video|source'
};
