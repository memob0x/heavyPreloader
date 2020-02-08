const guessType = url => {
    if (url.endsWith("jpg")) {
        return "image/jpeg";
    }
};

self.addEventListener("message", async event => {
    const data = event.data;

    const response = await fetch(data.url, data.options);

    const blob = await response.blob();

    self.postMessage({
        responseType: response.type,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,

        redirected: response.redirected,

        url: response.url || data.url,
        blob: blob,
        blobType: blob.type || guessType(data.url)
    });
});
