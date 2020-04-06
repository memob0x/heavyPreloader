export default async (blob, el) => {
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
    const result = await promise;

    //
    if (el && typeof el === "object" && "innerHTML" in el) {
        el.innerHTML = result;
    }

    //
    return promise;
};
