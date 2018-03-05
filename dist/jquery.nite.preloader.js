'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*! JQuery Nite Preloader | Daniele Fioroni | dfioroni91@gmail.com */
(function (window, document, $, undefined) {
    'use strict';

    var namespace_prefix = 'nite',
        namespace_method = namespace_prefix + 'Preload',
        namespace = namespace_method + 'er';

    // thanks to https://github.com/paulmillr/console-polyfill
    // - - - - - - - - - - - - - - - - - - - -
    (function (global) {
        if (!global.console) global.console = {};
        var con = global.console,
            prop = void 0,
            method = void 0,
            dummy = function dummy() {},
            properties = ['memory'],
            methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' + 'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' + 'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
        while (prop = properties.pop()) {
            if (!con[prop]) con[prop] = {};
        }while (method = methods.pop()) {
            if (!con[method]) con[method] = dummy;
        }
    })(window);
    // - - - - - - - - - - - - - - - - - - - -


    // - - - - - - - - - - - - - - - - - - - -
    if (!$) {
        console.error('jQuery is needed for ' + namespace + ' to work!');
        return undefined;
    }
    // - - - - - - - - - - - - - - - - - - - -


    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
    // - - - - - - - - - - - - - - - - - - - -
    (function () {

        if (typeof window.CustomEvent === "function") return false; //If not IE

        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;

        window.CustomEvent = CustomEvent;
    })();
    // - - - - - - - - - - - - - - - - - - - -


    // thanks to https://github.com/jsPolyfill/Array.prototype.findIndex
    // todo check efficiency and reliability in MS Internet Explorer
    // - - - - - - - - - - - - - - - - - - - -
    Array.prototype.findIndex = Array.prototype.findIndex || function (callback) {
        if (this === null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        } else if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }
        var list = Object(this),

        // Makes sures is always has an positive integer as length.
        length = list.length >>> 0,
            thisArg = arguments[1];
        for (var i = 0; i < length; i++) {
            if (callback.call(thisArg, list[i], i, list)) {
                return i;
            }
        }
        return -1;
    };
    // - - - - - - - - - - - - - - - - - - - -


    // thanks to https://gist.github.com/eliperelman/1031656
    // todo check efficiency and reliability in MS Internet Explorer
    // - - - - - - - - - - - - - - - - - - - -
    [].filter || (Array.prototype.filter = function (a, b, c, d, e) {
        c = this;d = [];for (e in c) {
            ~~e + '' == e && e >= 0 && a.call(b, c[e], +e, c) && d.push(c[e]);
        }return d;
    });
    // - - - - - - - - - - - - - - - - - - - -


    var cache = [];

    var capitalize = function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
        $document = $(document),
        $window = $(window),
        unique_id = function unique_id() {

        return $.nite && 'uniqueId' in $.nite ? $.nite.uniqueId() : Math.floor(Math.random() * (9999 - 1000)) + 1000;
    },
        is_visible = function is_visible(element) {

        var $el = $(element);

        var in_viewport = false;

        if ($.nite && 'inViewport' in $.nite) in_viewport = $.nite.inViewport(element).ratio;else {

            var rect = element.getBoundingClientRect();

            in_viewport = !(rect.right < 0 || rect.bottom < 0 || rect.left > $window.width() || rect.top > $window.height());
        }

        return in_viewport && $el.is(':visible') && $el.css('visibility') !== 'hidden';
    },
        is_html_object = function is_html_object(object) {

        if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') return false;

        try {
            return object instanceof HTMLElement;
        } catch (e) {
            return object.nodeType === 1 && _typeof(object.style) === 'object' && _typeof(object.ownerDocument) === 'object';
        }
    },
        is_loaded = function is_loaded(element) {

        return typeof element === 'string' && $.inArray(element, cache) > -1 || is_html_object(element) && 'currentSrc' in element && element.currentSrc.length && ('complete' in element && element.complete || 'readyState' in element && element.readyState >= 2);
    },
        is_broken = function is_broken(element) {

        return is_loaded(element) && ((typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && ('naturalWidth' in element && Math.floor(element.naturalWidth) === 0 || 'videoWidth' in element && element.videoWidth === 0) || typeof element === 'string' // todo check if is url maybe?
        );
    },
        is_format = function is_format(item, expected_format) {

        var format_extensions = {
            image: 'jp[e]?g|gif|png|tif[f]?|bmp',
            audio: 'mp3|ogg',
            video: 'mp4|ogv|ogg|webm'
        },
            format_names = Object.keys(format_extensions),
            base64_heading = '\;base64\,';

        var output = { format: null, extension: null };

        if (typeof item === 'string') {

            item = item.split('?')[0]; // get rid of query strings
            item = item.split('#')[0]; // get rid of hashes

            if (item === '') return false;

            var format_queue = undefined !== expected_format ? [expected_format] : format_names;

            for (var x in format_queue) {

                if (format_queue.hasOwnProperty(x)) {

                    if (new RegExp('(\.(' + format_extensions[format_queue[x]] + ')$)|' + base64_heading, 'g').test(item)) {

                        if (new RegExp(base64_heading, 'g').test(item)) {

                            var matches64 = item.match(new RegExp('^data:' + format_queue[x] + '\/(' + format_extensions[format_queue[x]] + ')', 'g'));

                            if (!matches64 || null === matches64) continue;

                            matches64 = matches64[0];

                            output.format = format_queue[x];
                            output.extension = matches64.replace('data:' + format_queue[x] + '/', '');

                            break;
                        } else {

                            var matches = item.match(new RegExp(format_extensions[format_queue[x]], 'g'));

                            if (matches) {

                                output.format = format_queue[x];
                                output.extension = matches[0];

                                break;
                            }
                        }
                    }
                }
            }
        }

        if (is_html_object(item)) {

            var tag_name = item.tagName.toLowerCase();

            if ($.inArray(tag_name, format_names) > -1) output.format = item.tagName.toLowerCase();

            if (tag_name === 'img') output.format = 'image';
        }

        return output;
    };

    var ResourceLoader = function () {
        function ResourceLoader(options) {
            var _this = this;

            _classCallCheck(this, ResourceLoader);

            // todo make _vars really private
            // todo make useful vars since this class is not public but is returned in .progress() callback
            this._settings = $.extend(true, {
                srcAttr: 'data-src',
                srcsetAttr: 'data-srcset',
                playthrough: false,
                visible: false
            }, options);

            this._id = null;
            this._id_event = null;

            this._element = null;
            this._$element = $();

            this._resource = null;
            this._busy = false;

            this._format = null;

            this._done = $.noop;
            this._success = $.noop;
            this._error = $.noop;

            this._callback = function (e) {

                _this._$element.removeData(namespace);

                _this._busy = false;

                var src = _this._element.currentSrc || _this._element.src;

                if ($.inArray(src, cache) === -1) cache.push(src);

                var this_arguments = [_this._element, e.type, src, _this._id];

                _this[e.type !== 'error' ? '_success' : '_error'].apply(_this, this_arguments);
                _this._done.apply(_this, this_arguments);
            };
        }

        _createClass(ResourceLoader, [{
            key: 'process',


            /**
             *
             * @returns {boolean} se ha preso in carico il caricamento oppure no per vari motivi (è già caricato, non è nella viewport etc)
             */
            value: function process() {
                var _this2 = this;

                var src = this._settings.srcAttr,
                    src_clean = this._settings.srcAttr.replace('data-', '');

                if (is_loaded(this._exists ? this._element : this._resource)) {

                    if (!this._busy) this._$element.off('.' + this._id_event); // todo this should be called when in callback

                    this._callback(new CustomEvent(!is_broken(this._exists ? this._element : this._resource) ? 'load' : 'error'));

                    return false;
                } else if (this._exists && this._settings.visible && !is_visible(this._element)) {

                    return false;
                } else {

                    if (this._format === 'image') {

                        this._$element[this._busy ? 'on' : 'one']('load.' + this._id_event + ' error.' + this._id_event, this._callback);

                        var $picture = this._$element.closest('picture'),
                            srcset = this._settings.srcsetAttr,
                            srcset_clean = this._settings.srcsetAttr.replace('data-', '');

                        if ($picture.length && 'HTMLPictureElement' in window) {

                            this._$element.removeData(srcset_clean).removeAttr(srcset).removeData(src_clean).removeAttr(src);

                            $picture.find('source[' + srcset + ']').attr('srcset', $picture.data(srcset_clean)).removeData(srcset_clean).removeAttr(srcset);
                        } else {

                            if (this._$element.is('[' + srcset + ']')) this._$element.attr('srcset', this._$element.data(srcset_clean)).removeData(srcset_clean).removeAttr(srcset);

                            if (this._$element.is('[' + src + ']')) this._$element.attr('src', this._$element.data(src_clean)).removeData(src_clean).removeAttr(src);
                        }
                    } else if (this._format === 'video' || this._format === 'audio') {

                        var is_playthrough_mode__normal = true === this._settings.playthrough,
                            is_playthrough_mode__full = 'full' === this._settings.playthrough,
                            $sources = this._$element.find('source'),
                            is_fully_buffered = function is_fully_buffered(media) {

                            return media.buffered.length && Math.round(media.buffered.end(0)) / Math.round(media.seekable.end(0)) === 1;
                        };

                        var call_media_load = false;

                        if ($sources.length) {

                            var self = this; // todo arrow func ?

                            $sources.each(function () {

                                var $t = $(this);

                                if ($t.is('[' + src + ']')) {

                                    $t.attr('src', $t.data(src_clean)).removeData(src_clean).removeAttr(src);

                                    call_media_load = true;
                                }
                            })[this._busy ? 'on' : 'one']('error.' + this._id_event, function (e) {

                                var sources_error_id = namespace + '_error';

                                $(this).data(sources_error_id, true);

                                if ($sources.length === $sources.filter(function () {
                                    return true === $(this).data(sources_error_id);
                                }).length) self._callback(e);
                            });
                        } else {

                            if (this._$element.is('[' + src + ']')) {

                                this._$element.attr('src', this._$element.data(src_clean)).removeData(src_clean).removeAttr(src)[this._busy ? 'on' : 'one']('error.' + this._id_event, this._callback);

                                call_media_load = true;
                            }
                        }

                        if (call_media_load) this._element.load();

                        this._$element[this._busy ? 'on' : 'one']('loadedmetadata.' + this._id_event, function () {

                            if (!is_playthrough_mode__normal && !is_playthrough_mode__full) _this2._callback(new CustomEvent('load'));

                            if (is_playthrough_mode__full) {

                                var on_progress_replacement_interval = setInterval(function () {

                                    var is_error = _this2._element.readyState > 0 && !_this2._element.duration;

                                    if (is_error || is_fully_buffered(_this2._element)) {

                                        _this2._element.currentTime = 0;

                                        if (!is_error && !_this2._busy && _this2._element.paused && _this2._$element.is('[autoplay]')) _this2._element.play();

                                        clearInterval(on_progress_replacement_interval);

                                        _this2._callback(new CustomEvent(!is_error ? 'load' : 'error'));
                                    } else {

                                        if (!_this2._element.paused) _this2._element.pause();

                                        if (!_this2._busy) _this2._element.currentTime += 2;
                                    }
                                }, 500);

                                _this2._$element.data(_this2._id_event, on_progress_replacement_interval);
                            }
                        })[this._busy ? 'on' : 'one']('canplay.' + this._id_event, function () {

                            if (is_playthrough_mode__full && _this2._element.currentTime === 0 && !is_fully_buffered(_this2._element)) _this2._element.currentTime++;
                        })[this._busy ? 'on' : 'one']('canplaythrough.' + this._id_event, function () {

                            if (is_playthrough_mode__normal) _this2._callback(new CustomEvent('load'));
                        });
                    } else {

                        return false;
                    }

                    if (!this._busy) this._$element.data(namespace, this._id_event);
                }

                this._resource = this._element.currentSrc || this._element.src;

                return !this._busy;
            }
        }, {
            key: 'done',
            value: function done(callback) {

                if (!$.isFunction(callback)) return;

                this._done = function (element, status, resource, id) {
                    callback.apply(this, [element, status, resource, id]);
                };
            }
        }, {
            key: 'abort',
            value: function abort() {

                this._$element.off('.' + this._id_event);

                if (is_loaded(this._exists ? this._element : this._resource)) return;

                var src = this._$element.attr('srcset'),
                    srcset = this._$element.attr('src');

                if (undefined !== src) this._$element.data(this._settings.srcAttr, src).attr(this._settings.srcAttr, src).removeAttr('src').removeAttr('srcset');

                if (undefined !== srcset) this._$element.data(this._settings.srcsetAttr, srcset).attr(this._settings.srcsetAttr, srcset).removeAttr('src').removeAttr('srcset');
            }
        }, {
            key: 'resource',
            set: function set(data) {

                var element_resource = is_html_object(data.resource),
                    string_resource = typeof data.resource === 'string';

                if (!element_resource && !string_resource) return;

                this._id = data.id;
                this._format = is_format(data.resource).format;

                this._exists = element_resource; // todo maybe search for an element with this src

                if (string_resource) {

                    var is_img = this._format === 'image';

                    this._element = document.createElement(is_img ? 'img' : this._format);

                    if (is_img) this._settings.srcsetAttr = 'data-srcset';
                    this._settings.srcAttr = 'data-src';

                    this._resource = data.resource;
                }

                if (element_resource) this._element = data.resource;

                this._$element = $(this._element);

                if (string_resource) {

                    this._$element.data(this._settings.srcAttr.replace('data-', ''), this._resource).data(this._settings.srcsetAttr.replace('data-', ''), this._resource).attr(this._settings.srcAttr, this._resource).attr(this._settings.srcsetAttr, this._resource);
                }

                this._id_event = this._$element.data(namespace);
                this._busy = this._id_event !== undefined;
                this._id_event = this._busy ? this._id_event : namespace + '_unique_' + this._element.tagName + '_' + unique_id();
            }
        }]);

        return ResourceLoader;
    }();

    var ResourcesLoader = function () {
        function ResourcesLoader(collection, options) {
            var _this3 = this;

            _classCallCheck(this, ResourcesLoader);

            // todo make _vars really private
            this._collection = [];
            this._collection_loaded = [];
            this._collection_instances = [];
            this._collection_pending = [];
            this._resources_loaded = [];

            if ($.isArray(collection) && (typeof collection[0] === 'string' || is_html_object(collection[0]))) for (var resource in collection) {
                if (collection.hasOwnProperty(resource)) this._collection.push({ id: unique_id(), resource: collection[resource] });
            }if (typeof collection === 'string' || is_html_object(collection)) this._collection.push({ id: unique_id(), resource: collection });

            this._settings = $.extend(true, {
                srcAttr: 'data-src',
                srcsetAttr: 'data-srcset',
                playthrough: false,
                visible: false
            }, options);

            this.percentage = 0;

            this._done = $.noop;
            this._progress = $.noop;
            this._success = $.noop;
            this._error = $.noop;

            this._abort = false;
            this._loaded = 0;
            this._complete = false;
            this._busy = false;

            (this._loop = function () {
                // self invoking this._loop
                setTimeout(function () {
                    // force asynchrony (gives time to chain methods synchronously)
                    _this3.loop();
                }, 25);
            })();
        }

        _createClass(ResourcesLoader, [{
            key: 'loop',
            value: function loop() {
                var _this4 = this;

                this._collection_pending = []; // resets pending elements (sequential opt helper array) every time we loop

                var sequential_mode = true === this._settings.sequential;

                var _loop = function _loop(i) {

                    if (_this4._abort) return 'break';

                    var this_load_id = _this4._collection[i].id,
                        this_load_index = _this4._collection_instances.findIndex(function (x) {
                        return x.id === this_load_id;
                    }),
                        this_load_instance = new ResourceLoader(_this4._settings);

                    if (this_load_index === -1) {
                        _this4._collection_instances.push({ id: this_load_id, instance: this_load_instance });
                        this_load_index = _this4._collection_instances.findIndex(function (x) {
                            return x.id === this_load_id;
                        });
                    } else _this4._collection_instances[this_load_index].instance = this_load_instance;

                    this_load_instance.resource = _this4._collection[i];

                    this_load_instance.done(function (element, status, resource, id) {

                        if (_this4._complete || _this4._abort) return;

                        var a_progress = $.inArray(id, _this4._collection_loaded) === -1;

                        if (a_progress) {

                            _this4._collection_loaded.push(id);
                            _this4._busy = false;

                            _this4._loaded++;
                            _this4.percentage = _this4._loaded / _this4._collection.length * 100;
                            _this4.percentage = parseFloat(_this4.percentage.toFixed(4));

                            var this_resource = { resource: resource, status: status };
                            _this4._resources_loaded.push(this_resource);

                            _this4._progress.call(_this4, this_resource);
                            _this4[status !== 'error' ? '_success' : '_error'].call(_this4, this_resource);

                            $(element).trigger(namespace_prefix + capitalize(status) + '.' + namespace_prefix, [element, resource]);
                        }

                        if (_this4._loaded === _this4._collection.length) {

                            _this4._done.call(_this4, _this4._resources_loaded);

                            _this4._complete = true;
                        } else if (a_progress && sequential_mode) {

                            if (_this4._collection_pending.length) {

                                _this4._collection_pending = _this4._collection_pending.filter(function (x) {
                                    return x.id !== id;
                                });
                                _this4._collection_pending = _this4._collection_pending.filter(function (x) {
                                    return x.id !== id;
                                });

                                if (_this4._collection_pending.length) _this4._busy = _this4._collection_pending[0].instance.process();
                            }
                        }
                    });

                    if (!sequential_mode || sequential_mode && !_this4._busy) _this4._busy = this_load_instance.process();else if (sequential_mode && _this4._busy) {

                        if (!_this4._settings.visible || _this4._settings.visible && is_visible(this_load_instance._element)) _this4._collection_pending.push({ id: this_load_id, instance: this_load_instance });
                    }
                };

                for (var i = 0; i < this._collection.length; i++) {
                    var _ret = _loop(i);

                    if (_ret === 'break') break;
                }
            }
        }, {
            key: 'done',
            value: function done(callback) {
                // todo refactory

                if (!$.isFunction(callback)) return;

                var _func = function _func(resources) {
                    callback.call(this, resources);
                };

                if (this._collection.length) {

                    this._done = _func;

                    this._loop();
                } else _func();
            }
        }, {
            key: 'progress',
            value: function progress(callback) {
                // todo refactory

                if (!$.isFunction(callback)) return;

                var _func = function _func(resource) {
                    callback.call(this, resource);
                };

                if (this._collection.length) {

                    this._progress = _func;

                    this._loop();
                }
            }
        }, {
            key: 'success',
            value: function success(callback) {
                // todo refactory

                if (!$.isFunction(callback)) return;

                var _func = function _func(resource) {
                    callback.call(this, resource);
                };

                if (this._collection.length) {

                    this._success = _func;

                    this._loop();
                }
            }
        }, {
            key: 'error',
            value: function error(callback) {
                // todo refactory

                if (!$.isFunction(callback)) return;

                var _func = function _func(resource) {
                    callback.call(this, resource);
                };

                if (this._collection.length) {

                    this._error = _func;

                    this._loop();
                }
            }
        }, {
            key: 'abort',
            value: function abort() {

                for (var key in this._collection_instances) {
                    this._collection_instances[key].instance.abort();
                }if (this._collection.length) this._abort = true;
            }
        }]);

        return ResourcesLoader;
    }();

    var CollectionPopulator = function () {
        function CollectionPopulator($element, options) {
            _classCallCheck(this, CollectionPopulator);

            this._$element = $element;
            this._element = $element[0];

            this._settings = $.extend(true, {
                srcAttr: 'data-src',
                srcsetAttr: 'data-srcset',
                backgrounds: false,
                attributes: []
            }, options);
        }

        _createClass(CollectionPopulator, [{
            key: 'collect',
            value: function collect(output) {

                var collection = [];

                var is_plain_data_collection = output === 'plain',
                    src = this._settings.srcAttr,
                    srcset = this._settings.srcsetAttr,
                    targets = 'img, video, audio',
                    targets_extended = targets + ', picture, source';

                var $targets = this._$element.find(targets);
                if (this._$element.is(targets)) $targets = $targets.add(this._$element);
                $targets = $targets.filter(function () {
                    var $t = $(this),
                        filter = '[' + src + '], [' + srcset + ']';
                    return $t.is(filter) || $t.children(targets_extended).filter(filter).length;
                });
                $targets.each(function () {

                    var collection_item = {
                        element: this,
                        resource: $(this).attr(src) || $(this).attr(srcset)
                    };

                    if (is_plain_data_collection) collection_item = collection_item.element;

                    collection.push(collection_item);
                });

                if (true === this._settings.backgrounds) this._$element.find('*').addBack().not(targets_extended).filter(function () {
                    return $(this).css('background-image') !== 'none';
                }).each(function () {

                    var url = $(this).css('background-image').match(/\((.*?)\)/);

                    if (null === url || url.length < 2) return true;

                    var collection_item = {
                        element: this,
                        resource: url[1].replace(/('|")/g, '')
                    };

                    if (is_plain_data_collection) collection_item = collection_item.resource;

                    collection.push(collection_item);
                });

                if (this._settings.attributes.length) {
                    var _loop2 = function (attr) {
                        if (this._settings.attributes.hasOwnProperty(attr)) {

                            this._$element.find('[' + attr + ']:not(' + targets_extended + ')').each(function () {

                                let collection_item = {
                                    element: this,
                                    resource: $(this).attr(attr)
                                };

                                if (is_plain_data_collection) collection_item = collection_item.resource;

                                collection.push(collection_item);
                            });

                            if (this._$element.is('[' + attr + ']') && !this._$element.is(targets_extended)) {

                                let collection_item = {
                                    element: this._element,
                                    resource: this._$element.attr(attr)
                                };

                                if (is_plain_data_collection) collection_item = collection_item.resource;

                                collection.push(collection_item);
                            }
                        }
                    };

                    for (const attr in this._settings.attributes) {
                        _loop2(attr);
                    }
                }return collection;
            }
        }]);

        return CollectionPopulator;
    }();

    $[namespace_method] = ResourcesLoader;

    var method_collection = [];

    $.fn[namespace_method] = function (options) {

        var original_user_options = options;

        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') options = {};

        var settings = $.extend(true, {

            srcAttr: 'data-src',
            srcsetAttr: 'data-srcset',

            visible: false,

            sequential: false,

            backgrounds: false,
            extraAttrs: [],

            playthrough: false,

            early: false,
            earlyTimeout: 0,

            onProgress: $.noop,
            onLoad: $.noop,
            onError: $.noop,

            onComplete: $.noop

        }, options);

        var callback = settings.onComplete;
        if ($.isFunction(original_user_options)) callback = original_user_options;

        if (!$.isArray(settings.attributes)) settings.attributes = [];
        if (typeof settings.attributes === 'string') settings.attributes = settings.attributes.split(' ');

        return this.each(function () {

            var element = this,
                $element = $(element),
                collection = new CollectionPopulator($element, settings).collect('plain'),
                unique_method_namespace = namespace + '_' + unique_id(),
                this_load_instance = new ResourcesLoader(collection, settings);

            method_collection.push({
                id: unique_method_namespace,
                instance: this_load_instance,
                element: element,
                timeout: null
            });

            this_load_instance.progress(function (resource) {

                $element.trigger(namespace_prefix + 'Progress.' + namespace_prefix, [element, resource]);

                var this_arguments = [this_load_instance, resource];

                if ($.isFunction(settings.onProgress)) settings.onProgress.apply(element, this_arguments);

                var event_name = capitalize(resource.status);
                if ($.isFunction(settings['on' + event_name])) settings['on' + event_name].apply(element, this_arguments);
            });

            this_load_instance.done(function (resources) {

                $element.trigger(namespace_prefix + 'Complete.' + namespace_prefix, [element, resources]);
                callback.apply(element, [this_load_instance, resources]);

                if (settings.visible) $($.nite && 'scroll' in $.nite ? $document : $window).off('scroll.' + unique_method_namespace);

                // refresh other method calls for same el (omitting this one)
                method_collection = method_collection.filter(function (x) {
                    return x.id !== unique_method_namespace;
                });
                method_collection.forEach(function (this_method_collection) {
                    if ($element.is(this_method_collection.element)) this_method_collection.instance.loop();
                });
            });

            if (settings.visible) {

                if ($.nite && 'scroll' in $.nite) $.nite.scroll(unique_method_namespace, function () {
                    this_load_instance.loop();
                }, { fps: 25 });else {

                    var throttle_scroll_event = function throttle_scroll_event(fn, wait) {
                        var time = Date.now();
                        return function () {
                            if (time + wait - Date.now() < 0) {
                                fn();
                                time = Date.now();
                            }
                        };
                    };

                    $window.on('scroll.' + unique_method_namespace, throttle_scroll_event(function () {
                        this_load_instance.loop();
                    }, 1000));
                }
            }

            if (true === settings.early) {
                var _loop3 = function (key) {

                    var this_method_collection = method_collection[key];

                    if (method_collection[key].id === unique_method_namespace) {

                        clearTimeout(this_method_collection.timeout);

                        this_method_collection.timeout = setTimeout(function () {

                            // todo appropriate method for setting settings?
                            this_method_collection.instance._settings.visible = false;
                            this_method_collection.instance._settings.sequential = true;

                            this_method_collection.instance.loop();
                        }, $.isNumeric(settings.earlyTimeout) ? parseInt(settings.earlyTimeout) : 0);

                        return 'break';
                    }
                };

                for (let key in method_collection) {
                    var _ret3 = _loop3(key);

                    if (_ret3 === 'break') break;
                }
            }
        });
    };
})(window, document, jQuery);