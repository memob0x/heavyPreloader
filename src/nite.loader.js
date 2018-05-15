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
            dummy = function () { },
            properties = ['memory'],
            methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
                'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
                'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
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
            return false; //If not IE
        }
        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            let evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    })();
    // - - - - - - - - - - - - - - - - - - - -

    // thanks to https://github.com/jsPolyfill/Array.prototype.findIndex
    // - - - - - - - - - - - - - - - - - - - -
    Array.prototype.findIndex = Array.prototype.findIndex || function (callback) {
        if (this === null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        } else if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }
        const
            list = Object(this),
            length = list.length >>> 0,
            thisArg = arguments[1];
        for (let i = 0; i < length; i++) {
            if (callback.call(thisArg, list[i], i, list)) {
                return i;
            }
        }
        return -1;
    };
    // - - - - - - - - - - - - - - - - - - - -

    // https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
    // - - - - - - - - - - - - - - - - - - - -
    Array.isArray = Array.isArray || function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
    // - - - - - - - - - - - - - - - - - - - -

    // thanks to https://gist.github.com/eliperelman/1031656
    // - - - - - - - - - - - - - - - - - - - -
    [].filter || (Array.prototype.filter = function (a, b, c, d, e) { c = this; d = []; for (e in c) ~~e + '' == e && e >= 0 && a.call(b, c[e], +e, c) && d.push(c[e]); return d })
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

    let innerEvents = {};

    const
        detachEventListener = (element, eventName) => {

            const _eventName = eventName.split(','),
                id = _eventName[1];

            if( id ){

                element.removeEventListener(_eventName[0], innerEvents[eventName].callback);

                delete innerEvents[id];

            }

        },
        attachEventListener = (element, eventName, callback, oneTime) => {

            let _callback = callback;

            callback = (event) => {
                
                if( oneTime ){
                    event.target.removeEventListener(event.type, arguments.callee);
                }

                _callback();

            }

            const
                _eventName = eventName.split(','),
                id = _eventName[1];

            if( id ){

                innerEvents[id] = {
                    eventName : eventName,
                    callback : callback
                };

                eventName = _eventName[0];

            }

            element.addEventListener(eventName, callback);

        },
        isInArray = (needle, stack) => {
            return stack.indexOf(needle) > -1;
        },
        capitalize = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        isVisible = (element) => {

            const
                bodyEl = document.getElementsByTagName('body')[0],
                winWidth = window.innerWidth || documnt.documentElement.clientWidth || bodyEl.clientWidth,
                winHeight = window.innerHeight || documnt.documentElement.clientHeight || bodyEl.clientHeight,
                rect = element.getBoundingClientRect();

            return !(rect.right < 0 || rect.bottom < 0 || rect.left > winWidth || rect.top > winHeight) && window.getComputedStyle(element, 'display') !== 'none';

        },
        isHTMLObject = function (object) {

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
        isLoaded = function (element) {

            return (
                typeof element === 'string'
                &&
                isInArray(element, window[pluginName + 'Cache'])
            )
                || (
                    isHTMLObject(element)
                    && ('currentSrc' in element && element.currentSrc.length)
                    && (('complete' in element && element.complete) || ('readyState' in element && element.readyState >= 2))
                );

        },
        isBroken = function (element) {

            return isLoaded(element) && (
                (
                    typeof element === 'object' && (
                        ('naturalWidth' in element && Math.floor(element.naturalWidth) === 0)
                        ||
                        ('videoWidth' in element && element.videoWidth === 0)
                    )
                )
                || typeof element === 'string' // todo check if is url maybe?
            );

        },
        isFormat = function (item, expectedFormat) {

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

    class ResourceLoader {

        constructor(options) {

            // todo make _vars really private
            // todo think about useful vars (this class is not public but its vars are returned in .progress() callback)
            this._settings = {
                srcAttr: 'data-src',
                srcsetAttr: 'data-srcset',
                playthrough: false,
                visible: false,
            };
            this._settings = { ...this._settings, ...options };

            this._id = null;
            this._id_event = null;

            this._element = null;

            this._resource = null;
            this._busy = false;

            this._format = null;

            this._done = () => {};
            this._success = () => {};
            this._error = () => {};

            this._callback = (e) => {

                this._busy = false;

                const src = this._element.currentSrc || this._element.src;

                if (!isInArray(src, window[pluginName + 'Cache']))
                    window[pluginName + 'Cache'].push(src);

                let this_arguments = [this._element, e.type, src, this._id];

                this[e.type !== 'error' ? '_success' : '_error'].apply(this, this_arguments);
                this._done.apply(this, this_arguments);

            };

        }

        set resource(data) {

            const
                element_resource = isHTMLObject(data.resource),
                string_resource = typeof data.resource === 'string';

            if (!element_resource && !string_resource) {
                return;
            }

            this._id = data.id;
            this._format = isFormat(data.resource).format;

            this._exists = element_resource; // todo maybe search for an element with this src

            if (string_resource) {

                let is_img = this._format === 'image';

                this._element = document.createElement(is_img ? 'img' : this._format);

                if (is_img) {
                    this._settings.srcsetAttr = 'data-srcset';
                }

                this._settings.srcAttr = 'data-src';

                this._resource = data.resource;

            }

            if (element_resource) {
                this._element = data.resource;
            }

            if (string_resource) {

                this._element.dataset[this._settings.srcAttr.replace('data-', '')] = this._resource;
                this._element.dataset[this._settings.srcsetAttr.replace('data-', '')] = this._resource;
                this._element.setAttribute(this._settings.srcAttr, this._resourc);
                this._element.setAttribute(this._settings.srcsetAttr, this._resourc);

            }

            this._id_event = this._element[pluginInstance + '_IDEvent'];
            this._busy = this._id_event !== undefined;
            this._id_event = this._busy ? this._id_event : pluginName + '_unique_' + this._element.tagName + '_' + generateInstanceID();

        }

        /**
         *
         * @returns {boolean} se ha preso in carico il caricamento oppure no per vari motivi (è già caricato, non è nella viewport etc)
         */
        process() {

            const
                src = this._settings.srcAttr,
                src_clean = this._settings.srcAttr.replace('data-', '');

            if (isLoaded(this._exists ? this._element : this._resource)) {

                if (!this._busy) {
                    detachEventListener(this._elemnt, '.' + this._id_event); //TODO: this should be called when in callback
                }

                this._callback(new CustomEvent(!isBroken(this._exists ? this._element : this._resource) ? 'load' : 'error'));

                return false;

            } else if (this._exists && this._settings.visible && !isVisible(this._element)) {

                return false;

            } else {

                if (this._format === 'image') {

                    attachEventListener(this._element, 'load.' + this._id_event, this._callback, !this._busy);
                    attachEventListener(this._element, 'error.' + this._id_event, this._callback, !this._busy);

                    const
                        picture = this._element.closest('picture'),
                        srcset = this._settings.srcsetAttr,
                        srcset_clean = this._settings.srcsetAttr.replace('data-', '');

                    if (picture && 'HTMLPictureElement' in window) {

                        delete this._element.dataset[srcset_clean];
                        delete this._element.dataset[src_clean];
                        this._element.removeAttribute(srcset);
                        this._element.removeAttribute(src);

                        picture.queryAll('source[' + srcset + ']').forEach((el) => {
                            el.addAttribute('srcset', this._element.dataset[srcset_clean]);
                            delete this._element.dataset[srcset_clean];
                            el.removeAttribute(srcset);
                        });

                    } else {

                        if (this._element.matches('[' + srcset + ']')) {
                            this._element.addAttribute('srcset', this._element.dataset[srcset_clean]);
                            delete this._element.dataset[srcset_clean];
                            this._element.removeAttribute(srcset);
                        }

                        if (this._element.matches('[' + src + ']')) {
                            this._element.addAttribute('src', this._element.dataset[src_clean]);
                            delete this._element.dataset[src_clean];
                            this._element.removeAttribute(src);
                        }

                    }

                } else if (this._format === 'video' || this._format === 'audio') {

                    const

                        is_playthrough_mode__normal = true === this._settings.playthrough,
                        is_playthrough_mode__full = 'full' === this._settings.playthrough,

                        sources = this._element.queryAll('source'),
                        isFullyBuffered = function (media) {

                            return media.buffered.length && Math.round(media.buffered.end(0)) / Math.round(media.seekable.end(0)) === 1;

                        };

                    let call_media_load = false;

                    if (sources) {

                        sources.forEach((source) => {

                            if (source.matches('[' + src + ']')) {

                                source.setAttribute('src', source.dataset[src_clean]);
                                delete source.dataset[src_clean];
                                source.removeAttribute(src);

                                call_media_load = true;

                            }

                            attachEventListener(source, 'error.' + this._id_event, (e) => {

                                const sources_error_id = pluginName + '_error';
    
                                source[pluginInstance + '_' + sources_error_id] = true;
    
                                if ( sources.length === sources.filter(() => true === source[pluginInstance + '_' + sources_error_id] ).length ) {
                                    this._callback(e);
                                }
    
                            }, !this._busy);

                        });

                    } else {

                        if (this._element.matches('[' + src + ']')) {

                            this._element.setAttribute('src', this._$element.data(src_clean));
                            delete this._element.dataset[src_clean];
                            this._element.removeAttribute(src);

                            attachEventListener(this._element, 'error.' + this._id_event, this._callback, !this._busy);

                            call_media_load = true;

                        }

                    }

                    if (call_media_load) {
                        this._element.load();
                    }


                    attachEventListener(this._element, 'loadedmetadata.' + this._id_event, () => {

                        if (!is_playthrough_mode__normal && !is_playthrough_mode__full) {
                            this._callback(new CustomEvent('load'));
                        }

                        if (is_playthrough_mode__full) {

                            let on_progress_replacement_interval = setInterval(() => {

                                let is_error = this._element.readyState > 0 && !this._element.duration;

                                if (is_error || isFullyBuffered(this._element)) {

                                    this._element.currentTime = 0;

                                    if (!is_error && !this._busy && this._element.paused && this._element.matches('[autoplay]')) {
                                        this._element.play();
                                    }

                                    clearInterval(on_progress_replacement_interval);

                                    this._callback(new CustomEvent(!is_error ? 'load' : 'error'));

                                } else {

                                    if (!this._element.paused) {
                                        this._element.pause();
                                    }

                                    if (!this._busy) {
                                        this._element.currentTime += 2;
                                    }

                                }

                            }, 500);

                            this._element[ pluginName +'_'+ this._id_event ] = on_progress_replacement_interval;

                        }

                    }, !this._busy);

                    attachEventListener(this._element, 'canplay.' + this._id_event, () => {
                        if (is_playthrough_mode__full && this._element.currentTime === 0 && !isFullyBuffered(this._element)) {
                            this._element.currentTime++;
                        }
                    }, !this._busy);

                    attachEventListener(this._element, 'canplaythrough.' + this._id_event, () => {
                        if (is_playthrough_mode__normal) {
                            this._callback(new CustomEvent('load'));
                        }
                    }, !this._busy);

                } else {

                    return false;

                }

                if (!this._busy) {
                    this._element[pluginInstance + '_IDEvent'] = this._id_event;
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

            detachEventListener(this._elemnt, '.' + this._id_event);

            if (isLoaded(this._exists ? this._element : this._resource)) {
                return;
            }

            const
                src = this._element.getAttribute('srcset'),
                srcset = this._element.getAttribute('src');

            if (undefined !== src) {
                this._element.dataset[src] = this._settings.srcAttr;
                this._element.setAttribute(this._settings.srcAttr, src);
                this._element.removeAttribute('src');
                this._element.removeAttribute('srcset');
            }

            if (undefined !== srcset) {
                this._element.dataset[srcset] = this._settings.srcsetAttr;
                this._element.setAttribute(this._settings.srcsetAttr, srcset);
                this._element.removeAttribute('src');
                this._element.removeAttribute('srcset');
            }

        }

    }

    class ResourcesLoader {

        constructor(collection, options) {

            // todo make _vars really private
            this._collection = [];
            this._collection_loaded = [];
            this._collection_instances = [];
            this._collection_pending = [];
            this._resources_loaded = [];

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

            this._settings = {
                srcAttr: 'data-src',
                srcsetAttr: 'data-srcset',
                playthrough: false,
                visible: false,
            };
            this._settings = { ...this._settings, ...options };

            this.percentage = 0;

            this._done = () => { };
            this._progress = () => { };
            this._success = () => { };
            this._error = () => { };

            this._abort = false;
            this._loaded = 0;
            this._complete = false;
            this._busy = false;

            // self invoking this._loop + force asynchrony (gives time to chain methods synchronously)
            (this._loop = () => setTimeout(() => this.loop(), 25))();

        }

        loop() {

            this._collection_pending = []; // resets pending elements (sequential opt helper array) every time we loop

            const sequential_mode = true === this._settings.sequential;

            for (let i = 0; i < this._collection.length; i++) {

                if (this._abort) {
                    break;
                }

                let this_load_id = this._collection[i].id,
                    this_load_index = this._collection_instances.findIndex(x => x.id === this_load_id),
                    this_load_instance = new ResourceLoader(this._settings);

                if (this_load_index === -1) {
                    this._collection_instances.push({ id: this_load_id, instance: this_load_instance });
                    this_load_index = this._collection_instances.findIndex(x => x.id === this_load_id);
                } else {
                    this._collection_instances[this_load_index].instance = this_load_instance;
                }

                this_load_instance.resource = this._collection[i];

                this_load_instance.done((element, status, resource, id) => {

                    if (this._complete || this._abort) {
                        return;
                    }

                    let a_progress = !isInArray(id, this._collection_loaded);

                    if (a_progress) {

                        this._collection_loaded.push(id);
                        this._busy = false;

                        this._loaded++;
                        this.percentage = this._loaded / this._collection.length * 100;
                        this.percentage = parseFloat(this.percentage.toFixed(4));

                        let this_resource = { resource: resource, status: status };
                        this._resources_loaded.push(this_resource);

                        this._progress.call(this, this_resource);
                        this[status !== 'error' ? '_success' : '_error'].call(this, this_resource);

                        if( $ ){ // TODO: clean?
                            $(element).trigger(pluginPrefix + capitalize(status) + '.' + pluginPrefix, [element, resource]);
                        }

                    }

                    if (this._loaded === this._collection.length) {

                        this._done.call(this, this._resources_loaded);

                        this._complete = true;

                    } else if (a_progress && sequential_mode) {

                        if (this._collection_pending.length) {

                            this._collection_pending = this._collection_pending.filter(x => x.id !== id);
                            this._collection_pending = this._collection_pending.filter(x => x.id !== id);

                            if (this._collection_pending.length) {
                                this._busy = this._collection_pending[0].instance.process();
                            }

                        }

                    }

                });

                if (!sequential_mode || (sequential_mode && !this._busy)) {
                    this._busy = this_load_instance.process();
                }

                else if (sequential_mode && this._busy) {

                    if (!this._settings.visible || (this._settings.visible && isVisible(this_load_instance._element))) {
                        this._collection_pending.push({ id: this_load_id, instance: this_load_instance });
                    }

                }


            }

        }

        done(callback) { // todo refactory

            if (typeof callback !== 'function') {
                return;
            }

            const _func = function (resources) {
                callback.call(this, resources);
            };

            if (this._collection.length) {

                this._done = _func;

                this._loop();

            } else {
                _func();
            }

        };

        progress(callback) { // todo refactory

            if (typeof callback !== 'function')
                return;

            const _func = function (resource) {
                callback.call(this, resource);
            };

            if (this._collection.length) {

                this._progress = _func;

                this._loop();

            }

        };

        success(callback) { // todo refactory

            if (typeof callback !== 'function') {
                return;
            }

            const _func = function (resource) {
                callback.call(this, resource);
            };

            if (this._collection.length) {

                this._success = _func;

                this._loop();

            }

        };

        error(callback) { // todo refactory

            if (typeof callback !== 'function') {
                return;
            }

            const _func = function (resource) {
                callback.call(this, resource);
            };

            if (this._collection.length) {

                this._error = _func;

                this._loop();

            }

        };

        abort() {

            for (const key in this._collection_instances) {
                this._collection_instances[key].instance.abort();
            }

            if (this._collection.length) {
                this._abort = true;
            }

        };

    }

    // vanilla public interface
    // - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // requirejs syntax
    if (typeof define === 'function' && define.amd) {
        define(pluginMethod, pluginMethod);
        // nodejs syntax
    } else if ('object' === typeof exports) {
        module.exports[pluginMethod] = pluginMethod;
        // standard "global variable" syntax
    } else {
        window[pluginMethod] = pluginMethod;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // from here jQuery is needed
    // - - - - - - - - - - - - - - - - - - - -
    if (!$) {
        return undefined;
    }
    // - - - - - - - - - - - - - - - - - - - -

    $[pluginMethod] = ResourcesLoader;

    class CollectionPopulator {

        constructor($element, options) {

            this._$element = $element;
            this._element = $element[0];

            this._settings = {
                srcAttr: 'data-src',
                srcsetAttr: 'data-srcset',
                backgrounds: false,
                attributes: []
            };
            this._settings = {...this._settings, ...options};

        }

        collect(output) {

            let collection = [];

            const
                is_plain_data_collection = output === 'plain',

                src = this._settings.srcAttr,
                srcset = this._settings.srcsetAttr,

                targets = 'img, video, audio',
                targets_extended = targets + ', picture, source';

            let $targets = this._$element.find(targets);
            if (this._$element.is(targets)) {
                $targets = $targets.add(this._$element);
            }
            $targets = $targets.filter(function () {
                let $t = $(this),
                    filter = '[' + src + '], [' + srcset + ']';
                return $t.is(filter) || $t.children(targets_extended).filter(filter).length;
            });
            $targets.each(function () {

                let collection_item = {
                    element: this,
                    resource: $(this).attr(src) || $(this).attr(srcset)
                };

                if (is_plain_data_collection) {
                    collection_item = collection_item.element;
                }

                collection.push(collection_item);

            });

            if (true === this._settings.backgrounds)
                this._$element.find('*').addBack().not(targets_extended).filter(function () {
                    return $(this).css('background-image') !== 'none';
                }).each(function () {

                    const url = $(this).css('background-image').match(/\((.*?)\)/);

                    if (null === url || url.length < 2) {
                        return true;
                    }

                    let collection_item = {
                        element: this,
                        resource: url[1].replace(/('|")/g, '')
                    };

                    if (is_plain_data_collection) {
                        collection_item = collection_item.resource;
                    }

                    collection.push(collection_item);

                });

            if (this._settings.attributes.length)
                for (const attr in this._settings.attributes) {
                    if (this._settings.attributes.hasOwnProperty(attr)) {

                        this._$element.find('[' + attr + ']:not(' + targets_extended + ')').each(function () {

                            let collection_item = {
                                element: this,
                                resource: $(this).attr(attr)
                            };

                            if (is_plain_data_collection) {
                                collection_item = collection_item.resource;
                            }

                            collection.push(collection_item);

                        });

                        if (this._$element.is('[' + attr + ']') && !this._$element.is(targets_extended)) {

                            let collection_item = {
                                element: this._element,
                                resource: this._$element.attr(attr)
                            };

                            if (is_plain_data_collection) {
                                collection_item = collection_item.resource;
                            }

                            collection.push(collection_item);

                        }

                    }
                }

            return collection;

        }

    }

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

    let method_collection = [];

    $.fn[pluginMethod] = function (options) {

        let original_user_options = options;

        if (typeof options !== 'object') {
            options = {};
        }

        let settings = {

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

        };
        settings = {...settings,...options};

        let callback = settings.onComplete;
        if ($.isFunction(original_user_options)) {
            callback = original_user_options;
        }

        if (!$.isArray(settings.attributes)) {
            settings.attributes = [];
        }
        if (typeof settings.attributes === 'string') {
            settings.attributes = settings.attributes.split(' ');
        }

        return this.each(function (i) {

            const
                element = this,
                $element = $(element),
                collection = new CollectionPopulator($element, settings).collect('plain'),
                unique_method_pluginName = generateInstanceID() + i,

                this_load_instance = new ResourcesLoader(collection, settings);

            method_collection.push({
                id: unique_method_pluginName,
                instance: this_load_instance,
                element: element,
                timeout: null
            });

            this_load_instance.progress(function (resource) {

                $element.trigger(pluginPrefix + 'Progress.' + pluginPrefix, [element, resource]);

                const this_arguments = [this_load_instance, resource];

                if (typeof settings.onProgress === 'function') {
                    settings.onProgress.apply(element, this_arguments);
                }

                let event_name = capitalize(resource.status);
                if (typeof settings['on' + event_name] === 'function') {
                    settings['on' + event_name].apply(element, this_arguments);
                }

            });

            this_load_instance.done(function (resources) {

                $element.trigger(pluginPrefix + 'Complete.' + pluginPrefix, [element, resources]);
                callback.apply(element, [this_load_instance, resources]);

                if (settings.visible) {
                    $window.off('scroll.' + unique_method_pluginName);
                }

                // refresh other method calls for same el (omitting this one)
                method_collection = method_collection.filter(x => x.id !== unique_method_pluginName);
                method_collection.forEach((this_method_collection) => {
                    if ($element.is(this_method_collection.element)) {
                        this_method_collection.instance.loop();
                    }
                });

            });

            if (settings.visible) {
                $window.on('scroll.' + unique_method_pluginName, throttle(() => this_load_instance.loop(), 250));
            }

            if (true === settings.early) for (let key in method_collection) {

                let this_method_collection = method_collection[key];

                if (method_collection[key].id === unique_method_pluginName) {

                    clearTimeout(this_method_collection.timeout);

                    let timeout = parseInt(settings.earlyTimeout);

                    this_method_collection.timeout = setTimeout(function () {

                        // todo appropriate method for setting settings?
                        this_method_collection.instance._settings.visible = false;
                        this_method_collection.instance._settings.sequential = true;

                        this_method_collection.instance.loop();

                    }, !isNaN(timeout) && isFinite(timeout) ? timeout : 0);

                    break;

                }

            }

        });

    };

})(window, document, jQuery);