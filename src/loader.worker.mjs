import { createWorker } from "./loader.utils.mjs";

export const work = () => {
    onmessage = async event => {
        const data = event.data;

        let message;
        try {
            const response = await fetch(data.href, data.options);
            const blob = await response.blob();

            message = {
                status: response.status,
                statusText: response.statusText,
                blob: blob
            };
        } catch (e) {
            message = {
                status: 0,
                statusText: e
            };
        }

        message.href = data.href;
        postMessage(message);
    };
};

let worker = null;

export default () => {
    if (worker) {
        return worker;
    }

    return (worker = createWorker(work));
};
