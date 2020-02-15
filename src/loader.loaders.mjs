import LoaderResource from "./loader.resource.mjs";

export const Loaders = {
    image: (url, el = new Image()) =>
        new Promise((resolve, reject) => {
            el.onload = () => resolve(new LoaderResource(url));
            el.onerror = reject;

            el.src = url;
        }),

    media: (url, el = new Image()) =>
        // TODO:
        new Promise((resolve, reject) => {
            el.onload = () => resolve(new LoaderResource(url));
            el.onerror = reject;

            el.src = url;
        }),

    style: (url, el = document.createElement("div")) => {
        const sheet = new CSSStyleSheet();

        const promise = sheet.replace(`@import url("${url}")`);

        if ("adoptedStyleSheets" in el) {
            el.adoptedStyleSheets = [...el.adoptedStyleSheets, sheet];
        }

        return promise;
    },

    object: (url, el = document.createElement("object")) =>
        new Promise((resolve, reject) => {
            // TODO: check
            el.onload = () => resolve(new LoaderResource(url));
            el.onerror = reject;

            el.data = url;

            el.width = 0;
            el.height = 0;

            document.body.append(el);
        }),

    script: (url, el = document.createElement("script")) =>
        new Promise((resolve, reject) => {
            // TODO: check
            el.onload = () => resolve(new LoaderResource(url));
            el.onerror = reject;

            el.src = url;
            el.async = true;

            document.head.append(el);
        })
};

export const Middlewares = {
    image: (url, bool, resource) =>
        Loaders.image(url, bool && resource.el ? resource.el : void 0),
    media: (url, bool, resource) =>
        Loaders.media(url, bool && resource.el ? resource.el : void 0),
    script: (url, bool) => {
        if (bool) {
            return Loaders.script(url);
        }

        return Loaders.object(url);
    },
    style: (url, bool) => Loaders.style(url, bool ? document : void 0)
};
