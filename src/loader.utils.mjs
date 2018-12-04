/**
 *
 * @param {HTMLElement} el
 * @param {Object} attrs
 * @returns {void}
 */
export const switchAttributes = (el, attrs) => {
    Object.keys(attrs).forEach(attr => {
        let dataAttr = attrs[attr];
        dataAttr = dataAttr === 'src' || dataAttr === 'srcset' ? `data-${dataAttr}` : dataAttr; // TODO: refactory
        const dataAttrVal = el.getAttribute(dataAttr);

        if (dataAttrVal) {
            el.setAttribute(attr, dataAttrVal);
            el.removeAttribute(dataAttr);
        }
    });
};

/**
 *
 * @param {HTMLElement} el
 * @param {HTMLElement} attributes
 * @returns {void}
 */
export const copyAttributes = (el, target, attributes) =>
    attributes.forEach(attr => {
        const attribute = target.getAttribute(attr);
        if (attribute) {
            el.setAttribute(attr === 'src' || attr === 'srcset' ? `data-${attr}` : attr, attribute); // TODO: refactory
        }
    });

/**
 *
 * @param {HTMLElement} el
 * @param {Array} attributes
 * @returns {void}
 */
export const removeAttributes = (el, attributes) => attributes.forEach(attr => el.removeAttribute(attr));

/**
 * used in the IntersectionObserver fallback logic
 * @param el
 * returns {boolean}
 */
export const isElementInViewport = el => true;

// TODO: rename
export const ID = (() => {
    const s4 = () =>
        Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
})();

// TODO: rename
// TODO: consider exposing it in options maybe?
export const threshold = (num => {
    let segments = [];

    for (let i = 0; i < num; i++) {
        segments.push((2 * i) / 100);
    }

    return segments;
})(50);

export const isIntersectionObserverSupported = 'IntersectionObserver' in window;

export const LoaderEvent = (() => {
    if (typeof window.CustomEvent === 'function') {
        return window.CustomEvent;
    }

    function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };

        const evt = document.createEvent('CustomEvent');

        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    return CustomEvent;
})();
