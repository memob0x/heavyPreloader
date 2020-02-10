export default () => {
    onmessage = async event => {
        const url = event.data;

        const response = await fetch(url);
        const blob = await response.blob();

        postMessage({
            url: url,
            response: {
                url: response.url,
                status: response.status,
                statusText: response.statusText
            },
            blob: blob
        });
    };
};
