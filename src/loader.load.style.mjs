import { head } from "./loader.client.mjs";
import { ILoad } from "./loader.load.interface.mjs";

/**
 *
 * @param url
 */
export const loadStyle = url =>
    ILoad({
        url: url,
        proxy: (() => {
            const link = document.createElement("link");

            link.rel = "stylesheet";

            return link;
        })(),
        attr: "href",
        host: head
    });

// TODO: check ff?
/* new Promise((resolve, reject) => {
        const proxy = document.createElement("style");

        proxy.textContent = '@import "' + url + '"';

        const loop = () =>
            window.requestAnimationFrame(() => {
                if (proxy.sheet.cssRules) {
                    resolve(url);

                    return;
                }

                loop();
            });

        loop();

        // TODO: reject(new Error("?"))

        head.appendChild(proxy);
    }); */
