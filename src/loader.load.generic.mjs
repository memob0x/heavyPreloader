/**
 *
 * @param url
 * @param tag
 * @param successMethod
 * @param errorMethod
 * @param parentTarget
 */
export const loadGeneric = (
    url,
    tag,
    successMethod = "onload",
    errorMethod = "onerror",
    parentTarget
) =>
    new Promise((resolve, reject) => {
        const proxy = document.createElement(tag);

        proxy[successMethod] = () => resolve(url);
        proxy[errorMethod] = (message, source, lineno, colno, error) =>
            reject(error);

        proxy.src = url;

        if (parentTarget) {
            parentTarget.appendChild(proxy);
        }
    });
