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

    /* todo new specs as following
     // global instance mode
    // - - - - - - - - - - - - -
    let siteLoader = new $.nitePreload({ // no arguments or object of parameters
       selector : ‘data-src’
    });
    // uses interception observer to find inViewport images
    // - - - - - - - - - - - - -
     // single instance mode
    // - - - - - - - - - - - - -
    let instance = new $.nitePreload([ // array
       ‘immagine.jpg’,
       ‘immagine.png’,
       ‘immagine.gif’
    ]);
     console.log(instance.percentage);
     instance.abort();
     instance.loaded(function(url){
        // url is loaded…
    });
     instance.error(function(url){
        // url has encountered a problem
    });
     instance.done(function(){
       // finito…
    });
    // - - - - - - - - - - - - -
     // - - - - - - - - - - - - -
    trova tutte le immagini, audio e video e li aspetta.
    // nothing loaded yet…
    $(‘div.parent, img.test-images, video#bunny, audio#metallica’).nitePreload({
       srcAttr : ‘data-src’,
       findBackgrounds : false,
       canplaythrough : true // video e audio senza interruzioni
    }, function(){
         // everything loaded at this point!
    });
    // - - - - - - - - - - - - -
      // events
    // - - - - - - - - - - - - -
    $(document).on(‘load.nite error.nite’, function(event, $element){
         // $element is loaded at this point
     });
    $(document).on(‘load.nite error.nite’, ‘.element’, function(event){
         // this is loaded at this point
     });
    $(‘.element’).on(‘load.nite error.nite’, function(){
        // this is loaded
     });
    // - - - - - - - - - - - - - */

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
    };

    var ResourceLoader = function () {
        function ResourceLoader() {
            _classCallCheck(this, ResourceLoader);

            this._resource = null;
            this._$resource = $();

            this._type = null;
            this._instance = null;
            this._processed = false;

            this.callback = function (e) {

                if (this._processed) return;

                this._$resource.trigger(e.type + '.' + namespace_prefix);
                $document.trigger(e.type + '.' + namespace_prefix, [this._$resource]);
            };
        }

        _createClass(ResourceLoader, [{
            key: 'complete',
            value: function complete(callback) {

                switch (this._type) {

                    case 'image':

                        this._$resource[this._processed ? 'on' : 'one']('load.' + this._instance + ' error.' + this._instance, function (e) {
                            this.callback(e, callback);
                        });

                        var $picture = this._$resource.closest('picture');

                        if ($picture.length) {

                            this._$resource.removeData('srcset').removeAttr('data-srcset').removeData('src').removeAttr('data-src');

                            $picture.find('source[data-srcset]').attr('srcset', $picture.data('srcset')).removeData('srcset').removeAttr('data-srcset');
                        } else {

                            if (this._$resource.is('[data-srcset]')) this._$resource.attr('srcset', this._$resource.data('srcset')).removeData('srcset').removeAttr('data-srcset');

                            if (this._$resource.is('[data-src]')) this._$resource.attr('src', this._$resource.data('src')).removeData('src').removeAttr('data-src');
                        }

                        if (true === this._resource.complete && this._resource.naturalWidth !== 0 && this._resource.naturalHeight !== 0) {

                            if (!this._processed) this._$resource.off('.' + this._instance);

                            this.callback(new Event(undefined !== this._resource.naturalWidth ? 'load' : 'error'), callback);
                        }

                        break;

                    case 'media':

                        break;

                    case 'iframe':

                        break;

                }

                if (!this._processed) this._$resource.data(namespace, this._instance);
            }
        }, {
            key: 'resource',
            set: function set(resource) {

                if (typeof resource === 'string') {}

                if ((typeof resource === 'undefined' ? 'undefined' : _typeof(resource)) === 'object' && 'element' in resource) {
                    this._resource = resource.element;
                    this._type = resource.type;
                }

                this._$resource = $(this._resource);

                this._instance = this._$resource.data(namespace);
                this._processed = this._instance !== undefined;

                this._instance = this._processed ? this._instance : namespace + '_unique_' + ($.nite ? $.nite.uniqueId() : Math.random(1000, 9999));
            }
        }]);

        return ResourceLoader;
    }();

    var ResourcesLoader = function () {
        function ResourcesLoader(collection, options) {
            _classCallCheck(this, ResourcesLoader);

            this._collection = [];

            if ($.isArray(collection) && (typeof collection[0] === 'string' || _typeof(collection[0]) === 'object' && 'subject' in collection[0])) this._collection = collection;

            if (typeof collection === 'string') this._collection.push(collection);

            this._settings = $.extend(true, {
                sequential: false,
                pipelineDelay: 0,
                playthrough: false
            }, options);

            this._callback = $.noop();
            this._progress = $.noop();
            this._abort = false;

            if (this._collection.length) {

                if (true !== this._settings.sequential) {

                    for (var i = 0; i < this._collection.length; i++) {

                        if (this._abort) break;

                        var load = new ResourceLoader();

                        load.resource = this._collection[i];

                        load.complete(function () {

                            // todo

                            if (this._abort) return;
                        });
                    }
                } else {

                    var _i = -1;

                    var sequential_recursion = function sequential_recursion() {

                        _i++;

                        var load = new ResourceLoader();

                        load.resource = this._collection[_i];

                        load.complete(function () {

                            // todo

                            if (this._abort) return;

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

                if (this.collection.length) this._callback = _func;else _func();
            }
        }, {
            key: 'progress',
            value: function progress(callback) {

                if (!$.isFunction(callback)) return;

                var context = this,
                    _func = function _func() {
                    callback.call(context);
                };

                if (this._collection.length) this._progress = _func;else _func();
            }
        }, {
            key: 'abort',
            value: function abort() {

                if (!this._collection.length) return;

                this._abort = true;
            }
        }]);

        return ResourcesLoader;
    }();

    $[namespace_method] = ResourcesLoader;

    $.fn[namespace_method] = function (options, callback) {

        if ($.isFunction(options)) callback = options;
        if (!$.isFunction(callback)) callback = $.noop;
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') options = {};

        var default_attributes = ['src', 'data-src', 'srcset', 'data-nite-src'];

        var settings = $.extend(true, {
            sequential: false,
            pipelineDelay: 0,
            attributes: default_attributes,
            backgrounds: false,
            playthrough: false
        }, options);

        if (!$.isArray(settings.attributes)) settings.attributes = default_attributes;
        if (typeof settings.attributes === 'string') settings.attributes = settings.attributes.split(' ');

        return this.each(function () {

            var element = this,
                $element = $(element);

            var instance = $element.data(namespace);

            if (undefined !== instance) instance.abort();

            // - - -
            var collection = [];

            var targets = 'img, video, audio, iframe',
                targets_extended = targets + ', picture, source';

            collection.concat($element.find(targets).toArray());

            if ($element.is(targets)) collection.add($element[0]);

            if (true === settings.backgrounds) $element.find('*').addBack().not(targets_extended).filter(function () {
                return $(this).css('background-image') !== 'none';
            }).each(function () {
                collection.push($(this).css('background-image').replace(/url\(\"|url\(\'|url\(|((\"|\')\)$)/igm, ''));
            });

            if (settings.attributes.length) {
                var _loop = function (attr) {

                    $element.find('[' + attr + ']:not(' + targets_extended + ')').each(function () {
                        collection.push($(this).attr(attr));
                    });

                    if ($element.is('[' + attr + ']') && !$element.is(targets_extended)) collection.add($element.attr(attr));
                };

                for (let attr in settings.attributes) {
                    _loop(attr);
                }
            } // - - -

            instance = new ResourcesLoader(collection, settings);

            instance.progress(function () {
                // todo
            });

            instance.done(function () {
                callback.call(element);
            });

            $element.data(namespace, instance);
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