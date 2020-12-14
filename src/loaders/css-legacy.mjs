// Head element closure
const head = document.head;

/**
 * 
 */
export default async (blob, options) => {
    //
    const url = URL.createObjectURL(blob);

    //
    const sheet = await new Promise(resolve => {
        //
        const elementOptionExists = options?.element instanceof HTMLLinkElement;

        //
        const link = elementOptionExists ? options.element : document.createElement("link");

        //
        link.rel = "stylesheet";

        //
        link.href = url;

        /**
         * 
         * @returns {void} Nothing
         */
        const callback = () => {
            //
            link.removeEventListener("load", callback);

            //
            link.removeEventListener("error", callback);

            //
            if( !elementOptionExists ){
                head.removeChild(link);
            }

            //
            resolve(link);
        };

        //
        const sheets = document.styleSheets;
        let i = sheets.length;
        while (i--) {
            if (sheets[i].href === url) {
                callback();
            }
        }

        //
        link.addEventListener("load", callback);
        
        //
        link.addEventListener("error", callback);

        //
        if( !head.contains(link) ){
            head.appendChild(link);
        }
    });

    //
    URL.revokeObjectURL(url);

    //
    return sheet;
};
