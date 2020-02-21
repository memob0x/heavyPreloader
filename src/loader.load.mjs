import Loaders from "./loader.loaders.mjs";
import _fetch from "./loader.fetch.mjs";
import { getLoaderType /*, isCORS */ } from "./loader.utils.mjs";

/**
 *
 * @param {LoaderResource} resource
 * @param {Object} options
 */
export default async (resource, options /*, bool*/) => {
    // ...
    const el = resource.el;

    // ...
    try {
        resource = await _fetch(resource, options);
        resource.el = el;
    } catch (e) {}

    // ...
    const type = getLoaderType(resource);
    if (!(type in Loaders)) {
        throw new Error("invalid type");
    }

    // ...
    const url = !!resource.blob
        ? URL.createObjectURL(resource.blob)
        : resource.url.href;

    // ...
    await Loaders[type](url, /* bool,*/ resource.el).finally(() =>
        URL.revokeObjectURL(url)
    );

    return resource;
};
