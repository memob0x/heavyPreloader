import Loader from "../../src/loader.mjs";

const loader = new Loader();

[...document.querySelectorAll("img[data-src]")].forEach(el =>
    loader
        .fetch(el.dataset.src)
        .then(x => Loader.setImageAttribute(x, el))
        .catch(e => console.error(e))
);

loader
    .fetch("dist/styles.css")
    .then(x => Loader.adoptStyleSheet(x))
    .catch(e => console.error(e));

loader
    .fetch("dist/extra.css")
    .then(x => Loader.adoptStyleSheet(x))
    .catch(e => console.error(e));

loader
    .fetch("dist/scripts.js")
    .then(x => Loader.insertScript(x))
    .catch(e => console.error(e));

loader
    .fetch("dist/not-existent.js")
    .then(x => Loader.insertScript(x))
    .catch(e => console.error(e));
