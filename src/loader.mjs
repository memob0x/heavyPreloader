import { load } from "./loader.load.mjs";

/**
 *
 */
export default class Loader {
    constructor(resources = []) {
        this._resources = resources;
    }

    /**
     *
     */
    load() {
        return new Promise((resolve, reject) => {
            for (var key in this._resources) {
                load(this._resources[key])
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
}
