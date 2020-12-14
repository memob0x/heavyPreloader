// FileReader instance closure
const reader = new FileReader();

/**
 * Reads a given Blob object as text
 * @param {Blob} blob The given blob to be red as text
 * @returns {Promise} The blob read promise
 */
// TODO: provide unit test
// TODO: remove listeners maybe
export default async blob => {
    // The file reader instance event handlers promise conversion
    const promise = new Promise(resolve => {
        // Listens to the "load" event
        reader.onload = buffer => resolve(buffer.target.result);
        
        // Listens to the "error" event
        reader.onerror = reader.onabort = () => reject(new Error(`Error loading ${blob.type} resource.`));
    });

    // Triggers the blob reading process
    reader.readAsText(blob);

    // Returns the blob reading promise
    return await promise;
};
