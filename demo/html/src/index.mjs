(async () => {
    const loaderLib = await import(`${location.origin}/src/loader.mjs`);
    const Loader = loaderLib.default;

    const loader = new Loader();

    [...document.querySelectorAll(".navigation__button--load-html")].forEach(
        (btn) =>
            btn.addEventListener(
                "click",
                async (event) =>
                    await loader.load(
                        `${location.origin}/demo/html/${event.currentTarget.dataset.target}.html`,
                        {
                            cache: false,
                            element: document.querySelector(".demo-area"),
                            filter: ".demo-area__inner"
                        }
                    )
            )
    );
})();
