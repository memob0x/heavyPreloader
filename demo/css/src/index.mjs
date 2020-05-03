(async () => {
    const loaderModule = await import(location.origin + "/src/loader.mjs");
    const Loader = loaderModule.default;

    const loader = new Loader();

    document
        .querySelector(".navigation__button--load-css")
        .addEventListener("click", async () => {
            await loader.load(["/demo/css/dist/index.dark.css"]);

            document.documentElement.classList.toggle("dark-mode");
        });
})();
