import Loader from "../../src/loader.mjs";

const loader = new Loader();

const images = document.querySelectorAll("img[data-src]");

const observer = new IntersectionObserver(entries =>
    loader
        .load(entries.filter(e => e.isIntersecting).map(e => e.target))
        .forEach(p =>
            p
                .then(r => {
                    r.el.classList.add("loaded");

                    observer.unobserve(r.el);
                })
                .catch(e => console.warn(e))
        )
);

document
    .querySelector("button#observe")
    .addEventListener("click", () =>
        [...images]
            .filter(x => !x.matches(".loaded"))
            .forEach(i => observer.observe(i))
    );

document.querySelector("button#fetch").addEventListener("click", () =>
    loader.fetch([...images].filter(x => !x.matches(".fetched"))).forEach(p =>
        p
            .then(r => {
                r.el.classList.add("fetched");

                console.log(r);
            })
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
