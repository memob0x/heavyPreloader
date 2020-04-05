(async () => {
    const loaderLib = await import(location.origin + "/src/loader.mjs");
    const Loader = loaderLib.default;

    const loader = new Loader();

    const btnPageLoad = document.querySelector("button#page-load");

    btnPageLoad.addEventListener("click", async () => {
        btnPageLoad.remove();

        await loader.load(
            ["index.css", "/demo/images/dist/index.css"],
            document
        );

        const view = await loader.load("/demo/images");

        document.documentElement.innerHTML = view;

        await loader.load("/demo/images/src/index.mjs");
    });
})();
