/**
 *
 * @param url
 */
export const parseUrl = url => {
    const a = document.createElement("a");
    a.href = url;
    return a;
};

/**
 *
 * @param data
 */
export const urlFromDataObject = data =>
    data.blob.type ? URL.createObjectURL(data.blob) : data.response.url;

/**
 * TODO: do it
 * @param url
 */
export const getLoaderTypeFromUrl = url => "image";

/**
 *
 *  @param url
 */
export const isCORSUrl = url =>
    url.hostname !== window.location.hostname ||
    url.protocol !== window.location.protocol;
