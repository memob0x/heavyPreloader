'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fixBabelExtend = function (O) {
    var gPO = O.getPrototypeOf || function (o) {
        return o.__proto__;
    },
        sPO = O.setPrototypeOf || function (o, p) {
        o.__proto__ = p;
        return o;
    },
        construct = (typeof Reflect === 'undefined' ? 'undefined' : _typeof(Reflect)) === 'object' ? Reflect.construct : function (Parent, args, Class) {
        var Constructor,
            a = [null];
        a.push.apply(a, args);
        Constructor = Parent.bind.apply(Parent, a);
        return sPO(new Constructor(), Class.prototype);
    };

    return function fixBabelExtend(Class) {
        var Parent = gPO(Class);
        return sPO(Class, sPO(function Super() {
            return construct(Parent, arguments, gPO(this).constructor);
        }, Parent));
    };
}(Object);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define('lazyloader', factory) : factory();
})(this, function () {
    'use strict';

    var isInArray = function isInArray(needle, heystack) {
        return heystack.indexOf(needle) > -1;
    };

    var getComputed = function getComputed(element, property) {
        return window.getComputedStyle(element).getPropertyValue(property);
    };

    var supportedExtensions = {
        image: ['jp[e]?g', 'jpe', 'jif', 'jfif', 'jfi', 'gif', 'png', 'tif[f]?', 'bmp', 'dib', 'webp', 'ico', 'cur', 'svg'],
        audio: ['mp3', 'ogg', 'oga', 'spx', 'ogg', 'wav'],
        video: ['mp4', 'ogg', 'ogv', 'webm']
    };
    var supportedTags = {
        image: ['img', 'picture'],
        audio: ['audio'],
        video: ['video'],
        other: ['iframe'] };
    var allSupportedTags = [].concat(_toConsumableArray(new Set(Object.values(supportedTags).reduce(function (a, b) {
        return a.concat(b);
    }))));

    var Media = function () {
        function Media(item) {
            _classCallCheck(this, Media);

            var isElement = item.element instanceof HTMLElement;

            this.url = item.url;
            this.consistent = isElement && isInArray(item.element.tagName.toLowerCase(), allSupportedTags);
            this.element = isElement ? item.element : null;
            this.tagName = this.consistent ? this.element.tagName.toLowerCase() : null;
            this.type = null;
            this.extension = null;

            if (!this.url) {
                return;
            }

            this.url = item.url;

            for (var format in supportedExtensions) {
                var extensions = supportedExtensions[format].join('|');

                if (new RegExp('(.(' + extensions + ')$)|data:' + format + '/(' + extensions + ');base64,').test(this.url)) {
                    var matches = this.url.match(new RegExp('.(' + extensions + ')$', 'g')) || this.url.match(new RegExp('^data:' + format + '/(' + extensions + ')', 'g'));

                    if (null !== matches) {
                        this.type = format;
                        this.extension = matches[0].replace('data:' + format + '/', '').replace('.', '');
                        this.tagName = this.tagName ? this.tagName : supportedTags[format][0];

                        break;
                    }
                }
            }

            if (this.consistent && (this.tagName === 'audio' || this.tagName === 'video' || this.tagName === 'iframe')) {
                this.type = this.tagName;
            } else if (this.tagName) {
                for (var _format in supportedTags) {
                    if (isInArray(this.tagName, supportedTags[_format])) {
                        this.type = _format;
                        break;
                    }
                }
            }
        }

        _createClass(Media, null, [{
            key: 'isMedia',
            value: function isMedia(item) {
                return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && 'tagName' in item && 'type' in item && 'url' in item && 'extension' in item && 'element' in item;
            }
        }]);

        return Media;
    }();

    var LoaderPromise = _fixBabelExtend(function (_Promise) {
        _inherits(LoaderPromise, _Promise);

        function LoaderPromise(fn) {
            _classCallCheck(this, LoaderPromise);

            var _this = _possibleConstructorReturn(this, (LoaderPromise.__proto__ || Object.getPrototypeOf(LoaderPromise)).call(this, function (resolve, reject) {
                fn(resolve, reject, function (value) {
                    try {
                        return _this._progress.forEach(function (listener) {
                            return listener(value);
                        });
                    } catch (error) {
                        reject(error);
                    }
                });
            }));

            _this._progress = [];
            return _this;
        }

        _createClass(LoaderPromise, [{
            key: 'progress',
            value: function progress(handler) {
                if (typeof handler === 'function') {
                    this._progress.push(handler);
                }

                return this;
            }
        }]);

        return LoaderPromise;
    }(Promise));

    var find = function find() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var settings = _extends({
            srcAttributes: {
                src: !!!options.lazy ? 'src' : 'data-src',
                srcset: !!!options.lazy ? 'srcset' : 'data-srcset'
            },
            sizesAttributes: {
                sizes: !!!options.lazy ? 'sizes' : 'data-sizes',
                media: !!!options.lazy ? 'media' : 'data-media'
            },
            backgrounds: false
        }, options);

        var collection = [];

        var tagsSelector = allSupportedTags.join(',');
        var srcAttributesValues = Object.values(settings.srcAttributes);
        var srcAttributesSelector = srcAttributesValues.map(function (x) {
            return '[' + x + ']';
        }).join(',');

        var targets = [].concat(_toConsumableArray(element.querySelectorAll(tagsSelector))).filter(function (el) {
            return !el.parentElement || el.parentElement.tagName.toLowerCase() !== 'picture';
        });
        if (element.matches(tagsSelector) && (!element.parentElement || element.parentElement.tagName.toLowerCase() !== 'picture')) {
            targets.push(element);
        }

        targets.forEach(function (target) {
            var source = target;

            if (target.querySelectorAll('source').length) {
                source = target.querySelectorAll('source');
                source = [].concat(_toConsumableArray(source))[0];
            }

            if (source.matches(srcAttributesSelector)) {
                var attribute = '';

                for (var i = 0, j = srcAttributesValues.length; i < j; i++) {
                    attribute = source.getAttribute(srcAttributesValues[i]);
                    if (attribute) {
                        break;
                    }
                }

                collection.push(new Media({
                    element: target,
                    url: attribute
                }));
            }
        });

        if (true === settings.backgrounds) {
            targets = [].concat(_toConsumableArray(element.querySelectorAll('*')));
            targets.push(element);
            targets = targets.filter(function (target) {
                return !target.matches(tagsSelector);
            });
            targets = targets.filter(function (target) {
                return getComputed(target, 'background-image') !== 'none';
            });
            targets.forEach(function (target) {
                var url = getComputed(target, 'background-image').match(/\((.*?)\)/);

                if (null !== url && url.length >= 2) {
                    collection.push(new Media({
                        element: target,
                        url: url[1].replace(/('|")/g, '')
                    }));
                }
            });
        }

        return collection;
    };

    var switchAttributes = function switchAttributes(el, attrs) {
        Object.keys(attrs).forEach(function (attr) {
            var dataAttr = attrs[attr];
            dataAttr = dataAttr === 'src' || dataAttr === 'srcset' ? 'data-' + dataAttr : dataAttr;
            var dataAttrVal = el.getAttribute(dataAttr);

            if (dataAttrVal) {
                el.setAttribute(attr, dataAttrVal);
                el.removeAttribute(dataAttr);
            }
        });
    };

    var copyAttributes = function copyAttributes(el, target, attributes) {
        return attributes.forEach(function (attr) {
            var attribute = target.getAttribute(attr);
            if (attribute) {
                el.setAttribute(attr === 'src' || attr === 'srcset' ? 'data-' + attr : attr, attribute);
            }
        });
    };

    var removeAttributes = function removeAttributes(el, attributes) {
        return attributes.forEach(function (attr) {
            return el.removeAttribute(attr);
        });
    };

    var Loader = function () {
        function Loader() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, Loader);

            this._options = _extends({
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
            }, options);

            this._collection = [];
            this._queue = new Map();

            this._load = null;

            this._percentage = 0;
            this._state = 0;
        }

        _createClass(Loader, [{
            key: 'abort',
            value: function abort() {
                if (this._state === 0) {
                    return;
                }

                this._state = 0;

                this._queue.forEach(function (data, element) {
                    return element.dispatchEvent(new CustomEvent('Aborted'));
                });
            }
        }, {
            key: 'load',
            value: function load() {
                var _this2 = this;

                this._load = new LoaderPromise(function (resolve, reject, progress) {
                    if (_this2._state === 1) {
                        reject('A Loader instance is already in progress.');
                    }
                    if (!_this2._collection.length) {
                        reject('Collection is empty.');
                    }

                    _this2._state = 1;

                    if (_this2._options.sequential) {
                        var loaded = 0;
                        var pipeline = function pipeline() {
                            if (_this2._state === 0) {
                                reject('Aborted');

                                return;
                            }

                            var loadStep = function loadStep(media, cb) {
                                loaded++;

                                _this2._percentage = loaded / _this2._collection.length * 100;

                                progress(media);

                                if (loaded < _this2._collection.length) {
                                    pipeline();

                                    return;
                                }

                                _this2._state = 0;

                                cb();
                            };

                            var load = _this2.fetch(_this2._collection[loaded]);
                            load.then(function (e) {
                                return loadStep(e, function () {
                                    return resolve({});
                                });
                            });
                            load.catch(function (e) {
                                return loadStep(e, function () {
                                    return reject('Error');
                                });
                            });
                        };

                        pipeline();
                    } else {
                        (function () {
                            var loaded = 0;
                            var loadStep = function loadStep(e, cb) {
                                loaded++;

                                _this2._percentage = loaded / _this2._collection.length * 100;

                                progress(e);

                                if (loaded >= _this2._collection.length) {
                                    _this2._state = 0;

                                    cb();
                                }
                            };

                            for (var i = 0; i < _this2._collection.length; i++) {
                                if (_this2._state === 0) {
                                    reject('Aborted');

                                    break;
                                }

                                var load = _this2.fetch(_this2._collection[i]);
                                load.then(function (e) {
                                    return loadStep(e, function () {
                                        return resolve({});
                                    });
                                });
                                load.catch(function (e) {
                                    return loadStep(e, function () {
                                        return reject(e);
                                    });
                                });
                            }
                        })();
                    }
                });

                return this._load;
            }
        }, {
            key: 'fetch',
            value: function fetch(media) {
                var _this3 = this;

                return new Promise(function (resolve, reject) {
                    var isConsistent = media.consistent && document.body.contains(media.element);
                    var hasSources = isConsistent && media.element.querySelectorAll('source').length;
                    var createdElement = document.createElement(media.tagName);

                    var mainEventsTarget = createdElement;

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
                        copyAttributes(createdElement, media.element, Object.values(_this3._options.srcAttributes));
                        copyAttributes(createdElement, media.element, Object.values(_this3._options.sizesAttributes));

                        if (hasSources) {
                            [].concat(_toConsumableArray(media.element.querySelectorAll('source'))).forEach(function (source) {
                                var createdSource = document.createElement('source');
                                copyAttributes(createdSource, source, Object.values(_this3._options.srcAttributes));
                                copyAttributes(createdSource, source, Object.values(_this3._options.sizesAttributes));
                                createdElement.append(createdSource);
                            });
                        }

                        if (media.tagName === 'picture') {
                            mainEventsTarget = document.createElement('img');
                            createdElement.append(mainEventsTarget);
                        }
                    }

                    var finishPromise = function finishPromise(cb) {
                        if (isConsistent) {
                            switchAttributes(media.element, _this3._options.srcAttributes);
                            switchAttributes(media.element, _this3._options.sizesAttributes);

                            if (hasSources) {
                                [].concat(_toConsumableArray(media.element.querySelectorAll('source'))).forEach(function (source) {
                                    switchAttributes(source, _this3._options.srcAttributes);
                                    switchAttributes(source, _this3._options.sizesAttributes);
                                });
                            }

                            if (media.type === 'video' || media.type === 'audio') {
                                media.element.load();
                            }

                            if (media.type === 'iframe') {
                                createdElement.parentElement.removeChild(createdElement);
                            }
                        }

                        _this3._queue.delete(createdElement);

                        cb(media);
                    };

                    var prepareLoad = function prepareLoad() {
                        if (isConsistent) {
                            switchAttributes(createdElement, _this3._options.srcAttributes);
                            switchAttributes(createdElement, _this3._options.sizesAttributes);

                            if (hasSources) {
                                [].concat(_toConsumableArray(createdElement.querySelectorAll('source'))).forEach(function (source) {
                                    switchAttributes(source, _this3._options.srcAttributes);
                                    switchAttributes(source, _this3._options.sizesAttributes);
                                });
                            }
                        } else {
                            createdElement.setAttribute('src', media.url);
                        }

                        if (media.type === 'video' || media.type === 'audio') {
                            createdElement.load();
                        }
                    };

                    var dispatchEvent = function dispatchEvent(type) {
                        var event = new CustomEvent(type, { detail: media });

                        if (media.element) {
                            media.element.dispatchEvent(event);
                        }

                        document.dispatchEvent(event);
                    };

                    var queuer = { media: media, observer: null, element: createdElement };

                    createdElement.addEventListener('abort', function () {
                        removeAttributes(createdElement, Object.keys(_this3._options.srcAttributes));
                        removeAttributes(createdElement, Object.values(_this3._options.srcAttributes));
                        removeAttributes(createdElement, Object.keys(_this3._options.sizesAttributes));
                        removeAttributes(createdElement, Object.values(_this3._options.sizesAttributes));

                        if (hasSources) {
                            [].concat(_toConsumableArray(createdElement.querySelectorAll('source'))).forEach(function (source) {
                                removeAttributes(source, Object.keys(_this3._options.srcAttributes));
                                removeAttributes(source, Object.values(_this3._options.srcAttributes));
                                removeAttributes(source, Object.keys(_this3._options.sizesAttributes));
                                removeAttributes(source, Object.values(_this3._options.sizesAttributes));
                            });
                        }

                        finishPromise(reject);
                    });

                    mainEventsTarget.addEventListener('error', function () {
                        finishPromise(reject);

                        dispatchEvent('mediaError');
                    });

                    if (media.type === 'image' || media.type === 'iframe') {
                        mainEventsTarget.addEventListener('load', function (e) {
                            if (e.target.tagName.toLowerCase() === 'iframe' && !e.target.getAttribute('src')) {
                                return;
                            }

                            finishPromise(resolve);

                            dispatchEvent('mediaLoad');
                        });
                    }

                    if (media.type === 'audio' || media.type === 'video') {
                        mainEventsTarget.addEventListener(_this3._options.playthrough ? 'canplaythrough' : 'loadedmetadata', function () {
                            finishPromise(resolve);

                            dispatchEvent('mediaLoad');
                        });
                    }

                    if (media.element instanceof HTMLElement && _this3._options.lazy && 'IntersectionObserver' in window) {
                        queuer.observer = new IntersectionObserver(function (entries, observer) {
                            entries.forEach(function (entry) {
                                if (entry.intersectionRatio > 0) {
                                    observer.unobserve(entry.target);

                                    prepareLoad();
                                }
                            });
                        }, {
                            root: null,
                            rootMargin: '0px',
                            threshold: 0.1
                        });

                        queuer.observer.observe(media.element);
                        _this3._queue.set(media.element, queuer);
                    } else {
                        _this3._queue.set(createdElement, queuer);

                        prepareLoad();
                    }
                });
            }
        }, {
            key: 'percentage',
            get: function get() {
                return this._percentage;
            }
        }, {
            key: 'collection',
            set: function set(collection) {
                var _this4 = this;

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
                        collection.forEach(function (item) {
                            var pushCheck = function pushCheck(media) {
                                if (media.type === 'image' || media.type === 'video' || media.type === 'audio' || media.type === 'iframe' && media.consistent) {
                                    _this4._collection.push(media);

                                    return;
                                }

                                console.warn("Couldn't add media to collection", media);
                            };

                            if (item instanceof HTMLElement) {
                                find(item, _this4._options).forEach(function (media) {
                                    return pushCheck(new Media(media));
                                });
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
            },
            get: function get() {
                return this._collection;
            }
        }]);

        return Loader;
    }();

    var logEl = document.querySelector('#console');
    var log = function log(string) {
        if (!logEl.hasChildNodes()) {
            var ol = document.createElement('ol');
            logEl.append(ol);
        }

        var list = logEl.querySelector('ol');
        var li = document.createElement('li');
        li.innerHTML = string;
        list.append(li);

        logEl.scrollTop = list.offsetHeight;
    };

    var testLoader = new Loader({
        sequential: true
    });

    document.querySelector('button.load').addEventListener('click', function (e) {
        testLoader.collection = function () {
            var imgs = [];

            for (var i = 0; i < 10; i++) {
                var letters = '0123456789ABCDEF',
                    colors = [];

                for (var ii = 0; ii < 2; ii++) {
                    var color = '';
                    for (var c = 0; c < 6; c++) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    colors[ii] = color;
                }

                imgs.push('//placehold.it/720x720/' + colors[0] + '/' + colors[1] + '.jpg');
            }

            return imgs;
        }();

        var testLoad = testLoader.load();

        testLoad.then(function (e) {
            return log('All done, test array has completely loaded!', e);
        });
        testLoad.progress(function (e) {
            return log('Total programmatic load percentage: ' + testLoader.percentage + '% ' + e.url);
        });
        testLoad.catch(function (e) {
            return console.log('error', e);
        });
    });

    document.querySelector('button.abort').addEventListener('click', function (e) {
        return testLoader.abort();
    });
});
//# sourceMappingURL=urls-preloader.js.map
