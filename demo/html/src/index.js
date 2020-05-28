(async () => {
    const loaderLib = await import(`${location.origin}/dist/esm/loader.mjs`);
    const htmlLoader = await import(
        `${location.origin}/dist/esm/loaders/loader.html.mjs`
    );
    const Loader = loaderLib.default;

    const loader = new Loader();
    loader.register("html", htmlLoader.default);

    [...document.querySelectorAll(".navigation__button--load-html")].forEach(
        (btn) =>
            btn.addEventListener(
                "click",
                async (event) =>
                    await loader.load(
                        `${location.origin}/demo/html/${event.currentTarget.dataset.target}.html`,
                        {
                            cache: false,
                            element: document.querySelector(".demo-area--html"),
                            filter: ".demo-area__inner"
                        }
                    )
            )
    );
})();
