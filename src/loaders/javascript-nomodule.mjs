// Head element closure
const head = document.head;

/**
 * 
 */
export default async (blob, options) => {
    //
    const url = URL.createObjectURL(blob);

    //
    const result = await new Promise(resolve => {
        //
        const elementOptionExists = options?.element instanceof HTMLScriptElement;

        //
        const script = elementOptionExists ? options.element : document.createElement("script");

        //
        script.async = true;

        //
        script.src = url;

        /**
         * 
         * @param type 
         * @returns {void} Nothing
         */
        const events = type => {
            //
            script[`${type}EventListener`]("readystatechange", onload);

            //
            script[`${type}EventListener`]("load", onload);
        };

        /**
         * 
         * @returns {void} Nothing
         */
        const onload = () => {
            //
            events("remove");

            //
            if( !elementOptionExists ){
                head.removeChild(script);
            }

            //
            resolve(script);
        };

        //
        events("add");

        //
        if( !head.contains(script) ){
            head.appendChild(script);
        }
    });

    //
    URL.revokeObjectURL(url);

    //
    return result;
};
