// FileReader instance closure
const reader = new FileReader();

/**
 * Reads a given blob as text
 * @param {Blob} blob The given blob to be red as text
 * @returns {Promise} The blob read promise
 */
export default async blob => {
    // The file reader instance event handlers promise conversion
    const promise = new Promise(resolve => {
        reader.onload = buffer => resolve(buffer.target.result);
        
        reader.onerror = reader.onabort = () => reject(new Error(`Error loading ${blob.type} resource.`));
    });

    // Triggers the blob reading process
    reader.readAsText(blob);

    // Returns the blob reading promise
    return await promise;
};
