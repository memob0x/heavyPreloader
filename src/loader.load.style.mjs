import { ILoad } from "./loader.load.interface.mjs";

/**
 *
 * @param url
 */
export const loadStyle = url => {
    const proxy = document.createElement("link");

    proxy.rel = "stylesheet";

    const promise = ILoad({
        url: url,
        proxy: proxy,
        attr: "href"
    });

    document.head.appendChild(proxy);

    proxy.disabled = "disabled";

    promise.then(() => document.head.removeChild(proxy));

    return promise;
};
