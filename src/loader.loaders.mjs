export const loadImage = (url, el = new Image()) =>
    new Promise((resolve, reject) => {
        el.onload = () => resolve(el);
        el.onerror = reject;

        el.src = url;
    });

/* export const loadMedia = (url, el = new Image()) =>
    // TODO:
    new Promise((resolve, reject) => {
        el.onload = () => resolve(el);
        el.onerror = reject;

        el.src = url;
    }); */

export const loadStyle = (url, el = document.createElement("div")) => {
    const sheet = new CSSStyleSheet();

    const promise = sheet.replace(`@import url("${url}")`);

    if ("adoptedStyleSheets" in el) {
        el.adoptedStyleSheets = [...el.adoptedStyleSheets, sheet];
    }

    return promise;
};

/*export const loadObject = (url, el = document.createElement("object")) =>
    new Promise((resolve, reject) => {
        // TODO: check
        el.onload = () => resolve(el);
        el.onerror = reject;

        el.data = url;

        el.width = 0;
        el.height = 0;

        document.body.append(el);
    });*/

export const loadScript = (url, el = document.createElement("script")) =>
    new Promise((resolve, reject) => {
        // TODO: check
        el.onload = () => resolve(el);
        el.onerror = reject;

        el.src = url;
        el.async = true;

        document.head.append(el);
    });

export default {
    image: (url, /*bool,*/ el) => loadImage(url, /*bool ?*/ el /*: void 0*/),
    // media: (url, bool, el) => loadMedia(url, bool ? el : void 0),
    script: (url /*, bool*/) =>
        /*(bool ?*/ loadScript(url) /*: loadObject(url))*/,
    style: (url /*, bool*/) => loadStyle(url, /*bool ?*/ document /*: void 0*/)
};
