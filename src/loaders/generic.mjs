/**
 * Generic loader with parameters, loads a given Blob object
 * @param {Blob} blob The resource Blob object to be loaded
 * @param {Object} options Loader options
 * @param {any} elementInterface Interface of the element target fo the load process
 * @param {string} elementTagName Tag name of the element target of the load process
 * @param {HTMLElement|null} [appendTarget] Parent element of the element target of the load process, if null is passed the element won't be inserted in DOM
 * @param {Array} [successEvents] Load events to be listened
 * @param {Array} [errorEvents] Error events to be listened
 * @param {Function} [beforeEventsAttachment] Function called before the events attachment
 * @param {Function} [afterEventsAttachment] Function called after the events detachment
 * @param {Function} [beforeEventsDetachment] Function called before the events attachment
 * @param {Function} [afterEventsDetachment] Function called after the events detachment
 * @returns {Promise} The load promise
 */
// TODO: provide unit test
export default async (
    blob,
    options,
    
    elementInterface,
    elementTagName,

    appendTarget = null,
    
    successEvents = [],
    errorEvents = [],

    beforeEventsAttachment = () => {},
    afterEventsAttachment = () => {},

    beforeEventsDetachment = () => {},
    afterEventsDetachment = () => {}
) => {
    // Creates an URL Object from Blob object in order to be passed to loader target element
    const url = URL.createObjectURL(blob);

    // Load/error event handlers as a Promise
    const result = await new Promise(resolve => {
        // The "element" option property exists and is a valid HTMLElement (given derived interface) element
        const elementOptionExists = options?.element instanceof elementInterface;

        // If "element" option property doesn't exist then a given tag name element is created
        const element = elementOptionExists ? options.element : document.createElement(elementTagName);

        /**
         * Attaches or detaches Events
         * @param {String} type The action to be performed (can be "add" or "remove")
         * @returns {void} Nothing
         */
        const events = type => {
            // Events api method to be called
            const method = `${type}EventListener`;

            // Success events
            for( let i = 0, j = successEvents.length; i < j; i++ ){
                element[method](successEvents[i], success);
            }

            // Error events
            for( let i = 0, j = errorEvents.length; i < j; i++ ){
                element[method](errorEvents[i], error);
            }
        };

        /**
         * Detaches Events
         * @returns {void} Nothing
         */
        const clean = () => {
            // Calls the before events detachment hook
            beforeEventsDetachment(element, url, success, error);

            // Detaches events
            events('remove');
            
            // If a valid append target element is passed then the element loader is inserted in DOM
            if( !elementOptionExists ){
                appendTarget?.removeChild(element);
            }

            // Calls the after events detachment hook
            afterEventsDetachment(element, url, success, error);
        };

        /**
         * Load handler
         * @returns {void} Nothing
         */
        const success = () => {
            // Perform cleanup
            clean();

            // Resolves the promise
            resolve(element);
        };

        /**
         * Error handler
         * @returns {void} Nothing
         */
        const error = () => {
            // Perform cleanup
            clean();

            // Rejects the promise
            reject(new Error(`Error loading ${blob.type}`));
        };

        // Calls the before events attachment hook
        beforeEventsAttachment(element, url, success, error);

        // Attaches events
        events('add');

        // If a valid append target element is passed and element has not been already inserted
        // then the element loader is inserted inside that target
        if( !appendTarget?.contains(element) ){
            appendTarget?.appendChild(element);
        }

        // Calls the after events attachment hook
        afterEventsAttachment(element, url, success, error);
    });

    // Invalidates the previously created URL object
    URL.revokeObjectURL(url);

    // Returns the load/error promise
    return result;
};
