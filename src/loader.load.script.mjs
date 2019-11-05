import { ILoad } from "./loader.load.interface.mjs";

/**
 *
 * @param url
 */
export const loadScript = url => {
    const proxy = document.createElement("object");

    proxy.width = 0;
    proxy.height = 0;

    const promise = ILoad({
        url: url,
        proxy: proxy,
        attr: "data"
    });

    document.body.appendChild(proxy);

    promise.finally(() => document.body.removeChild(proxy));

    return promise;
};
