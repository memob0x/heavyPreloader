import { Media } from './loader.media.js';
import { LoaderPromise } from './loader.promise.js';
import { find } from './loader.find.js';
import { switchAttributes, copyAttributes, removeAttributes } from './loader.utils.js';

/**
 *
 *
 */
export default class Loader {
    constructor(options = {}) {
        this._options = {
            ...{
                srcAttributes: {
                    src: !!!options.lazy ? 'src' : 'data-src',
                    srcset: !!!options.lazy ? 'srcset' : 'data-srcset'
                },
                sizesAttributes: {
                    sizes: !!!options.lazy ? 'sizes' : 'data-sizes',
                    media: !!!options.lazy ? 'media' : 'data-media'
                },
                lazy: false,
                playthrough: false,
                backgrounds: true,
                sequential: false
            },
            ...options
        };

        this._collection = []; // resources (array of type Media)
        this._queue = new Map(); // loading resources

        this._load = null; // main load Promise

        this._percentage = 0; // loading percentage
        this._state = 0; // 0: inactive - 1: busy
    }

    /**
     * @returns {Number} percentage
     */
    get percentage() {
        return this._percentage;
    }

    /**
     * @param {(Array|HTMLElement)} collection
     */
    set collection(collection) {
        if (this._state === 0) {
            if (collection instanceof HTMLElement) {
                collection = find(collection, this._options);
            }

            if (typeof item === 'string') {
                collection = [new Media({ url: item })];
            }

            if (Media.isMedia(collection)) {
                collection = [collection];
            }

            if (Array.isArray(collection)) {
                collection.forEach(item => {
                    const pushCheck = media => {
                        if (media.type === 'image' || media.type === 'video' || media.type === 'audio' || (media.type === 'iframe' && media.consistent)) {
                            this._collection.push(media);

                            return;
                        }

                        console.warn("Couldn't add media to collection", media);
                    };

                    if (item instanceof HTMLElement) {
                        find(item, this._options).forEach(media => pushCheck(new Media(media)));
                    }

                    if (typeof item === 'string') {
                        pushCheck(new Media({ url: item }));
                    }

                    if (Media.isMedia(item)) {
                        pushCheck(item);
                    }
                });
            }
        }
    }

    /**
     *
     * @returns {Array} collection
     */
    get collection() {
        return this._collection;
    }

    /**
     *
     * @returns {void}
     */
    abort() {
        if (this._state === 0) {
            return;
        }

        this._state = 0;

        this._queue.forEach((data, element) => element.dispatchEvent(new CustomEvent('Aborted')));
    }

    /**
     *
     * @returns {Promise}
     */
    load() {
        this._load = new LoaderPromise((resolve, reject, progress) => {
            if (this._state === 1) {
                reject('A Loader instance is already in progress.');
            }
            if (!this._collection.length) {
                reject('Collection is empty.');
            }

            this._state = 1;

            if (this._options.sequential) {
                let loaded = 0;
                const pipeline = () => {
                    if (this._state === 0) {
                        reject('Aborted');

                        return;
                    }

                    const loadStep = (media, cb) => {
                        loaded++;

                        this._percentage = (loaded / this._collection.length) * 100;

                        progress(media);

                        if (loaded < this._collection.length) {
                            pipeline();

                            return;
                        }

                        this._state = 0;

                        cb();
                    };

                    const load = this.fetch(this._collection[loaded]);
                    load.then(e => loadStep(e, () => resolve({}))); // TODO: returned something
                    load.catch(e => loadStep(e, () => reject('Error')));
                };

                pipeline();
            } else {
                let loaded = 0;
                const loadStep = (e, cb) => {
                    loaded++;

                    this._percentage = (loaded / this._collection.length) * 100;

                    progress(e);

                    if (loaded >= this._collection.length) {
                        this._state = 0;

                        cb();
                    }
                };

                for (let i = 0; i < this._collection.length; i++) {
                    if (this._state === 0) {
                        reject('Aborted');

                        break;
                    }

                    const load = this.fetch(this._collection[i]);
                    load.then(e => loadStep(e, () => resolve({}))); // TODO: returned something
                    load.catch(e => loadStep(e, () => reject(e)));
                }
            }
        });

        return this._load;
    }

    /**
     *
     * @param {Media} resource
     * @returns {Promise}
     */
    fetch(media) {
        return new Promise((resolve, reject) => {
            const isConsistent = media.consistent && document.body.contains(media.element);
            const hasSources = isConsistent && media.element.querySelectorAll('source').length;
            const createdElement = document.createElement(media.tagName);

            let mainEventsTarget = createdElement;

            if (media.type === 'iframe') {
                createdElement.style.visibility = 'hidden';
                createdElement.style.position = 'fixed';
                createdElement.style.top = '-999px';
                createdElement.style.left = '-999px';
                createdElement.style.width = '1px';
                createdElement.style.height = '1px';
                document.body.appendChild(createdElement);
            }

            if (isConsistent) {
                copyAttributes(createdElement, media.element, Object.values(this._options.srcAttributes));
                copyAttributes(createdElement, media.element, Object.values(this._options.sizesAttributes));

                if (hasSources) {
                    [...media.element.querySelectorAll('source')].forEach(source => {
                        const createdSource = document.createElement('source');
                        copyAttributes(createdSource, source, Object.values(this._options.srcAttributes));
                        copyAttributes(createdSource, source, Object.values(this._options.sizesAttributes));
                        createdElement.append(createdSource);
                    });
                }

                if (media.tagName === 'picture') {
                    // picture element loads only with a fallback img in it...
                    mainEventsTarget = document.createElement('img');
                    createdElement.append(mainEventsTarget);
                }
            }

            const finishPromise = cb => {
                if (isConsistent) {
                    switchAttributes(media.element, this._options.srcAttributes);
                    switchAttributes(media.element, this._options.sizesAttributes);

                    if (hasSources) {
                        [...media.element.querySelectorAll('source')].forEach(source => {
                            switchAttributes(source, this._options.srcAttributes);
                            switchAttributes(source, this._options.sizesAttributes);
                        });
                    }

                    if (media.type === 'video' || media.type === 'audio') {
                        media.element.load();
                    }

                    if (media.type === 'iframe') {
                        createdElement.parentElement.removeChild(createdElement);
                    }
                }

                this._queue.delete(createdElement);

                cb(media);
            };

            const prepareLoad = () => {
                if (isConsistent) {
                    switchAttributes(createdElement, this._options.srcAttributes);
                    switchAttributes(createdElement, this._options.sizesAttributes);

                    if (hasSources) {
                        [...createdElement.querySelectorAll('source')].forEach(source => {
                            switchAttributes(source, this._options.srcAttributes);
                            switchAttributes(source, this._options.sizesAttributes);
                        });
                    }
                } else {
                    createdElement.setAttribute('src', media.url);
                }

                if (media.type === 'video' || media.type === 'audio') {
                    createdElement.load();
                }
            };

            const dispatchEvent = type => {
                const event = new CustomEvent(type, { detail: media });

                if (media.element) {
                    media.element.dispatchEvent(event);
                }

                document.dispatchEvent(event);
            };

            let queuer = { media: media, observer: null, element: createdElement };

            // TODO: "abort" custom event must be "private" . instance?
            createdElement.addEventListener('abort', () => {
                removeAttributes(createdElement, Object.keys(this._options.srcAttributes));
                removeAttributes(createdElement, Object.values(this._options.srcAttributes));
                removeAttributes(createdElement, Object.keys(this._options.sizesAttributes));
                removeAttributes(createdElement, Object.values(this._options.sizesAttributes));

                if (hasSources) {
                    [...createdElement.querySelectorAll('source')].forEach(source => {
                        removeAttributes(source, Object.keys(this._options.srcAttributes));
                        removeAttributes(source, Object.values(this._options.srcAttributes));
                        removeAttributes(source, Object.keys(this._options.sizesAttributes));
                        removeAttributes(source, Object.values(this._options.sizesAttributes));
                    });
                }

                finishPromise(reject);
            });

            mainEventsTarget.addEventListener('error', () => {
                finishPromise(reject);

                dispatchEvent('mediaError');
            });

            if (media.type === 'image' || media.type === 'iframe') {
                mainEventsTarget.addEventListener('load', e => {
                    if (e.target.tagName.toLowerCase() === 'iframe' && !e.target.getAttribute('src')) {
                        return; // iframes fire load at landing
                    }

                    finishPromise(resolve);

                    dispatchEvent('mediaLoad');
                });
            }

            if (media.type === 'audio' || media.type === 'video') {
                mainEventsTarget.addEventListener(this._options.playthrough ? 'canplaythrough' : 'loadedmetadata', () => {
                    finishPromise(resolve);

                    dispatchEvent('mediaLoad');
                });
            }

            if (media.element instanceof HTMLElement && this._options.lazy && 'IntersectionObserver' in window) {
                queuer.observer = new IntersectionObserver(
                    (entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.intersectionRatio > 0) {
                                observer.unobserve(entry.target);

                                prepareLoad();
                            }
                        });
                    },
                    {
                        root: null,
                        rootMargin: '0px',
                        threshold: 0.1
                    }
                );

                queuer.observer.observe(media.element);
                this._queue.set(media.element, queuer);
            } else {
                this._queue.set(createdElement, queuer);

                prepareLoad();
            }
        });
    }
}
