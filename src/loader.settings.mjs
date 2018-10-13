export const supportedExtensions = {
    image: ['jp[e]?g', 'jpe', 'jif', 'jfif', 'jfi', 'gif', 'png', 'tif[f]?', 'bmp', 'dib', 'webp', 'ico', 'cur', 'svg'],
    audio: ['mp3', 'ogg', 'oga', 'spx', 'ogg', 'wav'],
    video: ['mp4', 'ogg', 'ogv', 'webm']
};
export const supportedTags = {
    image: ['img', 'picture'],
    audio: ['audio'],
    video: ['video'],
    other: ['iframe'] // TODO: ...
};

export const supportedTypes = Object.keys(supportedExtensions);
export const allSupportedTags = [...new Set(Object.values(supportedTags).reduce((a, b) => a.concat(b)))];
