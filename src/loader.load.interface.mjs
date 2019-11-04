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
    error: "onerror"
};

export const ILoad = (options = defaults) =>
    new Promise((resolve, reject) => {
        options = { ...defaults, ...options };

        options.proxy[options.success] = () => resolve(options.url);
        options.proxy[options.error] = message => reject(new Error(message));

        options.proxy[options.attr] = options.url;
    });
