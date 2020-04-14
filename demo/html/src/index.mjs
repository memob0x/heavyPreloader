(async () => {
    const loaderLib = await import(location.origin + "/src/loader.mjs");
    const Loader = loaderLib.default;

    const loader = new Loader();

    document
        .querySelector(".button-contents-loader")
        .addEventListener("click", async () => {
            await loader.load("//jsonplaceholder.typicode.com/posts", {
                element: document.querySelector(".contents-demo"),
                filter: ".contents-demo",
            });
        });
})();
