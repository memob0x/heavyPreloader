import { generateInstanceID, stringContains, stringStartsWith, hyphensToCamelCase, nodelistToArray, isInArray } from './nite.loader.tools';

import { pluginName, pluginInstance, supportedExtensions, supportedTags } from './nite.loader.settings';

import { intersectionObserverSupported, pictureElementSupported } from './nite.loader.client';

import { CustomEvent, detachEventListener, attachEventListener } from './nite.laoder.events';

import { privateCache } from './nite.loader.cache';

import { isVisible, isHTMLElement, isLoaded, isFullyBuffered, isBroken } from './nite.loader.element';

/**
 * @param {Object} resource
 * @returns {Object}
 */
const decodeResource = resource => {
    let output = { format: null, extension: null, tag: null, consistent: false };

    resource.resource = resource.resource.split('?')[0];
    resource.resource = resource.resource.split('#')[0];
    for (let formatCandidate in supportedExtensions) {
        const base64Heading = ';base64,';

        if (new RegExp('(.(' + supportedExtensions[formatCandidate] + ')$)|' + base64Heading, 'g').test(resource.resource)) {
            if (new RegExp(base64Heading, 'g').test(resource.resource)) {
                let matches64 = resource.resource.match(new RegExp('^data:' + formatCandidate + '/(' + supportedExtensions[formatCandidate] + ')', 'g'));

                if (null === matches64) {
                    return;
                }

                matches64 = matches64[0];

                output.format = formatCandidate;
                output.extension = matches64.replace('data:' + formatCandidate + '/', '');
                output.tag = supportedTags[formatCandidate];

                break;
            } else {
                let matches = resource.resource.match(new RegExp(supportedExtensions[formatCandidate], 'g'));

                if (matches) {
                    output.format = formatCandidate;
                    output.extension = matches[0];
                    output.tag = supportedTags[formatCandidate];

                    break;
                }
            }
        }
    }

    if (isHTMLElement(resource.element)) {
        let tagName = resource.element.tagName.toLowerCase();
        let allTags = '';

        Object.values(supportedTags).forEach(tags => {
            allTags += '|' + tags;
        });

        allTags = allTags.split('|');

        if (isInArray(tagName, allTags)) {
            output.tag = tagName;
            output.consistent = true;
            if (output.format === null) {
                for (let format in supportedTags) {
                    if (stringContains(supportedTags[format], output.tag)) {
                        output.format = format;
                        break;
                    }
                }
            }
        }
    }

    if (stringContains(output.tag, '|')) {
        output.tag = output.tag.split('|')[0];
    }

    return output;
};

// TODO: Promise support
// TODO: think about useful vars in callback args (this class is not public but its vars are returned in .progress() callback)
/** TODO: description of the MyClass constructor function.
 * @class
 * @classdesc TODO: description of the SingleLoader class.
 */
export class SingleLoader {
    /**
     * @param {Object} [options={ srcAttr: 'data-src', srcsetAttr: 'data-srcset', playthrough: false, visible: false }]
     */
    constructor(options) {
        this._settings = {
            ...{
                srcAttr: 'data-src',
                srcsetAttr: 'data-srcset',
                playthrough: false,
                visible: false
            },
            ...options
        };

        if (!stringStartsWith(this._settings.srcAttr, 'data-') || !stringStartsWith(this._settings.srcsetAttr, 'data-')) {
            throw new Error('Wrong arguments format: srcAttr and srcsetAttr parameters must be dataset values.');
        }

        this.srcAttr = hyphensToCamelCase(this._settings.srcAttr.replace('data-', ''));
        this.srcsetAttr = hyphensToCamelCase(this._settings.srcsetAttr.replace('data-', ''));

        this._id = null;
        this._idEvent = null;
        this._busy = false;

        this._element = null;
        this._resource = null;
        this._format = null;
        this._observer = null;

        this._done = () => {};
        this._success = () => {};
        this._error = () => {};

        this._callback = e => {
            this._busy = false;
            if (null !== this._observer) {
                this._observer.unobserve(this._element);
            }

            const src = this._element.currentSrc || this._element.src;

            if (!isInArray(src, privateCache)) {
                privateCache.push(src);
            }

            let thisArguments = [this._element, e.type, src, this._id];

            this[e.type !== 'error' ? '_success' : '_error'].apply(this, thisArguments);
            this._done.apply(this, thisArguments);
        };
    }

    /**
     * @param {Object} data
     */
    set resource(data) {
        if (typeof data === 'object' && 'id' in data && 'element' in data && 'resource' in data) {
            this._id = data.id;
            this._element = data.element;
            this._resource = data.resource;

            this._busy = this._idEvent !== undefined;

            // TODO: FIXME: if this.busy, ottieni tutte le variabili seguenti da una cache.

            let info = decodeResource({
                resource: this._resource,
                element: this._element
            });
            this._tag = info.tag;
            this._consistent = info.consistent; // wrong tag for resource type...
            this._format = info.format;
            this._exists = this._element !== null;
            this._originalElement = this._element;

            if (!this._exists || !this._consistent) {
                this._element = document.createElement(this._tag);
                this._element.dataset[this.srcAttr] = this._resource;
            }

            this._idEvent = this._busy ? this._element[pluginInstance + '_IDEvent'] : pluginName + '_unique_' + this._element.tagName + '_' + generateInstanceID();

            //TODO: FIXME: this._lazy = this._busy ? this._lazy : !!(this._element.dataset[this.srcAttr] || this._element.dataset[this.srcsetAttr]);

            if (this._exists && this._settings.visible && intersectionObserverSupported) {
                this._observer = new IntersectionObserver(
                    (entries, observer) => {
                        entries.forEach(entry => (entry.target.intersectionRatio = entry.intersectionRatio));
                    },
                    {
                        root: null,
                        rootMargin: '0px',
                        threshold: 0.1
                    }
                );
                this._observer.observe(this._originalElement);
            }
        }
    }

    /**
     * @returns {string}
     */
    get resource() {
        return this._resource;
    }

    /**
     * @returns {boolean} se ha preso in carico il caricamento oppure no per vari motivi (è già caricato, non è nella viewport etc)
     */
    load() {
        // TODO: FIXME: (3) check for placeholders / non-lazy resources
        // if isLoaded(this._exists && this._consistent ? this._element : this._resource) &&
        // (
        //    ( this._lazy && ( data-xyz-src === src || data-xyz-srcset === srcset ) ) // TODO: capire come
        //    ||
        //    !this._lazy
        // )

        //TODO: remove elseif else when returning?
        if (isLoaded(this._exists && this._consistent ? this._element : this._resource)) {
            if (!this._busy) {
                // TODO: mayabe this should be called in this._callback
                detachEventListener(this._element, '.' + this._idEvent);
            }

            this._callback(new CustomEvent(!isBroken(this._exists && this._consistent ? this._element : this._resource) ? 'load' : 'error'));

            return false;
        } else if (this._exists && this._settings.visible && !isVisible(this._originalElement)) {
            return false;
        } else {
            if (this._format === 'image') {
                attachEventListener(this._element, 'load.' + this._idEvent, this._callback, !this._busy);
                attachEventListener(this._element, 'error.' + this._idEvent, this._callback, !this._busy);

                const picture = this._element.closest('picture');

                if (picture && pictureElementSupported) {
                    delete this._element.dataset[this.srcsetAttr];
                    delete this._element.dataset[this.srcAttr];

                    picture.querySelectorAll('source[' + this._settings.srcsetAttr + ']').forEach(el => {
                        el.setAttribute('srcset', el.dataset[this.srcAttr]);
                        delete el.dataset[this.srcAttr];
                    });
                } else {
                    if (this._element.matches('[' + this._settings.srcsetAttr + ']')) {
                        this._element.setAttribute('srcset', this._element.dataset[this.srcsetAttr]);
                        delete this._element.dataset[this.srcsetAttr];
                    }

                    if (this._element.matches('[' + this._settings.srcAttr + ']')) {
                        this._element.setAttribute('src', this._element.dataset[this.srcAttr]);
                        delete this._element.dataset[this.srcAttr];
                    }
                }
            } else if (this._format === 'video' || this._format === 'audio') {
                const isStandardPlaythrough = true === this._settings.playthrough;
                const isFullPlaythrough = 'full' === this._settings.playthrough;
                const sources = this._element.querySelectorAll('source');

                let callMediaLoad = false;

                if (sources) {
                    sources.forEach(source => {
                        if (source.matches('[' + this._settings.srcAttr + ']')) {
                            source.setAttribute('src', source.dataset[this.srcAttr]);
                            delete source.dataset[this.srcsetAttr];

                            callMediaLoad = true;
                        }

                        attachEventListener(
                            source,
                            'error.' + this._idEvent,
                            e => {
                                const sourcesErrorId = pluginName + '_error';

                                source[pluginInstance + '_' + sourcesErrorId] = true;

                                if (sources.length === nodelistToArray(sources).filter(thisSource => true === thisSource[pluginInstance + '_' + sourcesErrorId]).length) {
                                    this._callback(e);
                                }
                            },
                            !this._busy // true -> once, false -> on
                        );
                    });
                } else if (this._element.matches('[' + this._settings.srcAttr + ']')) {
                    this._element.setAttribute('src', this._element.dataset[this.srcAttr]);
                    delete this._element.dataset[this.srcAttr];

                    attachEventListener(
                        this._element,
                        'error.' + this._idEvent,
                        this._callback,
                        !this._busy // true -> once, false -> on
                    );

                    callMediaLoad = true;
                }

                if (callMediaLoad) {
                    this._element.load();
                }

                attachEventListener(
                    this._element,
                    'loadedmetadata.' + this._idEvent,
                    () => {
                        if (!isStandardPlaythrough && !isFullPlaythrough) {
                            this._callback(new CustomEvent('load'));
                        }

                        if (isFullPlaythrough) {
                            let onProgressReplacementInterval = setInterval(() => {
                                let isError = this._element.readyState > 0 && !this._element.duration;

                                if (isError || isFullyBuffered(this._element)) {
                                    this._element.currentTime = 0;

                                    if (!isError && !this._busy && this._element.paused && this._element.matches('[autoplay]')) {
                                        this._element.play();
                                    }

                                    clearInterval(onProgressReplacementInterval);

                                    this._callback(new CustomEvent(!isError ? 'load' : 'error'));
                                } else {
                                    if (!this._element.paused) {
                                        this._element.pause();
                                    }

                                    if (!this._busy) {
                                        this._element.currentTime += 2;
                                    }
                                }
                            }, 500);

                            this._element[pluginName + '_' + this._idEvent] = onProgressReplacementInterval;
                        }
                    },
                    !this._busy // true -> once, false -> on
                );

                attachEventListener(
                    this._element,
                    'canplay.' + this._idEvent,
                    () => {
                        if (isFullPlaythrough && this._element.currentTime === 0 && !isFullyBuffered(this._element)) {
                            this._element.currentTime++;
                        }
                    },
                    !this._busy // true -> once, false -> on
                );

                attachEventListener(
                    this._element,
                    'canplaythrough.' + this._idEvent,
                    () => {
                        if (isStandardPlaythrough) {
                            this._callback(new CustomEvent('load'));
                        }
                    },
                    !this._busy // true -> once, false -> on
                );
            } else {
                return false;
            }

            if (!this._busy) {
                this._element[pluginInstance + '_IDEvent'] = this._idEvent;
            }
        }

        this._resource = this._element.currentSrc || this._element.src;

        return !this._busy;
    }

    /**
     * @param {Function} callback
     * @returns {undefined}
     */
    done(callback) {
        if (typeof callback !== 'function') {
            return;
        }

        this._done = function(element, status, resource, id) {
            callback.apply(this, [element, status, resource, id]);
        };
    }

    /**
     * @returns {undefined}
     */
    abort() {
        detachEventListener(this._element, '.' + this._idEvent);

        if (isLoaded(this._exists ? this._element : this._resource)) {
            return;
        }

        const src = this._element.getAttribute('srcset'),
            srcset = this._element.getAttribute('src');

        if (undefined !== src) {
            this._element.dataset[this.srcAttr] = src;
            this._element.setAttribute(this._settings.srcAttr, src);
            this._element.removeAttribute('src');
            this._element.removeAttribute('srcset');
        }

        if (undefined !== srcset) {
            this._element.dataset[this.srcsetAttr] = srcset;
            this._element.setAttribute(this._settings.srcsetAttr, srcset);
            this._element.removeAttribute('src');
            this._element.removeAttribute('srcset');
        }
    }
}
