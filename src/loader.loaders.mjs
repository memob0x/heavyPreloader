import Data from "./loader.data.mjs";

export const image = (url, el = new Image(), attributeName = "src") =>
    new Promise((resolve, reject) => {
        el.onload = () => resolve(new Data(url));
        el.onerror = reject;

        el.setAttribute(attributeName, url);
    });

export const media = (url, el = new Image(), attributeName = "src") =>
    // TODO:
    new Promise((resolve, reject) => {
        el.onload = () => resolve(new Data(url));
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

export const object = (url, el) =>
    new Promise((resolve, reject) => {
        // TODO: check
        el.onload = () => resolve(new Data(url));
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
              el.onload = () => resolve(new Data(url));
              el.onerror = reject;

              el.src = url;
              el.async = true;

              document.head.append(el);
          });
