(async () => {
    const loaderLib = await import(location.origin + "/src/loader.mjs");
    const Loader = loaderLib.default;

    const loader = new Loader();
    const observer = new IntersectionObserver((entries) =>
        entries
            .filter((x) => x.isIntersecting)
            .forEach(async (x) => {
                const image = x.target;

                observer.unobserve(image);

                await loader.load(image.dataset.src, { element: image });

                setImageState(image, ImageStates.LOADED);
            })
    );

    const ImageStates = {
        DEFAULT: "image",
        SHOWN: "image--shown",
        LOADED: "image--loaded"
    };

    const setImageState = (image, state) => {
        for (const value of Object.values(ImageStates)) {
            image.parentElement.classList[state === value ? "add" : "remove"](
                value
            );
        }
    };

    const images = document.querySelectorAll("img[data-src]");

    document
        .querySelector(".navigation__button--load-images")
        .addEventListener("click", () => {
            images.forEach((image) => {
                setImageState(image, ImageStates.SHOWN);

                observer.observe(image);
            });
        });
})();
