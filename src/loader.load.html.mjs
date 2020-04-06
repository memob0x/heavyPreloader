export default async (blob, options) => {
    //
    const reader = new FileReader();

    //
    const promise = new Promise((resolve) =>
        reader.addEventListener("loadend", (buffer) =>
            resolve(buffer.srcElement.result)
        )
    );

    //
    reader.readAsText(blob);

    //
    let result = await promise;

    //
    if (typeof options.filter === "string" && options.filter.length) {
        //
        result = new DOMParser().parseFromString(result, "text/html").body;
        //
        result = [...result.querySelectorAll(options.filter)];
        //
        result = result.map((x) => x.outerHTML).reduce((x, y) => x + y);
    }

    //
    if (options.element && options.element instanceof HTMLElement) {
        options.element.innerHTML = result;
    }

    //
    return promise;
};
