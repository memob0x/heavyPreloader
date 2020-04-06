export default async (blob, el = new Image()) => {
    //
    const url = URL.createObjectURL(blob);

    //
    const promise = new Promise((resolve, reject) => {
        el.onload = resolve;
        el.onerror = reject;
    });

    //
    el.src = url;

    //
    const result = await promise;

    //
    URL.revokeObjectURL(url);

    //
    return result;
};
