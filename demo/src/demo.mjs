import Loader from "../../src/loader.mjs";

const loader = new Loader({ fetch: { cors: "no-cors" } });

[...document.querySelectorAll("img[data-src]")].forEach(el =>
    loader
        .fetch(el)
        .then(x => console.log(x))
        .catch(e => console.warn(e))
);

document.querySelector("button").addEventListener("click", () =>
    [...document.querySelectorAll("img[data-src]")].forEach(el =>
        loader
            .load(el)
            .then(x => console.log(x))
            .catch(e => console.warn(e))
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
