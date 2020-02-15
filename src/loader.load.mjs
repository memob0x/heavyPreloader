import { Middlewares } from "./loader.loaders.mjs";
import { getLoaderType } from "./loader.utils.mjs";

/**
 *
 * @param {LoaderResource} resource
 */
export default (resource, load) => {
    const type = getLoaderType(resource);

    if (!(type in Middlewares)) {
        return Promise.reject(new Error("invalid type"));
    }

    const url = !!resource.blob.type
        ? URL.createObjectURL(resource.blob)
        : resource.url;

    return Middlewares[type](url, load, resource).finally(() =>
        URL.revokeObjectURL(url)
    );
};
