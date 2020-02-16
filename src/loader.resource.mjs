import { getURL, prop, isSupportedElement } from "./loader.utils.mjs";

// ...
const collection = {};

// ...
const build = data => {
    let o = {};

    if (isSupportedElement(data)) {
        o.el = data;
        o.url = getURL(prop(o.el, "dataset.src")); // TODO: find a way to get currentSrc without triggering load
    } else {
        o.el = prop(data, "el");
        o.url = data instanceof URL ? data : prop(data, "url");
    }

    o.blob = prop(data, "blob");

    return o;
};

// ...
// TODO: refactor to avoid "override" param
export default class LoaderResource {
    constructor(data, override) {
        let o = build(data);

        if (o.url.href in collection && !override) {
            o = collection[o.url.href];
        }

        this.el = o.el;
        this.url = o.url;
        this.blob = o.blob;

        collection[this.url.href] = this;
    }

    static isLoaderResource(data) {
        return data instanceof this;
    }
}
