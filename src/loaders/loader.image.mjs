export default async (blob, options) => {
    //
    const image =
        options?.element instanceof HTMLImageElement
            ? options.element
            : new Image();

    //
    const url = URL.createObjectURL(blob);

    //
    const promise = new Promise((resolve, reject) => {
        const events = (type) => {
            image[`${type}EventListener`]("load", onload);
            image[`${type}EventListener`]("error", onerror);
        };

        const clean = () => events("remove");

        const onload = (event) => {
            clean();

            resolve(event);
        };

        const onerror = () => {
            clean();

            reject(new Error(`Error loading image ${blob.type}`));
        };

        events("add");
    });

    //
    image.src = url;

    //
    const result = await promise;

    //
    URL.revokeObjectURL(url);

    //
    return result;
};
