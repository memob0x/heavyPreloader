import Loader from "../../src/loader.mjs";

const loader = new Loader();
const images = document.querySelectorAll("img[data-src]");
const observer = new IntersectionObserver((entries) =>
    entries
        .filter((x) => x.isIntersecting)
        .forEach(async (x) => {
            const image = x.target;

            observer.unobserve(image);

            await loader.fetch(image.dataset.src);
            image.parentElement.classList.add("fetched");

            await loader.load(image.dataset.src, image);
            image.parentElement.classList.add("loaded");
        })
);

const btnPageLoad = document.querySelector("button#page-load");
btnPageLoad.addEventListener("click", async () => {
    btnPageLoad.remove();

    document.querySelector("#page").style = "";

    loader.load(["dist/styles.css", "dist/extra.css"], document);

    loader.load(["dist/scripts.js", "dist/not-existent.js"]);

    console.warn(await loader.load("/"));
});

const btnFetch = document.querySelector("button#images-fetch");
btnFetch.addEventListener("click", () => {
    btnFetch.remove();

    [...images].forEach(async (x) => {
        await loader.fetch(x.dataset.src);
        x.parentElement.classList.add("fetched");
    });
});

const btnObserve = document.querySelector("button#images-observe");
btnObserve.addEventListener("click", () => {
    btnObserve.remove();
    btnFetch.remove();

    [...images].forEach((i) => (i.parentNode.style.display = "block"));
    [...images].forEach((i) => (i.style.display = "block"));

    images.forEach((i) => observer.observe(i));
});
