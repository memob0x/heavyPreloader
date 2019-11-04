import { load } from "./loader.load.mjs";
import { LoaderPromise } from "./loader.promise.mjs";

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
        return new LoaderPromise((resolve, reject, progress) => {
            let loaded = 0;
            const length = this._resources.length;

            let errors = false;

            for (var key in this._resources) {
                load(this._resources[key])
                    .catch(() => {
                        errors = true;
                    })
                    .finally(() => {
                        progress();

                        loaded++;

                        if (loaded < length) {
                            return;
                        }

                        if (errors) {
                            reject(
                                new Error(
                                    "One or more resources had troubles loading."
                                )
                            );
                        }

                        resolve();
                    });
            }
        });
    }
}
