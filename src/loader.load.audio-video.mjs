const loadAudioVideo = (url, tag) =>
    new Promise((resolve, reject) => {
        const proxy = document.createElement(tag);

        proxy.onloadedmetadata = () => resolve(url);
        proxy.onerror = (message, source, lineno, colno, error) =>
            reject(error);

        proxy.src = url;
    });

export const loadAudio = url => loadAudioVideo(url, "audio");
export const loadVideo = url => loadAudioVideo(url, "video");
