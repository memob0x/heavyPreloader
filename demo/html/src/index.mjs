(async () => {
    const loaderLib = await import(`${location.origin}/src/loader.mjs`);
    const Loader = loaderLib.default;

    const loader = new Loader();

    const fetchBtn = document.querySelector(".button-contents-loader");

    fetchBtn.addEventListener("click", async () => {
        fetchBtn.remove();

        await loader.load(`${location.origin}/demo/html/items.html`, {
            element: document.querySelector(".contents-demo"),
            filter: ".contents-demo__inner"
        });
    });
})();
