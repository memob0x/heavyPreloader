export default () => {
    onmessage = async event => {
        let data = event.data;

        try {
            const response = await fetch(data.url);
            const blob = await response.blob();

            data.response = {
                url: response.url,
                status: response.status,
                statusText: response.statusText
            };

            data.blob = blob;
        } catch (e) {
            data.response = {
                url: data.url,
                status: 200
            };

            data.blob = { type: null };
        }

        postMessage(data);
    };
};
