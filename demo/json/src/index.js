(async () => {
    const loaderModule = await import(
        `${location.origin}/loader/dist/esm/loader.mjs`
    );
    const Loader = loaderModule.default;

    // creating a Loader instance
    const loader = new Loader();

    // creating a FileReader instance
    const reader = new FileReader();

    // registering custom loader
    loader.register("json", async (blob) => {
        // creating an url from a blob
        const url = URL.createObjectURL(blob);

        // handling json load
        const promise = new Promise((resolve) => {
            reader.onload = (buffer) => resolve(buffer.srcElement.result);
            reader.onerror = reader.onabort = () =>
                reject(new Error(`Error loading ${blob.type} resource.`));
        });

        // triggering json load
        reader.readAsText(blob);

        // making async/await compatible
        const result = await promise;

        // dispose the previously created url
        URL.revokeObjectURL(url);

        // returning the handler result
        return result;
    });

    document
        .querySelector(".navigation__button--load-json")
        .addEventListener("click", async () => {
            const json = await loader.load("/loader/demo/json/dist/index.json");

            document.querySelector(
                ".demo-area--json"
            ).innerHTML = `<pre>${json}</pre>`;
        });
})();
