import Loaders from "./loader.loaders.mjs";
import _fetch from "./loader.fetch.mjs";
import { getLoaderType, isCORS } from "./loader.utils.mjs";

/**
 *
 * @param {LoaderResource} resource
 * @param {Object} options
 */
export default async (resource, options, bool) => {
    // ...
    if (!isCORS(resource) || options.fetch.cors === "no-cors") {
        try {
            const el = resource.el;
            resource = await _fetch(resource, options);
            resource.el = el;
        } catch (e) {}
    }

    // ...
    const type = getLoaderType(resource);
    if (!(type in Loaders)) {
        return Promise.reject(new Error("invalid type"));
    }

    // ...
    const url = !!resource.blob
        ? URL.createObjectURL(resource.blob)
        : resource.url.href;

    // ...
    return new Promise((resolve, reject) =>
        Loaders[type](url, bool, resource.el)
            .finally(() => URL.revokeObjectURL(url))
            .then(() => resolve(resource))
            .catch(reject)
    );
};
