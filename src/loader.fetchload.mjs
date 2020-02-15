import _fetch from "./loader.fetch.mjs";
import _load from "./loader.load.mjs";
import { isCORS, hasBlob } from "./loader.utils.mjs";

/**
 *
 * @param {LoaderResource} resource
 */
export default function(resource, load) {
    if (!hasBlob(resource) && !isCORS(resource.url)) {
        return new Promise((resolve, reject) =>
            _fetch
                .call(this, resource.url)
                .then(r =>
                    _load
                        .call(this, r, load)
                        .then(resolve)
                        .catch(reject)
                )
                .catch(reject)
        );
    }

    return _load.call(this, resource, load);
}
