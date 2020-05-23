var loader_image = async (blob, options) => {
    //
    const url = URL.createObjectURL(blob);

    //
    const result = await new Promise((resolve, reject) => {
        //
        const image =
            options?.element instanceof HTMLImageElement
                ? options.element
                : new Image();

        //
        const events = (type) => {
            image[`${type}EventListener`]("load", onload);
            image[`${type}EventListener`]("error", onerror);
        };

        //
        const clean = () => events("remove");

        //
        const onload = (event) => {
            clean();

            resolve(event);
        };

        //
        const onerror = () => {
            clean();

            reject(new Error(`Error loading image ${blob.type}`));
        };

        //
        events("add");

        //
        image.src = url;
    });

    //
    URL.revokeObjectURL(url);

    //
    return result;
};

export default loader_image;
//# sourceMappingURL=loader.image.es.js.map
