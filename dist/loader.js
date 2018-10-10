'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _loaderMedia = require('./loader.media.js');

var _loaderPromise = require('./loader.promise.js');

var _loaderFind = require('./loader.find.js');

var _loaderUtils = require('./loader.utils.js');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            var _this = this;

            this._load = new _loaderPromise.LoaderPromise(function (resolve, reject, progress) {
                if (_this._state === 1) {
                    reject('A Loader instance is already in progress.');
                }
                if (!_this._collection.length) {
                    reject('Collection is empty.');
                }

                _this._state = 1;

                if (_this._options.sequential) {
                    var loaded = 0;
                    var pipeline = function pipeline() {
                        if (_this._state === 0) {
                            reject('Aborted');

                            return;
                        }

                        var loadStep = function loadStep(media, cb) {
                            loaded++;

                            _this._percentage = loaded / _this._collection.length * 100;

                            progress(media);

                            if (loaded < _this._collection.length) {
                                pipeline();

                                return;
                            }

                            _this._state = 0;

                            cb();
                        };

                        var load = _this.fetch(_this._collection[loaded]);
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

                            _this._percentage = loaded / _this._collection.length * 100;

                            progress(e);

                            if (loaded >= _this._collection.length) {
                                _this._state = 0;

                                cb();
                            }
                        };

                        for (var i = 0; i < _this._collection.length; i++) {
                            if (_this._state === 0) {
                                reject('Aborted');

                                break;
                            }

                            var load = _this.fetch(_this._collection[i]);
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
            var _this2 = this;

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
                    (0, _loaderUtils.copyAttributes)(createdElement, media.element, Object.values(_this2._options.srcAttributes));
                    (0, _loaderUtils.copyAttributes)(createdElement, media.element, Object.values(_this2._options.sizesAttributes));

                    if (hasSources) {
                        [].concat(_toConsumableArray(media.element.querySelectorAll('source'))).forEach(function (source) {
                            var createdSource = document.createElement('source');
                            (0, _loaderUtils.copyAttributes)(createdSource, source, Object.values(_this2._options.srcAttributes));
                            (0, _loaderUtils.copyAttributes)(createdSource, source, Object.values(_this2._options.sizesAttributes));
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
                        (0, _loaderUtils.switchAttributes)(media.element, _this2._options.srcAttributes);
                        (0, _loaderUtils.switchAttributes)(media.element, _this2._options.sizesAttributes);

                        if (hasSources) {
                            [].concat(_toConsumableArray(media.element.querySelectorAll('source'))).forEach(function (source) {
                                (0, _loaderUtils.switchAttributes)(source, _this2._options.srcAttributes);
                                (0, _loaderUtils.switchAttributes)(source, _this2._options.sizesAttributes);
                            });
                        }

                        if (media.type === 'video' || media.type === 'audio') {
                            media.element.load();
                        }

                        if (media.type === 'iframe') {
                            createdElement.parentElement.removeChild(createdElement);
                        }
                    }

                    _this2._queue.delete(createdElement);

                    cb(media);
                };

                var prepareLoad = function prepareLoad() {
                    if (isConsistent) {
                        (0, _loaderUtils.switchAttributes)(createdElement, _this2._options.srcAttributes);
                        (0, _loaderUtils.switchAttributes)(createdElement, _this2._options.sizesAttributes);

                        if (hasSources) {
                            [].concat(_toConsumableArray(createdElement.querySelectorAll('source'))).forEach(function (source) {
                                (0, _loaderUtils.switchAttributes)(source, _this2._options.srcAttributes);
                                (0, _loaderUtils.switchAttributes)(source, _this2._options.sizesAttributes);
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
                    (0, _loaderUtils.removeAttributes)(createdElement, Object.keys(_this2._options.srcAttributes));
                    (0, _loaderUtils.removeAttributes)(createdElement, Object.values(_this2._options.srcAttributes));
                    (0, _loaderUtils.removeAttributes)(createdElement, Object.keys(_this2._options.sizesAttributes));
                    (0, _loaderUtils.removeAttributes)(createdElement, Object.values(_this2._options.sizesAttributes));

                    if (hasSources) {
                        [].concat(_toConsumableArray(createdElement.querySelectorAll('source'))).forEach(function (source) {
                            (0, _loaderUtils.removeAttributes)(source, Object.keys(_this2._options.srcAttributes));
                            (0, _loaderUtils.removeAttributes)(source, Object.values(_this2._options.srcAttributes));
                            (0, _loaderUtils.removeAttributes)(source, Object.keys(_this2._options.sizesAttributes));
                            (0, _loaderUtils.removeAttributes)(source, Object.values(_this2._options.sizesAttributes));
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
                    mainEventsTarget.addEventListener(_this2._options.playthrough ? 'canplaythrough' : 'loadedmetadata', function () {
                        finishPromise(resolve);

                        dispatchEvent('mediaLoad');
                    });
                }

                if (media.element instanceof HTMLElement && _this2._options.lazy && 'IntersectionObserver' in window) {
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
                    _this2._queue.set(media.element, queuer);
                } else {
                    _this2._queue.set(createdElement, queuer);

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
            var _this3 = this;

            if (this._state === 0) {
                if (collection instanceof HTMLElement) {
                    collection = (0, _loaderFind.find)(collection, this._options);
                }

                if (typeof item === 'string') {
                    collection = [new _loaderMedia.Media({ url: item })];
                }

                if (_loaderMedia.Media.isMedia(collection)) {
                    collection = [collection];
                }

                if (Array.isArray(collection)) {
                    collection.forEach(function (item) {
                        var pushCheck = function pushCheck(media) {
                            if (media.type === 'image' || media.type === 'video' || media.type === 'audio' || media.type === 'iframe' && media.consistent) {
                                _this3._collection.push(media);

                                return;
                            }

                            console.warn("Couldn't add media to collection", media);
                        };

                        if (item instanceof HTMLElement) {
                            (0, _loaderFind.find)(item, _this3._options).forEach(function (media) {
                                return pushCheck(new _loaderMedia.Media(media));
                            });
                        }

                        if (typeof item === 'string') {
                            pushCheck(new _loaderMedia.Media({ url: item }));
                        }

                        if (_loaderMedia.Media.isMedia(item)) {
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

exports.default = Loader;