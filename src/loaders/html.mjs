import blobText from "../utils/blob.text.mjs";

//
const parser = new DOMParser();

/**
 * 
 */
export default async (blob, options) => {
    //
    const promise = blobText(blob);

    //
    let result = await promise;

    //
    if (typeof options?.filter === "string" && options?.filter?.length) {
        //
        result = parser.parseFromString(result, "text/html").body;
        
        //
        result = [...result.querySelectorAll(options.filter)];

        //
        // TODO: rename "x", "y"
        result = result.length ? result.map(x => x.outerHTML).reduce((x, y) => x + y) : result;
    }

    //
    if ( options?.element instanceof HTMLElement && typeof result === "string" && result?.length ) {
        options.element.innerHTML = result;
    }

    //
    return promise;
};
