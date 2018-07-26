/**
 * @returns {string}
 */
export const generateInstanceID = () => {
    return Math.floor(Math.random() * (9999 - 1000)) + 1000;
};

/**
 * @param {string} heystack
 * @param {string} needle
 * @returns {boolean}
 */
export const stringContains = (heystack, needle) => {
    return String.prototype.includes ? heystack.includes(needle) : heystack.indexOf(needle, 0) !== -1;
};

/**
 * @param {string} heystack
 * @param {string} needle
 * @returns {boolean}
 */
export const stringStartsWith = (heystack, needle) => {
    return String.prototype.startsWith ? heystack.startsWith(needle) : heystack.substr(0, needle.length) === needle;
};

/**
 * @param {Array} heystack
 * @param {Function} filter
 * @returns {number}
 */
export const arrayFindIndex = (heystack, filter) => {
    return Array.prototype.findIndex
        ? heystack.findIndex(filter)
        : (() => {
              let length = heystack.length,
                  index = -1;
              while (++index < length) {
                  if (filter(heystack[index], index, heystack)) {
                      return index;
                  }
              }
              return -1;
          })();
};

/**
 * @param {string} string
 * @returns {string}
 */
export const hyphensToCamelCase = string => {
    return string.replace(/-([a-z])/g, g => g[1].toUpperCase());
};

/**
 * @param {string} string
 * @returns {string}
 */
export const capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * @param {NodeList} nodelist
 * @returns {Array}
 */
export const nodelistToArray = nodelist => {
    return [...nodelist];
};

/**
 * @param {String|number} needle
 * @param {Array} heystack
 * @returns {boolean}
 */
export const isInArray = (needle, heystack) => {
    return heystack.indexOf(needle) > -1;
};

// thanks https://gist.github.com/beaucharman/e46b8e4d03ef30480d7f4db5a78498ca
export const throttle = (callback, wait, context = this) => {
    let timeout = null;
    let callbackArgs = null;
    const later = () => {
        callback.apply(context, callbackArgs);
        timeout = null;
    };
    return function() {
        if (!timeout) {
            callbackArgs = arguments;
            timeout = setTimeout(later, wait);
        }
    };
};
