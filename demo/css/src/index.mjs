(async () => {
    const loaderLib = await import(location.origin + "/src/loader.mjs");
    const Loader = loaderLib.default;

    const loader = new Loader();

    const btnPageLoad = document.querySelector("button#page-load");

    btnPageLoad.addEventListener("click", async () => {
        btnPageLoad.remove();

        await loader.load(["/demo/css/dist/index.css"]);
    });
})();
