export const loadStyle = url =>
    new Promise((resolve, reject) => {
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

        // TODO: reject(new Error("?"))

        document.querySelector("head").appendChild(proxy);
    });
