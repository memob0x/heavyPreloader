import Loader from "../../src/loader.mjs";

const loader = new Loader();
const images = document.querySelectorAll("img[data-src]");
const observer = new IntersectionObserver((entries) =>
    entries
        .filter((x) => x.isIntersecting)
        .forEach((x) => {
            laodImage(x.target);

            x.target.parentElement.classList.add("loaded");

            observer.unobserve(x.target);
        })
);

const btnPageLoad = document.querySelector("button#page-load");
btnPageLoad.addEventListener("click", () => {
    btnPageLoad.remove();

    document.querySelector("#page").style = "";

    loader
        .fetch(["dist/styles.css", "dist/extra.css"])
        .forEach(async (preload) => {
            const blob = await preload;

            const url = URL.createObjectURL(blob);

            const sheet = new CSSStyleSheet();

            const promise = sheet.replace(`@import url("${url}")`);

            if ("adoptedStyleSheets" in document) {
                document.adoptedStyleSheets = [
                    ...document.adoptedStyleSheets,
                    sheet,
                ];
            }

            promise.finally(() => URL.revokeObjectURL(url));
        });

    loader
        .fetch(["dist/scripts.js", "dist/not-existent.js"])
        .forEach((x) => x.then((y) => loadScript(y)));
});

const btnFetch = document.querySelector("button#images-fetch");
btnFetch.addEventListener("click", () => {
    btnFetch.remove();

    [...images].forEach((x) => laodImage(x));
});

const btnObserve = document.querySelector("button#images-observe");
btnObserve.addEventListener("click", () => {
    btnObserve.remove();
    btnFetch.remove();

    [...images].forEach((i) => (i.parentNode.style.display = "block"));
    [...images].forEach((i) => (i.style.display = "block"));

    images.forEach((i) => observer.observe(i));
});

function laodImage(x) {
    loader
        .fetch(x.dataset.src)
        .then((e) => {
            const url = URL.createObjectURL(e);
            const dispose = () => URL.revokeObjectURL(url);

            x.onload = dispose;
            x.onerror = dispose;

            x.src = url;

            x.parentElement.classList.add("fetched");
        })
        .catch((e) => console.warn(e));
}

function loadStyle(blob) {
    const url = URL.createObjectURL(blob);

    const sheet = new CSSStyleSheet();

    const promise = sheet.replace(`@import url("${url}")`);
    const el = document;
    if ("adoptedStyleSheets" in el) {
        el.adoptedStyleSheets = [...el.adoptedStyleSheets, sheet];
    }

    promise.finally((x) => URL.revokeObjectURL(url));
}

function loadScript(blob) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const dispose = () => URL.revokeObjectURL(url);

        const el = document.createElement("script");
        el.onload = dispose;
        el.onerror = dispose;

        el.src = url;
        el.async = true;

        document.head.append(el);
    });
}
