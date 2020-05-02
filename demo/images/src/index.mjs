(async () => {
    const loaderLib = await import(location.origin + "/src/loader.mjs");
    const Loader = loaderLib.default;

    let src;

    const loader = new Loader();
    const observer = new IntersectionObserver((entries) =>
        entries
            .filter((x) => x.isIntersecting)
            .forEach(async (x) => {
                const image = x.target;

                observer.unobserve(image);

                await loader.load(image.dataset[`${src}Src`], {
                    element: image
                });

                setImageState(image, ImageStates.LOADED);
            })
    );

    const ImageStates = {
        DEFAULT: "image",
        LOADING: "image--loading",
        LOADED: "image--loaded"
    };

    const setImageState = (image, state) => {
        for (const value of Object.values(ImageStates)) {
            image.parentElement.classList[state === value ? "add" : "remove"](
                value
            );
        }
    };

    const images = document.querySelectorAll(".image__img");

    [
        ...document.querySelectorAll(
            ".navigation__button--load-images[data-type]"
        )
    ].forEach((btn) =>
        btn.addEventListener("click", (event) => {
            src = event.currentTarget.dataset.type;

            images.forEach((image) => {
                setImageState(image, ImageStates.LOADING);

                observer.observe(image);
            });
        })
    );
})();
