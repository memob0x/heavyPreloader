import readBlobAsText from "./text.mjs";

//
const parser = new DOMParser();

/**
 * 
 */
export default async (blob, options) => {
    //
    const promise = readBlobAsText(blob);

    //
    let result = await promise;

    //
    if (typeof options?.filter === "string" && options?.filter?.length) {
        //
        result = parser.parseFromString(result, "text/html").body;
        
        //
        result = [...result.querySelectorAll(options.filter)];

        //
        result = result
            .map(x => x.outerHTML)
            .reduce((previousValue, currentValue) => previousValue + currentValue, []);
    }

    //
    if ( options?.element instanceof HTMLElement && typeof result === "string" ) {
        options.element.innerHTML = result;
    }

    //
    return promise;
};
