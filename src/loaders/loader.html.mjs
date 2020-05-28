//
const reader = new FileReader();

//
export default async (blob, options) => {
    //
    const promise = new Promise((resolve) => {
        reader.onload = (buffer) => resolve(buffer.srcElement.result);
        reader.onerror = reader.onabort = () =>
            reject(new Error(`Error loading ${blob.type} resource.`));
    });

    //
    reader.readAsText(blob);

    //
    let result = await promise;

    //
    if (typeof options?.filter === "string" && options?.filter?.length) {
        //
        result = new DOMParser().parseFromString(result, "text/html").body;
        //
        result = [...result.querySelectorAll(options.filter)];
        //
        result = result.length
            ? result.map((x) => x.outerHTML).reduce((x, y) => x + y)
            : result;
    }

    //
    if (
        options?.element instanceof HTMLElement &&
        typeof result === "string" &&
        result?.length
    ) {
        options.element.innerHTML = result;
    }

    //
    return promise;
};
