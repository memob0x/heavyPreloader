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
