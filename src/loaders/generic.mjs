/**
 * 
 */
export default async (
    blob,
    options,

    appendTarget = null,
    
    elementInterface = null,
    elementTagName = null,
    
    successEvents = [],
    errorEvents = [],

    beforeEventsAttachment = () => {},
    afterEventsAttachment = () => {},
) => {
    //
    const url = URL.createObjectURL(blob);

    //
    const result = await new Promise(resolve => {
        //
        const elementOptionExists = options?.element instanceof elementInterface;

        //
        const element = elementOptionExists ? options.element : document.createElement(elementTagName);

        /**
         * Attaches or detaches image events
         * @param {String} type The action to be performed (can be "add" or "remove")
         * @returns {void} Nothing
         */
        const events = type => {
            const method = `${type}EventListener`;

            //
            for( let i = 0, j = successEvents.length; i < j; i++ ){
                element[method](successEvents[i], success);
            }

            //
            for( let i = 0, j = errorEvents.length; i < j; i++ ){
                element[method](errorEvents[i], error);
            }
        };

        /**
         * Detaches image events
         * @returns {void} Nothing
         */
        const clean = () => {
            events('remove');
            
            //
            if( appendTarget && !elementOptionExists ){
                appendTarget.removeChild(element);
            }
        };

        /**
         * Image load handler
         * @returns {void} Nothing
         */
        const success = () => {
            clean();

            resolve(element);
        };

        /**
         * Image error handler
         * @returns {void} Nothing
         */
        const error = () => {
            clean();

            reject(new Error(`Error loading ${blob.type}`));
        };

        //
        beforeEventsAttachment(element, url, success, error);

        //
        events('add');

        //
        if( appendTarget && !appendTarget.contains(element) ){
            appendTarget.appendChild(element);
        }

        //
        afterEventsAttachment(element, url, success, error);
    });

    //
    URL.revokeObjectURL(url);

    //
    return result;
};
