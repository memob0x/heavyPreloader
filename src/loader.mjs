import { Resource } from './loader.resource.mjs';
import { LoaderPromise } from './loader.promise.mjs';
import { find } from './loader.find.mjs';
import { switchAttributes, copyAttributes, removeAttributes } from './loader.utils.mjs';
import { isIntersectionObserverSupported, isElementInViewport } from './toolbox/src/toolbox.viewport.mjs';

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

        this._collection = []; // resources (array of type Resource)
        this._queue = new Map(); // loading resources

        this._load = null; // main load Promise

        this._percentage = 0; // loading percentage
        this._state = 0; // 0: inactive - 1: busy

        if (!isIntersectionObserverSupported) {
            this.manuallyObservedElements = [];

            const manuallyObserve = () =>
                this.manuallyObservedElements.filter(item => !item.intersected).forEach(item => {
                    if (!item.intersected && isElementInViewport(item.element)) {
                        item.intersected = true;
                        // TODO: use a class-instance-relative generated-id to privatize internal custom event
                        item.element.dispatchEvent(new CustomEvent('intersected'));
                    }
                });

            window.addEventListener('scroll', manuallyObserve);
            window.addEventListener('resize', manuallyObserve);
            window.addEventListener('load', manuallyObserve);
        }
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
            if (collection instanceof NodeList) {
                collection = [...collection];
            }

            if (collection instanceof HTMLElement) {
                collection = find(collection, this._options);
            }

            if (typeof collection === 'string') {
                collection = [new Resource({ url: collection })];
            }

            if (Resource.isResource(collection)) {
                collection = [collection];
            }

            if (Array.isArray(collection)) {
                collection.forEach(item => {
                    const pushCheck = resource => {
                        if (resource.type === 'image' || resource.type === 'video' || resource.type === 'audio' || (resource.type === 'iframe' && resource.consistent)) {
                            this._collection.push(resource);

                            return;
                        }

                        console.warn("Couldn't add resource to collection", resource);
                    };

                    if (item instanceof HTMLElement) {
                        find(item, this._options).forEach(resource => pushCheck(new Resource(resource)));
                    }

                    if (typeof item === 'string') {
                        pushCheck(new Resource({ url: item }));
                    }

                    if (Resource.isResource(item)) {
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

                    const loadStep = (resource, cb) => {
                        loaded++;

                        this._percentage = (loaded / this._collection.length) * 100;

                        progress(resource);

                        if (loaded < this._collection.length) {
                            pipeline();

                            return;
                        }

                        this._state = 0;

                        cb();
                    };

                    const load = this.fetch(this._collection[loaded]);
                    load.then(e => loadStep(e, () => resolve({}))); // TODO: returned something
                    load.catch(e => loadStep(e, () => reject('Error'))); // TODO: return resource + error event obect
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
                    load.catch(e => loadStep(e, () => reject(e))); // TODO: return resource + error event obect
                }
            }
        });

        return this._load;
    }

    /**
     *
     * @param {Resource} resource
     * @returns {Promise}
     */
    fetch(resource) {
        return new Promise((resolve, reject) => {
            const isConsistent = resource.consistent && document.body.contains(resource.element);
            const hasSources = isConsistent && resource.element.querySelectorAll('source').length;
            const createdElement = document.createElement(resource.tagName);

            let mainEventsTarget = createdElement;

            if (resource.type === 'iframe') {
                createdElement.style.visibility = 'hidden';
                createdElement.style.position = 'fixed';
                createdElement.style.top = '-999px';
                createdElement.style.left = '-999px';
                createdElement.style.width = '1px';
                createdElement.style.height = '1px';
                document.body.appendChild(createdElement);
            }

            if (isConsistent) {
                copyAttributes(createdElement, resource.element, Object.values(this._options.srcAttributes));
                copyAttributes(createdElement, resource.element, Object.values(this._options.sizesAttributes));

                if (hasSources) {
                    [...resource.element.querySelectorAll('source')].forEach(source => {
                        const createdSource = document.createElement('source');
                        copyAttributes(createdSource, source, Object.values(this._options.srcAttributes));
                        copyAttributes(createdSource, source, Object.values(this._options.sizesAttributes));
                        createdElement.append(createdSource);
                    });
                }

                if (resource.tagName === 'picture') {
                    // picture element loads only with a fallback img in it...
                    mainEventsTarget = document.createElement('img');
                    createdElement.append(mainEventsTarget);
                }
            }

            const finishPromise = cb => {
                if (isConsistent) {
                    switchAttributes(resource.element, this._options.srcAttributes);
                    switchAttributes(resource.element, this._options.sizesAttributes);

                    if (hasSources) {
                        [...resource.element.querySelectorAll('source')].forEach(source => {
                            switchAttributes(source, this._options.srcAttributes);
                            switchAttributes(source, this._options.sizesAttributes);
                        });
                    }

                    if (resource.type === 'video' || resource.type === 'audio') {
                        resource.element.load();
                    }

                    if (resource.type === 'iframe') {
                        createdElement.parentElement.removeChild(createdElement);
                    }
                }

                this._queue.delete(createdElement);

                cb(resource);
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
                    createdElement.setAttribute('src', resource.url);
                }

                if (resource.type === 'video' || resource.type === 'audio') {
                    createdElement.load();
                }
            };

            const dispatchEvent = type => {
                const event = new CustomEvent(type, { detail: resource });

                if (resource.element) {
                    resource.element.dispatchEvent(event);
                }

                document.dispatchEvent(event);
            };

            let queuer = { resource: resource, observer: null, element: createdElement };

            // TODO: use a class-instance-relative generated-id to privatize internal custom event
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

                dispatchEvent('resourceError');
            });

            if (resource.type === 'image' || resource.type === 'iframe') {
                mainEventsTarget.addEventListener('load', e => {
                    if (e.target.tagName.toLowerCase() === 'iframe' && !e.target.getAttribute('src')) {
                        return; // iframes fire "load" event when ready in dom
                    }

                    finishPromise(resolve);

                    dispatchEvent('resourceLoad');
                });
            }

            if (resource.type === 'audio' || resource.type === 'video') {
                mainEventsTarget.addEventListener(this._options.playthrough ? 'canplaythrough' : 'loadedmetadata', () => {
                    finishPromise(resolve);

                    dispatchEvent('resourceLoad');
                });
            }

            if (resource.element instanceof HTMLElement && this._options.lazy) {
                if (isIntersectionObserverSupported) {
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

                    queuer.observer.observe(resource.element);
                } else {
                    if (isElementInViewport(resource.element)) {
                        prepareLoad();
                    } else {
                        this.manuallyObservedElements.push({
                            element: resource.element,
                            intersected: false
                        });
                        resource.element.addEventListener('intersected', () => prepareLoad());
                    }
                }

                this._queue.set(resource.element, queuer);
            } else {
                this._queue.set(createdElement, queuer);

                prepareLoad();
            }
        });
    }
}
