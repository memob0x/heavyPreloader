import Loader from "../../src/loader.mjs";

const loader = new Loader();

[...document.querySelectorAll("img[data-src]")].forEach(el =>
    loader
        .fetch(el)
        .then(x => console.warn(x))
        .catch(e => console.error(e))
);

document.querySelector("button").addEventListener("click", () =>
    [...document.querySelectorAll("img[data-src]")].forEach(el =>
        loader
            .load(el)
            .then(x => console.warn(x))
            .catch(e => console.error(e))
    )
);

loader
    .fetch([
        "dist/styles.css",
        "dist/extra.css",
        "dist/scripts.js",
        "dist/not-existent.js"
    ])
    .forEach(p => p.then(x => loader.load(x)).catch(e => console.error(e)));
