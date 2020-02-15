import Data from "./loader.data.mjs";

/**
 *
 * @param {String|Data} url
 * @returns {URL}
 */
export const getURL = url => {
    url = Data.isData(url) ? url.url : url;
    url = typeof url === "object" && "href" in url ? url.href : url;

    const a = document.createElement("a");
    a.href = url;

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
 * @param {String|Data} url
 */
export const getLoaderType = url => {
    url = getURL(url).href;

    let ext = url.split(".");
    ext = ext[ext.length - 1];
    switch (ext) {
        case "jpg":
            return "image";
        case "css":
            return "style";
        case "js":
            return "script";
    }
};

/**
 *
 * @param {URL|String|Data} location
 * @returns {Boolean}
 */
export const isCORS = url => {
    url = getURL(url);

    return (
        url.hostname !== window.location.hostname ||
        url.protocol !== window.location.protocol
    );
};
