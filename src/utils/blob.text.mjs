//
const reader = new FileReader();

//
export default blob => {
    //
    const promise = new Promise(resolve => {
        reader.onload = buffer => resolve(buffer.srcElement.result); // TODO: address srcElement deprecation
        reader.onerror = reader.onabort = () =>
            reject(new Error(`Error loading ${blob.type} resource.`));
    });

    //
    reader.readAsText(blob);

    //
    return promise;
};
