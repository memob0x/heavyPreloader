import Loaders from "./loader.loaders.mjs";
import { getLoaderType } from "./loader.utils.mjs";

/**
 *
 * @param {LoaderResource} resource
 */
export default (resource, bool) => {
    const type = getLoaderType(resource);

    if (!(type in Loaders)) {
        return Promise.reject(new Error("invalid type"));
    }

    const url = !!resource.blob
        ? URL.createObjectURL(resource.blob)
        : resource.url.href;

    return new Promise((resolve, reject) =>
        Loaders[type](url, bool, resource.el)
            .finally(() => URL.revokeObjectURL(url))
            .then(() => resolve(resource))
            .catch(reject)
    );
};
