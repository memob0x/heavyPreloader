import modern from './javascript-module.mjs';
import legacy from './javascript-nomodule.mjs';

/**
 * Loads a given Blob object as a js file,
 * tries to load in a "modern" way using "import"
 * uses HTMLScriptElement load as a fallback for older browsers
 * @param {Blob} blob The resource Blob object to be loaded
 * @param {Object} options Loader options
 * @returns {Promise} The load promise
 */
export default async (blob, options) => {
    // Tries to use modern approach first,
    // uses legacy method as a fallback if an error is encountered
    try {
        return await modern(blob);
    } catch {
        return await legacy(blob, options);
    }
};
