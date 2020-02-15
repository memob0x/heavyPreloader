// TODO: refactor this!!!!!!!!!

import { getURL } from "./loader.utils.mjs";

const _get = (p, o) => p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o);
const _cast = (rawData, structure, interfaze) => {
    return rawData instanceof interfaze
        ? rawData
        : {
              ...structure,
              ...(rawData || {})
          };
};

const collection = {};

export default class LoaderResource {
    constructor(rawData, existent) {
        this.el =
            rawData instanceof HTMLElement
                ? rawData
                : _get(["el"], rawData) || null;

        this.url =
            getURL(
                _get(["dataset", "src"], this.el) ||
                    _get(["url"], rawData) ||
                    rawData
            ).href || null;

        if (this.url in collection && existent) {
            this.el = collection[this.url].el;
            this.url = collection[this.url].url;
            this.blob = collection[this.url].blob;
            this.response = collection[this.url].response;
            return;
        }

        this.blob = _cast(
            _get(["blob"], rawData),
            {
                size: 0,
                type: ""
            },
            Blob
        );

        this.response = _cast(
            _get(["response"], rawData),
            {
                url: this.url,
                status: 200,
                statusText: ""
            },
            Response
        );

        collection[this.url] = this;
    }

    static isLoaderResource(data) {
        return data instanceof this;
    }
}
