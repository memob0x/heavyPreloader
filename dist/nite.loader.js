/*! JQuery Nite Loader | Daniele Fioroni | dfioroni91@gmail.com */
(function (window, document, $, undefined) {
    'use strict';

    // thanks to https://github.com/paulmillr/console-polyfill
    // - - - - - - - - - - - - - - - - - - - -
    (function () {
        if (!window.console) {
            window.console = {};
        }
        let con = window.console,
            prop, method,
            dummy = () => { },
            properties = ['memory'],
            methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
        while (prop = properties.pop()) {
            if (!con[prop]) {
                con[prop] = {};
            }
        }
        while (method = methods.pop()) {
            if (!con[method]) {
                con[method] = dummy;
            }
        }
    })();
    // - - - - - - - - - - - - - - - - - - - -

    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
    // - - - - - - - - - - - - - - - - - - - -
    (function () {
        if (typeof window.CustomEvent === "function") {
            return false;
        }
        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            const evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    })();
    // - - - - - - - - - - - - - - - - - - - -

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex#Polyfill
    // - - - - - - - - - - - - - - - - - - - -
    if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, 'findIndex', {
            value: function (predicate) {
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }
                let o = Object(this);
                let len = o.length >>> 0;
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
                let thisArg = arguments[1];
                let k = 0;
                while (k < len) {
                    let kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return k;
                    }
                    k++;
                }
                return -1;
            },
            configurable: true,
            writable: true
        });
    }
    // - - - - - - - - - - - - - - - - - - - -

    // https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill
    // - - - - - - - - - - - - - - - - - - - -
    Array.isArray = Array.isArray || function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
    // - - - - - - - - - - - - - - - - - - - -

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Polyfill
    // - - - - - - - - - - - - - - - - - - - -
    Array.prototype.filter = Array.prototype.filter || function (func, thisArg) {
        'use strict';
        if (!((typeof func === 'Function' || typeof func === 'function') && this)) {
            throw new TypeError();
        }
        let len = this.length >>> 0,
            res = new Array(len),
            t = this, c = 0, i = -1;
        if (thisArg === undefined) {
            while (++i !== len) {
                if (i in this) {
                    if (func(t[i], i, t)) {
                        res[c++] = t[i];
                    } else {
                        while (++i !== len) {
                            if (i in this) {
                                if (func.call(thisArg, t[i], i, t)) {
                                    res[c++] = t[i];
                                }
                            }
                        }
                    }
                }
            }
        }
        res.length = c;
        return res;
    }
    // - - - - - - - - - - - - - - - - - - - -

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
    // - - - - - - - - - - - - - - - - - - - -
    String.prototype.startsWith = String.prototype.startsWith || function (search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
    // - - - - - - - - - - - - - - - - - - - -
    // - - - - - - - - - - - - - - - - - - - -

    // https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/String/includes#Polyfill
    // - - - - - - - - - - - - - - - - - - - -
    String.prototype.includes = String.prototype.includes || function (search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
    // - - - - - - - - - - - - - - - - - - - -

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes#Polyfill
    // - - - - - - - - - - - - - - - - - - - -
    String.prototype.includes = String.prototype.includes || function (search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
    // - - - - - - - - - - - - - - - - - - - -

    const
        generateInstanceID = function () {
            return Math.floor(Math.random() * (9999 - 1000)) + 1000;
        },
        pluginPrefix = 'nite',
        pluginMethod = pluginPrefix + 'Load',
        pluginName = pluginMethod + 'er',
        pluginInstance = generateInstanceID();

    window[pluginName + 'Cache'] = [];

    let privateEventsStorage = {};

    const
        eventNamespaceParserSeparator = '__namespace__',
        detachEventListener = (element, events) => {

            if (!element || typeof events !== 'string') {
                return;
            }

            if (events.startsWith('.')) {
                Object.keys(privateEventsStorage).forEach(key => {
                    if (key.replace(eventNamespaceParserSeparator, '.').includes(events) && privateEventsStorage[key].element === element) {
                        detachEventListener(element, key.replace(eventNamespaceParserSeparator, '.'));
                    }
                });
            } else {

                events = events.split('.');

                const
                    type = events[0],
                    namespace = events[1];

                if (namespace) {
                    events = events.join(eventNamespaceParserSeparator);
                }

                if (events in privateEventsStorage) {
                    element.removeEventListener(type, privateEventsStorage[events].handler);
                    delete privateEventsStorage[events];
                }
            }

        },
        attachEventListener = (element, events, handler, once) => {

            if (!element || typeof events !== 'string' || typeof handler !== 'function') {
                return;
            }

            events = events.split('.');

            const
                type = events[0],
                namespace = events[1];

            if (namespace) {
                events = events.join(eventNamespaceParserSeparator);
            }

            privateEventsStorage[events] = {
                element: element,
                count: 0,
                once: false
            };

            if (true === once) {
                let _handler = handler;
                handler = function (event) {
                    privateEventsStorage[events].count++;
                    if (privateEventsStorage[events].once && privateEventsStorage[events].count > 1) {
                        return;
                    }
                    _handler.call(this, event);
                    detachEventListener(element, events);
                }
            } else {
                once = false;
            }

            privateEventsStorage[events] = {
                ...privateEventsStorage[events], ...{
                    handler: handler,
                    once: once
                }
            };
            element.addEventListener(type, privateEventsStorage[events].handler, { once: once });

        },
        hyphensToCamelCase = string => {
            return string.replace(/-([a-z])/g, g => g[1].toUpperCase());
        },
        capitalize = string => {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        nodelistToArray = nodelist => {
            return [...nodelist];
        },
        isInArray = (needle, stack) => {
            return stack.indexOf(needle) > -1;
        },
        isVisible = element => {

            if (window.getComputedStyle(element, 'display') === 'none') {
                return false;
            }

            const
                bodyEl = document.getElementsByTagName('body')[0],
                winWidth = window.innerWidth || documnt.documentElement.clientWidth || bodyEl.clientWidth,
                winHeight = window.innerHeight || documnt.documentElement.clientHeight || bodyEl.clientHeight,
                rect = element.getBoundingClientRect();

            return !(rect.right < 0 || rect.bottom < 0 || rect.left > winWidth || rect.top > winHeight);

        },
        isHTMLObject = object => {
            if (typeof object !== 'object') {
                return false;
            }
            try {
                return object instanceof HTMLElement;
            }
            catch (e) {
                return object.nodeType === 1 && typeof object.style === 'object' && typeof object.ownerDocument === 'object';
            }
        },
        isLoaded = element => {
            return (
                (
                    typeof element === 'string'
                    &&
                    isInArray(element, window[pluginName + 'Cache'])
                )
                ||
                (
                    isHTMLObject(element)
                    && ('currentSrc' in element && element.currentSrc.length)
                    && (('complete' in element && element.complete) || ('readyState' in element && element.readyState >= 2))
                )
            );
        },
        isBroken = element => {
            return (
                isLoaded(element)
                &&
                (
                    (
                        typeof element === 'object'
                        &&
                        (
                            ('naturalWidth' in element && Math.floor(element.naturalWidth) === 0)
                            ||
                            ('videoWidth' in element && element.videoWidth === 0)
                        )
                    )
                    ||
                    typeof element === 'string'// TODO: check if is url maybe?
                )
            );
        },
        decodeResource = (item, expectedFormat) => {

            const
                formatExtensions = {
                    image: 'jp[e]?g||jpe|jif|jfif|jfi|gif|png|tif[f]?|bmp|dib|webp|ico|cur|svg',
                    audio: 'mp3|ogg|oga|spx|ogg|wav',
                    video: 'mp4|ogv|webm'
                },
                formatNames = Object.keys(formatExtensions),
                base64Heading = '\;base64\,';

            let output = { format: null, extension: null };

            if (typeof item === 'string') {

                item = item.split('?')[0]; // this gets rid of query strings
                item = item.split('#')[0]; // this gets rid of hashes

                if (item === '') {
                    return false;
                }

                let formatQueue = undefined !== expectedFormat ? [expectedFormat] : formatNames;

                for (const x in formatQueue) {

                    if (formatQueue.hasOwnProperty(x)) {

                        if (new RegExp('(\.(' + formatExtensions[formatQueue[x]] + ')$)|' + base64Heading, 'g').test(item)) {

                            if (new RegExp(base64Heading, 'g').test(item)) {

                                let matches64 = item.match(new RegExp('^data:' + formatQueue[x] + '\/(' + formatExtensions[formatQueue[x]] + ')', 'g'));

                                if (!matches64 || null === matches64) {
                                    continue;
                                }

                                matches64 = matches64[0];

                                output.format = formatQueue[x];
                                output.extension = matches64.replace('data:' + formatQueue[x] + '/', '');

                                break;

                            } else {

                                let matches = item.match(new RegExp(formatExtensions[formatQueue[x]], 'g'));

                                if (matches) {

                                    output.format = formatQueue[x];
                                    output.extension = matches[0];

                                    break;

                                }

                            }

                        }

                    }

                }

            }

            if (isHTMLObject(item)) {

                let tagName = item.tagName.toLowerCase();

                if (isInArray(tagName, formatNames)) {
                    output.format = item.tagName.toLowerCase();
                }

                if (tagName === 'img') {
                    output.format = 'image';
                }

            }

            return output;

        };

    // TODO: Promise?
    // TODO: private vars
    // TODO: think about useful vars in callback args (this class is not public but its vars are returned in .progress() callback)
    class SingleLoader {

        constructor(options) {

            this._settings = {
                ...{
                    srcAttr: 'data-src',
                    srcsetAttr: 'data-srcset',
                    playthrough: false,
                    visible: false,
                }, ...options
            };

            this.srcAttr = '';
            this.srcsetAttr = '';

            if (!this._settings.srcAttr.startsWith('data-')) {
                this.srcAttr = this._settings.srcAttr;
                this._settings.srcAttr = 'data-' + this._settings.srcAttr;
            } else {
                this.srcAttr = this._settings.srcAttr.replace('data-', '');
            }

            if (!this._settings.srcsetAttr.startsWith('data-')) {
                this.srcsetAttr = this._settings.srcsetAttr;
                this._settings.srcsetAttr = 'data-' + this._settings.srcsetAttr;
            } else {
                this.srcsetAttr = this._settings.srcsetAttr.replace('data-', '');
            }

            this.srcAttr = hyphensToCamelCase(this.srcAttr);
            this.srcsetAttr = hyphensToCamelCase(this.srcsetAttr);

            this._id = null;
            this._idEvent = null;
            this._busy = false;

            this._element = null;
            this._resource = null;
            this._format = null;


            this._done = () => { };
            this._success = () => { };
            this._error = () => { };

            this._callback = (e) => {

                this._busy = false;

                const src = this._element.currentSrc || this._element.src;

                if (!isInArray(src, window[pluginName + 'Cache']))
                    window[pluginName + 'Cache'].push(src);

                let thisArguments = [this._element, e.type, src, this._id];

                this[e.type !== 'error' ? '_success' : '_error'].apply(this, thisArguments);
                this._done.apply(this, thisArguments);

            };

        }

        set resource(data) {

            /* TODO:
            if( typeof data === 'object' && 'id' in data && 'element' in data && 'resource' in data ){

                this._id = data.id;
                this._element = data.element;
                this._resource = data.resource;

                this._format = decodeResource(this._resource).format;
                this._exists = isHTMLObject(this._element);

                if (!this._exists) {

                    let isImg = this._format === 'image';

                    this._element = document.createElement(isImg ? 'img' : this._format);

                    this._element.dataset[this.srcAttr] = this._resource;
                    this._element.dataset[this.srcsetAttr] = this._resource;

                }

                this._idEvent = this._element[pluginInstance + '_IDEvent'];
                this._busy = this._idEvent !== undefined;
                this._idEvent = this._busy ? this._idEvent : pluginName + '_unique_' + this._element.tagName + '_' + generateInstanceID();
            
            }*/

            const
                elementResource = isHTMLObject(data.resource),
                stringResource = typeof data.resource === 'string';

            if (!elementResource && !stringResource) {
                return;
            }

            this._id = data.id;
            this._format = decodeResource(data.resource).format;

            this._exists = elementResource;

            if (stringResource) {

                let isImg = this._format === 'image';

                this._element = document.createElement(isImg ? 'img' : this._format);

                if (isImg) {
                    this.srcsetAttr = 'srcset';
                    this._settings.srcsetAttr = 'data-' + this.srcsetAttr;
                    this.srcsetAttr = hyphensToCamelCase(this.srcsetAttr);
                }

                this.srcAttr = 'src';
                this._settings.srcAttr = 'data-' + this.srcAttr;
                this.srcAttr = hyphensToCamelCase(this.srcAttr);

                this._resource = data.resource;

            }

            if (elementResource) {
                this._element = data.resource;
            }

            if (stringResource) {
                this._element.dataset[this.srcAttr] = this._resource;
                this._element.dataset[this.srcsetAttr] = this._resource;
                this._element.setAttribute(this._settings.srcAttr, this._resource);
                this._element.setAttribute(this._settings.srcsetAttr, this._resource);
            }

            this._idEvent = this._element[pluginInstance + '_IDEvent'];
            this._busy = this._idEvent !== undefined;
            this._idEvent = this._busy ? this._idEvent : pluginName + '_unique_' + this._element.tagName + '_' + generateInstanceID();

        }

        get resource(){
            return this._resource;
        }

        /**
         *
         * @returns {boolean} se ha preso in carico il caricamento oppure no per vari motivi (è già caricato, non è nella viewport etc)
         */
        load() {

            if (isLoaded(this._exists ? this._element : this._resource)) {

                if (!this._busy) {
                    detachEventListener(this._element, '.' + this._idEvent); // TODO: mayabe this should be called in this._callback
                }

                this._callback(new CustomEvent(!isBroken(this._exists ? this._element : this._resource) ? 'load' : 'error'));

                return false;

            } else if (this._exists && this._settings.visible && !isVisible(this._element)) {

                return false;

            } else {

                if (this._format === 'image') {

                    attachEventListener(this._element, 'load.' + this._idEvent, this._callback, !this._busy);
                    attachEventListener(this._element, 'error.' + this._idEvent, this._callback, !this._busy);

                    const picture = this._element.closest('picture');

                    if (picture && 'HTMLPictureElement' in window) {

                        delete this._element.dataset[this.srcsetAttr];
                        delete this._element.dataset[this.srcAttr];

                        picture.querySelectorAll('source[' + this._settings.srcsetAttr + ']').forEach((el) => {
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

                    const

                        isPlaythroughModeNormal = true === this._settings.playthrough,
                        isPlaythroughModeFull = 'full' === this._settings.playthrough,

                        sources = this._element.querySelectorAll('source'),
                        isFullyBuffered = function (media) {

                            return media.buffered.length && Math.round(media.buffered.end(0)) / Math.round(media.seekable.end(0)) === 1;

                        };

                    let callMediaLoad = false;

                    if (sources) {

                        sources.forEach((source) => {

                            if (source.matches('[' + this._settings.srcAttr + ']')) {

                                source.setAttribute('src', source.dataset[this.srcAttr]);
                                delete source.dataset[this.srcsetAttr];

                                callMediaLoad = true;

                            }

                            attachEventListener(source, 'error.' + this._idEvent, (e) => {

                                const sourcesErrorId = pluginName + '_error';

                                source[pluginInstance + '_' + sourcesErrorId] = true;

                                if (sources.length === nodelistToArray(sources).filter(thisSource => true === thisSource[pluginInstance + '_' + sourcesErrorId]).length) {
                                    this._callback(e);
                                }

                            }, !this._busy);

                        });

                    } else {

                        if (this._element.matches('[' + src + ']')) {

                            this._element.setAttribute('src', this._element.dataset[this.srcAttr]);
                            delete this._element.dataset[this.srcAttr];

                            attachEventListener(this._element, 'error.' + this._idEvent, this._callback, !this._busy);

                            callMediaLoad = true;

                        }

                    }

                    if (callMediaLoad) {
                        this._element.load();
                    }


                    attachEventListener(this._element, 'loadedmetadata.' + this._idEvent, () => {

                        if (!isPlaythroughModeNormal && !isPlaythroughModeFull) {
                            this._callback(new CustomEvent('load'));
                        }

                        if (isPlaythroughModeFull) {

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

                    }, !this._busy);

                    attachEventListener(this._element, 'canplay.' + this._idEvent, () => {
                        if (isPlaythroughModeFull && this._element.currentTime === 0 && !isFullyBuffered(this._element)) {
                            this._element.currentTime++;
                        }
                    }, !this._busy);

                    attachEventListener(this._element, 'canplaythrough.' + this._idEvent, () => {
                        if (isPlaythroughModeNormal) {
                            this._callback(new CustomEvent('load'));
                        }
                    }, !this._busy);

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

        done(callback) {

            if (typeof callback !== 'function') {
                return;
            }

            this._done = function (element, status, resource, id) {
                callback.apply(this, [element, status, resource, id]);
            };

        };

        abort() {

            detachEventListener(this._element, '.' + this._idEvent);

            if (isLoaded(this._exists ? this._element : this._resource)) {
                return;
            }

            const
                src = this._element.getAttribute('srcset'),
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

    // TODO: Promise?
    // TODO: private vars
    // TODO: refactory succes/done/progress...
    class Loader {

        constructor(options) {

            this._collection = [];
            this._collectionLoaded = [];
            this._collectionInstances = [];
            this._collectionPending = [];
            this._resourcesLoaded = [];

            this._settings = {
                ...{
                    srcAttr: 'data-src',
                    srcsetAttr: 'data-srcset',
                    playthrough: false,
                    visible: false,
                    backgrounds: false,
                    attributes: []
                }, ...options
            };

            this.srcAttr = '';
            this.srcsetAttr = '';
            if (!this._settings.srcAttr.startsWith('data-')) {
                this.srcAttr = this._settings.srcAttr;
                this._settings.srcAttr = 'data-' + this._settings.srcAttr;
            } else {
                this.srcAttr = this._settings.srcAttr.replace('data-', '');
            }
            if (!this._settings.srcsetAttr.startsWith('data-')) {
                this.srcsetAttr = this._settings.srcsetAttr;
                this._settings.srcsetAttr = 'data-' + this._settings.srcsetAttr;
            } else {
                this.srcsetAttr = this._settings.srcsetAttr.replace('data-', '');
            }

            if (typeof this._settings.attributes === 'string') {
                this._settings.attributes = this._settings.attributes.split(this._settings.attributes.contains(',') ? ',' :' ');
            }
            if (!Array.isArray(this._settings.attributes)) {
                this._settings.attributes = [];
            }

            this.srcAttr = hyphensToCamelCase(this.srcAttr);
            this.srcsetAttr = hyphensToCamelCase(this.srcsetAttr);

            this.percentage = 0;

            this._done = () => { };
            this._progress = () => { };
            this._success = () => { };
            this._error = () => { };
            this._loop = this.load;

            this._abort = false;
            this._loaded = 0;
            this._complete = false;
            this._busy = false;

        }

        set collection(collection) {

            //TODO:
            /*
            if (!Array.isArray(collection)){
                collection = [];
            }

            collection.forEach(item => {

                let element = {
                    resource: '',
                    element: null,
                    id: generateInstanceID()
                };

                if (typeof item === 'string') {
                    element.resource = item;
                } else if (typeof item === 'object' && 'resource' in item) {
                    element = { ...element, ...item };
                } else {
                    return;
                }

                this._collection.push(element);

            });*/

            if (Array.isArray(collection) && (typeof collection[0] === 'string' || isHTMLObject(collection[0]))) {
                for (const resource in collection) {
                    if (collection.hasOwnProperty(resource)) {
                        this._collection.push({ id: generateInstanceID(), resource: collection[resource] });
                    }
                }
            }
            if (typeof collection === 'string' || isHTMLObject(collection)) {
                this._collection.push({ id: generateInstanceID(), resource: collection });
            }

        }

        get collection() {

            return this._collection;

        }

        collect(element) {

            const
                targets = 'img, video, audio',
                targetsExtended = targets + ', picture, source';

            let
                collection = [],
                targetsTags = nodelistToArray(element.querySelectorAll(targets));

            if (element.matches(targets)) {
                targetsTags.push(element);
            }

            targetsTags = targetsTags.filter((target) => {
                let filter = '[' + this._settings.srcAttr + '], [' + this._settings.srcsetAttr + ']',
                    children = nodelistToArray(target.children);
                children = children.filter(x => x.matches(targetsExtended));
                children = children.filter(x => x.matches(filter));
                return target.matches(filter) || children.length;
            });

            targetsTags.forEach((target) => {

                let collectionItem = {
                    element: target,
                    resource: target.getAttribute(this._settings.srcAttr) || target.getAttribute(this._settings.srcsetAttr)
                };

                collectionItem = collectionItem.element;

                collection.push(collectionItem);

            });

            if (true === this._settings.backgrounds) {
                let targetsBg = nodelistToArray(element.querySelectorAll('*'));
                targetsBg.push(element);
                targetsBg = targetsBg.filter(target => !target.matches(targetsExtended));
                targetsBg = targetsBg.filter(target => getComputedStyle(target).backgroundImage !== 'none');
                targetsBg.forEach((target) => {

                    const url = getComputedStyle(target).backgroundImage.match(/\((.*?)\)/);

                    if (null === url || url.length < 2) {
                        return true;
                    }

                    let collectionItem = {
                        element: target,
                        resource: url[1].replace(/('|")/g, '')
                    };

                    collectionItem = collectionItem.resource;

                    collection.push(collectionItem);

                });
            }

            if (this._settings.attributes.length) {
                for (const attr in this._settings.attributes) {
                    if (this._settings.attributes.hasOwnProperty(attr)) {

                        nodelistToArray(element.querySelectorAll('[' + attr + ']:not(' + targetsExtended + ')')).forEach((target) => {

                            let collectionItem = {
                                element: target,
                                resource: target.getAttribute(attr)
                            };

                            collectionItem = collectionItem.resource;

                            collection.push(collectionItem);

                        });

                        if (element.matches('[' + attr + ']') && !element.matches(targetsExtended)) {

                            let collectionItem = {
                                element: element,
                                resource: element.getAttribute(attr)
                            };

                            collectionItem = collectionItem.resource;

                            collection.push(collectionItem);

                        }

                    }
                }
            }

            this.collection = collection;

        }

        load() {

            this._collectionPending = []; // resets pending elements (sequential opt helper array) every time we loop

            const sequentialMode = true === this._settings.sequential;

            for (let i = 0; i < this._collection.length; i++) {

                if (this._abort) {
                    break;
                }

                let thisLoadId = this._collection[i].id,
                    thisLoadIndex = this._collectionInstances.findIndex(x => x.id === thisLoadId),
                    thisLoadInstance = new SingleLoader(this._settings);

                if (thisLoadIndex === -1) {
                    this._collectionInstances.push({ id: thisLoadId, instance: thisLoadInstance });
                    thisLoadIndex = this._collectionInstances.findIndex(x => x.id === thisLoadId);
                } else {
                    this._collectionInstances[thisLoadIndex].instance = thisLoadInstance;
                }

                thisLoadInstance.resource = this._collection[i];

                thisLoadInstance.done((element, status, resource, id) => {

                    if (this._complete || this._abort) {
                        return;
                    }

                    const aProgress = !isInArray(id, this._collectionLoaded);

                    if (aProgress) {

                        this._collectionLoaded.push(id);
                        this._busy = false;

                        this._loaded++;
                        this.percentage = this._loaded / this._collection.length * 100;
                        this.percentage = parseFloat(this.percentage.toFixed(4));

                        // TODO: cleanup/refactory
                        const thisResource = { resource: resource, status: status, element: element };
                        this._resourcesLoaded.push(thisResource);

                        this._progress.call(this, thisResource);
                        this[status !== 'error' ? '_success' : '_error'].call(this, thisResource);

                        // TODO: dispatch event on element maybe?
                        // element.dispatchEvent(new CustomEvent(pluginPrefix + capitalize(status) + '.' + pluginPrefix));

                    }

                    if (this._loaded === this._collection.length) {

                        this._done.call(this, this._resourcesLoaded);

                        this._complete = true;

                    } else if (aProgress && sequentialMode && this._collectionPending.length) {

                        this._collectionPending = this._collectionPending.filter(x => x.id !== id);

                        if (this._collectionPending.length) {
                            this._busy = this._collectionPending[0].instance.load();
                        }

                    }

                });

                if (!sequentialMode || (sequentialMode && !this._busy)) {
                    this._busy = thisLoadInstance.load();
                
                }else if (sequentialMode && this._busy && (!this._settings.visible || (this._settings.visible && isVisible(thisLoadInstance._element)) ) ){
                    this._collectionPending.push({ id: thisLoadId, instance: thisLoadInstance });
                
                }


            }

        }

        done(callback) {

            if (typeof callback !== 'function') {
                return;
            }

            const _func = function (resources) {
                callback.call(this, resources);
            };

            if (this._collection.length) {

                this._done = _func;

                //this._loop();

            } else {
                _func();
            }

        };

        progress(callback) {

            if (typeof callback !== 'function')
                return;

            const _func = function (resource) {
                callback.call(this, resource);
            };

            if (this._collection.length) {

                this._progress = _func;

                //this._loop();

            }

        };

        success(callback) {

            if (typeof callback !== 'function') {
                return;
            }

            const _func = function (resource) {
                callback.call(this, resource);
            };

            if (this._collection.length) {

                this._success = _func;

                //this._loop();

            }

        };

        error(callback) {

            if (typeof callback !== 'function') {
                return;
            }

            const _func = function (resource) {
                callback.call(this, resource);
            };

            if (this._collection.length) {

                this._error = _func;

                //this._loop();

            }

        };

        abort() {

            for (const key in this._collectionInstances) {
                this._collectionInstances[key].instance.abort();
            }

            if (this._collection.length) {
                this._abort = true;
            }

        };

    }

    // public interface
    // - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // requirejs
    if (typeof define === 'function' && define.amd) {
        define(capitalize(pluginName), Loader);
        // nodejs
    } else if ('object' === typeof exports) {
        module.exports[capitalize(pluginName)] = Loader;
        // vanilla
    } else {
        window[capitalize(pluginName)] = Loader;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // jQuery interface
    // - - - - - - - - - - - - - - - - - - - -
    if (!$) {
        return undefined;
    }

    $[capitalize(pluginName)] = Loader;

    const
        $document = $(document),
        $window = $(window),
        // thanks https://gist.github.com/beaucharman/e46b8e4d03ef30480d7f4db5a78498ca
        throttle = (callback, wait, context = this) => {
            let timeout = null,
                callbackArgs = null
            const later = () => {
                callback.apply(context, callbackArgs)
                timeout = null
            }
            return function () {
                if (!timeout) {
                    callbackArgs = arguments
                    timeout = setTimeout(later, wait)
                }
            }
        };

    let methodCollection = [];

    $.fn[pluginMethod] = function (options) {

        let originalUserOptions = options;

        if (typeof options !== 'object') {
            options = {};
        }

        let settings = {
            ...{

                srcAttr: 'data-src',
                srcsetAttr: 'data-srcset',

                visible: false,

                sequential: false,

                backgrounds: false,
                extraAttrs: [],

                playthrough: false,

                early: false,
                earlyTimeout: 0,

                onProgress: () => { },
                onLoad: () => { },
                onError: () => { },

                onComplete: () => { },

            }, ...options
        };

        let callback = settings.onComplete;
        if ($.isFunction(originalUserOptions)) {
            callback = originalUserOptions;
        }

        return this.each(function (i) {

            const
                $element = $(this),
                uniqueMethodPluginName = generateInstanceID() + i,
                thisLoadInstance = new Loader(settings);

            thisLoadInstance.collect(this);

            methodCollection.push({
                id: uniqueMethodPluginName,
                instance: thisLoadInstance,
                element: this,
                timeout: null
            });

            thisLoadInstance.progress((resource) => {

                $(resource.element).trigger(pluginPrefix + capitalize(resource.status) + '.' + pluginPrefix, [resource.element, resource.resource]);
                $element.trigger(pluginPrefix + 'Progress.' + pluginPrefix, [this, resource]);

                const thisArguments = [thisLoadInstance, resource];

                if (typeof settings.onProgress === 'function') {
                    settings.onProgress.apply(this, thisArguments);
                }

                let eventName = capitalize(resource.status);
                if (typeof settings['on' + eventName] === 'function') {
                    settings['on' + eventName].apply(this, thisArguments);
                }

            });

            thisLoadInstance.done(resources => {

                $element.trigger(pluginPrefix + 'Complete.' + pluginPrefix, [this, resources]);
                callback.apply(this, [thisLoadInstance, resources]);

                if (settings.visible) {
                    $window.off('scroll.' + uniqueMethodPluginName);
                }

                // refresh other method calls for same el (omitting this one)
                methodCollection = methodCollection.filter(x => x.id !== uniqueMethodPluginName);
                methodCollection.forEach(thisMethodCollection => {
                    if ($element.is(thisMethodCollection.element)) {
                        thisMethodCollection.instance.load();
                    }
                });

            });

            thisLoadInstance.load();

            if (settings.visible) {
                $window.on('scroll.' + uniqueMethodPluginName, throttle(() => thisLoadInstance.load(), 250));
            }

            if (true === settings.early) for (let key in methodCollection) {

                let thisMethodCollection = methodCollection[key];

                if (methodCollection[key].id === uniqueMethodPluginName) {

                    clearTimeout(thisMethodCollection.timeout);

                    let timeout = parseInt(settings.earlyTimeout);

                    thisMethodCollection.timeout = setTimeout(function () {

                        // TODO: appropriate method to set/update settings?
                        thisMethodCollection.instance._settings.visible = false;
                        thisMethodCollection.instance._settings.sequential = true;

                        thisMethodCollection.instance.load();

                    }, !isNaN(timeout) && isFinite(timeout) ? timeout : 0);

                    break;

                }

            }

        });

    };

})(window, document, jQuery);
//# sourceMappingURL=nite.loader.js.map
