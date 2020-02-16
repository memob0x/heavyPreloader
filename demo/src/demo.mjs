import Loader from "../../src/loader.mjs";

const loader = new Loader();
const images = document.querySelectorAll("img[data-src]");
const observer = new IntersectionObserver(entries =>
    loader
        .load(entries.filter(e => e.isIntersecting).map(e => e.target))
        .forEach(p =>
            p
                .then(r => {
                    r.el.parentElement.classList.add("loaded");

                    observer.unobserve(r.el);
                })
                .catch(e => console.warn(e))
        )
);

const btnPageLoad = document.querySelector("button#page-load");
btnPageLoad.addEventListener("click", () => {
    btnPageLoad.remove();

    document.querySelector("#page").style = "";

    loader
        .fetch([
            "dist/styles.css",
            "dist/extra.css",
            "dist/scripts.js",
            "dist/not-existent.js"
        ])
        .forEach(p => p.then(x => loader.load(x)).catch(e => console.error(e)));
});

const btnFetch = document.querySelector("button#images-fetch");
btnFetch.addEventListener("click", () => {
    btnFetch.remove();

    loader.fetch(images).forEach(p =>
        p
            .then(r => {
                r.el.parentElement.classList.add("fetched");

                console.log(r);
            })
            .catch(e => console.warn(e))
    );
});

const btnObserve = document.querySelector("button#images-observe");
btnObserve.addEventListener("click", () => {
    btnObserve.remove();
    btnFetch.remove();

    [...images].forEach(i => (i.parentNode.style.display = "block"));
    [...images].forEach(i => (i.style.display = "block"));

    images.forEach(i => observer.observe(i));
});
