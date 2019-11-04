/**
 *
 */
export class LoaderPromise extends Promise {
    constructor(fn) {
        super((resolve, reject) => {
            fn(resolve, reject, value => {
                try {
                    return this._progress.forEach(listener => listener(value));
                } catch (error) {
                    reject(error);
                }
            });
        });

        this._progress = [];
    }

    progress(handler) {
        if (typeof handler === 'function') {
            this._progress.push(handler);
        }

        return this;
    }
}
