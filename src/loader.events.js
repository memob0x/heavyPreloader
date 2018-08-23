import { eventNamespaceParserSeparator } from './loader.settings';
import { stringStartsWith, stringContains } from './loader.utils';

let privateEventsStorage = {};

export const CustomEvent =
    window.CustomEvent ||
    (() => {
        const _polyfill = (event, params) => {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            const evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };
        _polyfill.prototype = window.Event.prototype;
        return _polyfill;
    })();

/**
 * @param {HTMLElement} element
 * @param {string} events
 * @returns {undefined}
 */
export const detachEventListener = (element, events) => {
    if (!element || typeof events !== 'string') {
        return;
    }

    if (stringStartsWith(events, '.')) {
        for (let key in privateEventsStorage) {
            const eventNameWithNamespace = key.replace(eventNamespaceParserSeparator, '.');
            if (stringContains(eventNameWithNamespace, events) && privateEventsStorage[key].element === element) {
                detachEventListener(element, eventNameWithNamespace);
            }
        }
    } else {
        events = events.split('.');

        const type = events[0],
            namespace = events[1];

        if (namespace) {
            events = events.join(eventNamespaceParserSeparator);
        }

        if (events in privateEventsStorage) {
            element.removeEventListener(type, privateEventsStorage[events].handler);
            delete privateEventsStorage[events];
        }
    }
};

/**
 * @param {HTMLElement} element
 * @param {string} events
 * @param {Function} handler
 * @param {boolean} once
 * @returns {undefined}
 */
// TODO: Class EventListener .on .one .off .trigger jQuery-like...
export const attachEventListener = (element, events, handler, once) => {
    if (!element || typeof events !== 'string' || typeof handler !== 'function') {
        return;
    }

    events = events.split('.');

    const type = events[0];
    const namespace = events[1];

    if (namespace) {
        events = events.join(eventNamespaceParserSeparator);
    }

    privateEventsStorage[events] = { element: element, count: 0, once: false };

    if (true === once) {
        let _handler = handler;
        handler = function(event) {
            if (events in privateEventsStorage) {
                privateEventsStorage[events].count++;
                if (privateEventsStorage[events].once && privateEventsStorage[events].count > 1) {
                    return;
                }
                _handler.call(this, event);
            }
            detachEventListener(element, events);
        };
    } else {
        once = false;
    }

    privateEventsStorage[events] = {
        ...privateEventsStorage[events],
        ...{ handler: handler, once: once }
    };

    element.addEventListener(type, privateEventsStorage[events].handler, { once: once });
};
