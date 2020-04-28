(async () => {
    const loaderLib = await import(location.origin + "/src/loader.mjs");
    const Loader = loaderLib.default;

    const loader = new Loader();

    const images = document.querySelectorAll("img[data-src]");
    const btnFetch = document.querySelector(".button-images-fetch");
    const btnObserve = document.querySelector(".button-images-observe");

    const observer = new IntersectionObserver((entries) =>
        entries
            .filter((x) => x.isIntersecting)
            .forEach(async (x) => {
                const image = x.target;

                observer.unobserve(image);

                await loader.fetch(image.dataset.src);
                image.parentElement.classList.add("fetched");

                await loader.load(image.dataset.src, { element: image });
                image.parentElement.classList.add("loaded");
            })
    );

    btnFetch.addEventListener("click", () => {
        btnFetch.remove();

        [...images].forEach(async (x) => {
            await loader.fetch(x.dataset.src);
            x.parentElement.classList.add("fetched");
        });
    });

    btnObserve.addEventListener("click", () => {
        btnObserve.remove();
        btnFetch.remove();

        [...images].forEach((i) => (i.parentNode.style.display = "block"));
        [...images].forEach((i) => (i.style.display = "block"));

        images.forEach((i) => observer.observe(i));
    });
})();
