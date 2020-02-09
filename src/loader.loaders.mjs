export const image = (url, attributeName = "src", el = new Image()) =>
    new Promise((resolve, reject) => {
        el.onload = resolve;
        el.onerror = reject;

        el.setAttribute(attributeName, url);
    });

export const style = (url, el = document.createElement("div")) => {
    const sheet = new CSSStyleSheet();

    const promise = sheet.replace(`@import url("${url}")`);

    if ("adoptedStyleSheets" in el) {
        el.adoptedStyleSheets = [...el.adoptedStyleSheets, sheet];
    }

    return promise;
};

const object = (url, el) =>
    new Promise((resolve, reject) => {
        // TODO: check
        el.onload = resolve;
        el.onerror = reject;

        el.data = url;

        el.width = 0;
        el.height = 0;

        document.body.append(el);
    });

export const script = (url, el = document.createElement("object")) =>
    el.tagName === "OBJECT"
        ? object(url, el)
        : new Promise((resolve, reject) => {
              // TODO: check
              el.onload = resolve;
              el.onerror = reject;

              el.src = url;
              el.async = true;

              document.head.append(el);
          });
