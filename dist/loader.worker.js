(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Loader', factory) :
    (global = global || self, global.Loader = factory());
}(this, (function () { 'use strict';

    const createDynamicWorker = (body) => {
        const url = URL.createObjectURL(
            new Blob(["(", body.toString(), ")()"], {
                type: "application/javascript",
            })
        );

        const worker = new Worker(url);

        URL.revokeObjectURL(url);

        return worker;
    };

    const createFetchWorker = () =>
        createDynamicWorker(
            () =>
                (onmessage = async (event) => {
                    try {
                        const response = await fetch(
                            event.data.href,
                            event.data.options
                        );
                        const blob = await response.blob();

                        event.data.status = response.status;
                        event.data.statusText = response.statusText;
                        event.data.blob = blob;
                    } catch (e) {
                        event.data.statusText = e;
                    }

                    postMessage(event.data);
                })
        );

    var loader_worker = new (class LoaderWorker {
        constructor() {
            this._worker = null;

            this._requests = 0;
        }

        terminate() {
            if (this._requests > 0) {
                this._requests--;
            }

            if (this._requests === 0) {
                this._worker.terminate();

                this._worker = null;
            }

            return this._worker;
        }

        worker() {
            this._requests++;

            if (this._worker) {
                return this._worker;
            }

            this._worker = createFetchWorker();

            return this._worker;
        }
    })();

    return loader_worker;

})));

//# sourceMappingURL=loader.worker.js.map
