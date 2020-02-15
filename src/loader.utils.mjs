import LoaderResource from "./loader.resource.mjs";

/**
 *
 * @param {String|LoaderResource} url
 * @returns {URL}
 */
export const getURL = arg => {
    arg = LoaderResource.isLoaderResource(arg) ? arg.url : arg;
    arg = typeof arg === "object" && "href" in arg ? arg.href : arg;

    const a = document.createElement("a");
    a.href = arg;

    return new URL(a);
};

/**
 *
 * @param {Function} work
 * @returns {Worker}
 */
export const createWorker = work => {
    work = typeof work !== "function" ? () => {} : work;

    const url = URL.createObjectURL(
        new Blob(["(", work.toString(), ")()"], {
            type: "application/javascript"
        })
    );

    const worker = new Worker(url);

    URL.revokeObjectURL(url);

    return worker;
};

/**
 * TODO: do it
 * @param {String|LoaderResource} arg
 */
export const getLoaderType = arg => {
    arg = getURL(arg).href;

    let ext = arg.split(".");
    ext = ext[ext.length - 1];

    switch (ext) {
        case "jpg":
            return "image";
        case "css":
            return "style";
        case "js":
            return "script";
        default:
            return "noop";
    }
};

/**
 *
 * @param {URL|String|LoaderResource} arg
 * @returns {Boolean}
 */
export const isCORS = arg => {
    arg = getURL(arg);

    return (
        arg.hostname !== window.location.hostname ||
        arg.protocol !== window.location.protocol
    );
};

/**
 *
 * @param {LoaderResource} resource
 * @returns {Boolean}
 */
export const hasBlob = resource =>
    LoaderResource.isLoaderResource(resource) && !!resource.blob.type;
