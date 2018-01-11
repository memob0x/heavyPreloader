'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*! JQuery Heavy ResourcesLoader | Daniele Fioroni | dfioroni91@gmail.com */
(function (window, document, $, undefined) {
    'use strict';

    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    if (!$) {
        console.error('jQuery is needed for $.fn.nitePreload(), $.nitePreload, $.niteLazyLoad to work!');
        return undefined;
    }
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~


    var namespace_prefix = 'nite',
        namespace_method = namespace_prefix + 'Preload',
        namespace = namespace_prefix + 'er',
        $document = $(document),
        is_valid_selector = function is_valid_selector(selector) {

        var $element = $();

        if (typeof selector !== 'string') return false;

        try {

            $element = $(selector);
        } catch (error) {

            return false;
        }

        return $element.length;
    },
        is_format = function is_format(string, expected_format) {

        string = string.toLowerCase().split('?')[0]; // get rid of query strings

        if (string === '') return false;

        var formats = {
            image: 'jp[e]?g|gif|png|tif[f]?|bmp',
            audio: 'mp3|ogg',
            video: 'mp4|ogv|ogg|webm'
        },
            base64_heading = '\;base64\,',
            formats_queue = undefined !== expected_format ? [expected_format] : Object.keys(formats);

        var output = { format: null, extension: null };

        for (var x in formats_queue) {

            if (new RegExp('(\.(' + formats[formats_queue[x]] + ')$)|' + base64_heading, 'g').test(string)) {

                if (new RegExp(base64_heading, 'g').test(string)) {

                    var matches64 = string.match(new RegExp('^data:' + formats_queue[x] + '\/(' + formats[formats_queue[x]] + ')', 'g'));

                    if (!matches64 || null === matches64) {

                        console.warn(string + ': base64 ' + formats_queue[x] + ' format not recognized.');

                        continue;
                    }

                    matches64 = matches64[0];

                    output = { format: matches64.replace('data:' + formats_queue[x] + '/g', ''), extension: 'base64' };

                    break;
                } else {

                    var matches = string.match(new RegExp(formats[formats_queue[x]], 'g'));

                    if (matches) {

                        output = { format: formats_queue[x], extension: matches[0] };

                        break;
                    }
                }
            }
        }

        return output;
    };

    var ResourceLoader = function () {
        function ResourceLoader(settings) {
            _classCallCheck(this, ResourceLoader);

            var self = this;

            this._settings = settings;

            this._element = null;
            this._$element = $();

            this._resource = null;

            this._format = null;
            this._instance = null;
            this._processed = false;

            this._callback = $.noop;
            this._done = function (e) {

                self._callback.call(null /*temp*/, self._resource);

                if (self._processed) return;

                self._$element.trigger(e.type + '.' + namespace_prefix);
                $document.trigger(e.type + '.' + namespace_prefix, [this._$element]);
            };
        }

        _createClass(ResourceLoader, [{
            key: 'abort',
            value: function abort() {

                this._$element.filter('[src], [srcset]').data(this._settings.srcsetAttr, this._$element.attr('srcset')).data(this._settings.srcAttr, this._$element.attr('src')).attr(this._settings.srcsetAttr, this._$element.attr('srcset')).attr(this._settings.srcAttr, this._$element.attr('src')).removeAttr('src').removeAttr('srcset').end().off('load.' + this._instance + ' error.' + this._instance);
            }
        }, {
            key: 'done',
            value: function done(callback) {

                if (!$.isFunction(callback)) return;

                var context = this;

                this._callback = function (resource) {
                    console.log(resource);
                    callback.call(context, resource);
                };
            }
        }, {
            key: 'resource',
            set: function set(resource) {

                var recognized_resource = (typeof resource === 'undefined' ? 'undefined' : _typeof(resource)) === 'object' && 'standard' in resource,
                    standard_resource = recognized_resource && resource.standard === true,
                    string_resource = typeof resource === 'string';

                if (!recognized_resource && !string_resource) return false;

                var self = this;

                if (string_resource || !standard_resource) {

                    this._format = is_format(resource).format;

                    if (this._format === 'image') this._element = new Image();else this._element = document.createElement(this._format);

                    this._settings.srcsetAttr = 'data-srcset';
                    this._settings.srcAttr = 'data-src';

                    this._resource = resource;
                }

                this._$element = $(this._element);

                if (string_resource || !standard_resource) {

                    this._$element.data(this._settings.srcAttr.replace('data-', ''), this._resource).data(this._settings.srcsetAttr.replace('data-', ''), this._resource).attr(this._settings.srcAttr, this._resource).attr(this._settings.srcsetAttr, this._resource);
                }

                if (!string_resource && standard_resource) {

                    this._element = resource.element;
                    this._format = resource.format;

                    this._$element = $(this._element);
                }

                this._instance = this._$element.data(namespace);
                this._processed = this._instance !== undefined;

                this._instance = this._processed ? this._instance : namespace + '_unique_' + ($.nite ? $.nite.uniqueId() : Math.random(1000, 9999));

                switch (this._format) {

                    case 'image':

                        this._$element[this._processed ? 'on' : 'one']('load.' + this._instance + ' error.' + this._instance, this._done);

                        var $picture = this._$element.closest('picture'),
                            src = this._settings.srcAttr,
                            src_clean = this._settings.srcAttr.replace('data-', ''),
                            srcset = this._settings.srcsetAttr,
                            srcset_clean = this._settings.srcsetAttr.replace('data-', '');

                        if ($picture.length) {

                            this._$element.removeData(srcset_clean).removeAttr(srcset).removeData(src_clean).removeAttr(src);

                            $picture.find('source[data-srcset]').attr('srcset', $picture.data('srcset')).removeData(srcset_clean).removeAttr(srcset);
                        } else {

                            if (this._$element.is('[data-srcset]')) this._$element.attr('srcset', this._$element.data('srcset')).removeData(srcset_clean).removeAttr(srcset);

                            if (this._$element.is('[data-src]')) this._$element.attr('src', this._$element.data('src')).removeData(src_clean).removeAttr(src);
                        }

                        this._resource = this._element.currentSrc || this._element.src;

                        if (true === this._element.complete && this._element.naturalWidth !== 0 && this._element.naturalHeight !== 0) {

                            if (!this._processed) this._$element.off('.' + this._instance);

                            this._done.call(new Event(undefined !== this._element.naturalWidth ? 'load' : 'error'));
                        }

                        break;

                    case 'media':

                        break;

                    case 'iframe':

                        break;

                }

                if (!this._processed) this._$element.data(namespace, this._instance);
            }
        }]);

        return ResourceLoader;
    }();

    var ResourcesLoader = function () {
        function ResourcesLoader(collection, options) {
            var _this = this;

            _classCallCheck(this, ResourcesLoader);

            var self = this;

            this._collection = [];

            if ($.isArray(collection) && (typeof collection[0] === 'string' || _typeof(collection[0]) === 'object' && 'subject' in collection[0])) this._collection = collection;

            if (typeof collection === 'string') this._collection.push(collection);

            this._settings = $.extend(true, {
                sequential: false,
                pipelineDelay: 0,
                playthrough: false
            }, options);

            this.percentage = 0;

            this._callback = $.noop();
            this._progress = $.noop();
            this._abort = false;

            this._load_instances = [new ResourceLoader(this._settings)];

            if (this._collection.length) {

                if (true !== this._settings.sequential) {
                    (function () {

                        var loaded = 0;

                        for (var i = 0; i < _this._collection.length; i++) {

                            if (_this._abort) break;

                            var load_instance = new ResourceLoader(_this._settings);

                            _this._load_instances.push(load_instance);

                            load_instance.resource = _this._collection[i];

                            load_instance.done(function (resource) {

                                loaded++;

                                self.percentage = loaded / self._collection.length * 100;

                                self._progress.call(null /* todo */, resource);

                                if (loaded > self._collection.length || self._abort) return;

                                if (loaded === self._collection.length) self._callback.call(null /* todo */);
                            });
                        }
                    })();
                } else {

                    var loaded = -1;

                    var sequential_recursion = function sequential_recursion() {

                        loaded++;

                        if (loaded > this._collection.length || this._abort) return;

                        if (loaded === this._collection.length) this._callback.call(null /* todo */);

                        this._load_instances[0].resource = this._collection[loaded];

                        this._load_instances[0].done(function (resource) {

                            self.percentage = loaded / self._collection.length * 100;

                            self._progress.call(null /* todo */, resource);

                            setTimeout(sequential_recursion, $.isNumeric(this._settings.pipelineDelay) ? parseInt(this._settings.pipelineDelay) : 0);
                        });
                    };

                    sequential_recursion();
                }
            }
        }

        _createClass(ResourcesLoader, [{
            key: 'done',
            value: function done(callback) {

                if (!$.isFunction(callback)) return;

                var context = this,
                    _func = function _func() {
                    callback.call(context);
                };

                if (this._collection.length) this._callback = _func;else _func();
            }
        }, {
            key: 'progress',
            value: function progress(callback) {

                if (!$.isFunction(callback)) return;

                var context = this,
                    _func = function _func(resource) {
                    callback.call(context, resource);
                };

                if (this._collection.length) this._progress = _func;else _func();
            }
        }, {
            key: 'abort',
            value: function abort() {

                for (var instance in this._load_instances) {
                    this._load_instances[instance].abort();
                }if (!this._collection.length) return;

                this._abort = true;
            }
        }]);

        return ResourcesLoader;
    }();

    var CollectionPopulator = function () {
        function CollectionPopulator($element, settings) {
            _classCallCheck(this, CollectionPopulator);

            this._$element = $element;
            this._settings = settings;
        }

        _createClass(CollectionPopulator, [{
            key: 'collect',
            value: function collect() {

                var collection = [];

                var targets = 'img, video, audio, iframe',
                    targets_extended = targets + ', picture, source';

                var $targets = this._$element.find(targets);
                if (this._$element.is(targets)) $targets.add($element);
                $targets.each(function () {
                    collection.push({
                        element: this,
                        resource: this.currentSrc || this.src,
                        standard: true
                    });
                });

                if (true === this._settings.backgrounds) this._$element.find('*').addBack().not(targets_extended).filter(function () {
                    return $(this).css('background-image') !== 'none';
                }).each(function () {
                    collection.push({
                        element: this,
                        resource: $(this).css('background-image').replace(/url\(\"|url\(\'|url\(|((\"|\')\)$)/igm, ''),
                        standard: false
                    });
                });

                if (this._settings.attributes.length) {
                    var _loop = function (attr) {

                        this._$element.find('[' + attr + ']:not(' + targets_extended + ')').each(function () {
                            collection.push({
                                element: this,
                                resource: $(this).attr(attr),
                                standard: false
                            });
                        });

                        if (this._$element.is('[' + attr + ']') && !this._$element.is(targets_extended)) collection.add({
                            element: this,
                            resource: this._$element.attr(attr),
                            standard: false
                        });
                    };

                    for (let attr in this._settings.attributes) {
                        _loop(attr);
                    }
                }return collection;
            }
        }]);

        return CollectionPopulator;
    }();

    $[namespace_method] = ResourcesLoader;

    $.fn[namespace_method] = function (options, callback) {

        if ($.isFunction(options)) callback = options;
        if (!$.isFunction(callback)) callback = $.noop;
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') options = {};

        var settings = $.extend(true, {
            srcAttr: 'data-src',
            srcsetAttr: 'data-srcset',
            sequential: false,
            pipelineDelay: 0,
            extraAttrs: [],
            backgrounds: false,
            playthrough: false
        }, options);

        if (!$.isArray(settings.attributes)) settings.attributes = [];
        if (typeof settings.attributes === 'string') settings.attributes = settings.attributes.split(' ');

        return this.each(function () {

            var element = this,
                $element = $(element);

            var load_instance = $element.data(namespace);

            if (undefined !== load_instance) load_instance.abort();

            load_instance = new ResourcesLoader(new CollectionPopulator($element, settings).collect(), settings);

            load_instance.progress(function () {

                // todo trigger event ...

            });

            load_instance.done(function () {

                callback.call(element);

                // todo trigger event ...
            });

            $element.data(namespace, load_instance);
        });
    };

    $[namespace_prefix + 'Lazyload'] = function (selector) {

        if (!$.nite || !('inViewport' in $.nite) || !('scroll' in $.nite)) {

            console.log('A recent version of $.nite is needed.');

            return;
        }

        $.nite.scroll(namespace, function () {

            $(is_valid_selector(selector) ? selector : '[data-nite-src]').inViewport()[namespace_method](function () {

                var $this = $(this);

                $this.trigger(e.type + '.' + namespace_prefix + 'LazyLoad');
                $document.trigger(e.type + '.' + namespace_prefix + 'LazyLoad', [$this]);
            });
        }, { fps: 25 });
    };
})(window, document, jQuery);