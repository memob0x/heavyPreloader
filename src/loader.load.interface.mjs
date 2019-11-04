/**
 *
 * @param url
 * @param tag
 * @param success
 * @param error
 * @param parentTarget
 */
const defaults = {
    url: "",
    proxy: null,
    attr: "src",
    success: "onload",
    error: "onerror",
    host: null
};

export const ILoad = (options = defaults) =>
    new Promise((resolve, reject) => {
        options = { ...defaults, ...options };

        options.proxy[options.success] = () => {
            if (options.host) {
                options.host.removeChild(options.proxy);
            }

            resolve(options.url);
        };
        
        options.proxy[options.error] = (
            message,
            source,
            lineno,
            colno,
            error
        ) => reject(error);

        options.proxy[options.attr] = options.url;

        if (!options.host) {
            return;
        }

        options.host.appendChild(options.proxy);

        window.requestAnimationFrame(() => {
            options.proxy.disabled = "disabled";
            options.proxy.hidden = "hidden";
        });
    });
