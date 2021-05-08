/**
 * Loads a given Blob object as an ECMAScript module through dynamic import call
 * @throws {Error} Throws whathever the "import" call might throw
 * @param {Blob} The given Blob object to be loaded
 * @returns {any} Returns whatever the loaded javascript module itself exports
 */
export default async blob => {
    // Creates a resource url from given blob object
    const url = URL.createObjectURL(blob);

    // The awaited payload or error encountered
    let result = null;

    // Trying to wait for the payload to be retrieved,
    // this is mandatory in order to call "revokeObjectUrl"
    // even when an error is ecountered
    try{
        // Imports the javascript module
        result = await import(url);
    }catch(e){
        // Saves the error to be thrown later (after cleanup)
        result = e;
    }finally{
        // Invalidates the previously created url object
        URL.revokeObjectURL(url);
    }

    // Rebinds the previously encountered error
    if( result instanceof Error ){
        throw result;
    }

    // Returns the awaited javascript module
    return result;
};
