import { launcher } from "./loader.loaders.mjs";
import { getLoaderType, hasBlob } from "./loader.utils.mjs";
import _fetch from "./loader.fetch.mjs";

/**
 *
 * @param {LoaderResource} resource
 */
export default function(resource, load) {
    const url = hasBlob(resource)
        ? URL.createObjectURL(resource.blob)
        : resource.url;

    return launcher(getLoaderType(resource), url, load).finally(() =>
        URL.revokeObjectURL(url)
    );
}
