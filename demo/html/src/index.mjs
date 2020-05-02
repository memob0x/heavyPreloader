(async () => {
    const loaderLib = await import(`${location.origin}/src/loader.mjs`);
    const Loader = loaderLib.default;

    const loader = new Loader();

    document
        .querySelector(".button-contents-loader")
        .addEventListener("click", async () => {
            event.currentTarget.disabled = true;

            await loader.load(`${location.origin}/demo/html/items.html`, {
                element: document.querySelector(".contents-demo"),
                filter: ".contents-demo__inner"
            });
        });
})();
