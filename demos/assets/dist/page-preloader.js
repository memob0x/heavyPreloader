"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define('lazyloader', factory) : factory();
})(void 0, function () {
  'use strict';

  var supportedExtensions = {
    image: ['jp[e]?g', 'jpe', 'jif', 'jfif', 'jfi', 'gif', 'png', 'tif[f]?', 'bmp', 'dib', 'webp', 'ico', 'cur', 'svg'],
    audio: ['mp3', 'ogg', 'oga', 'spx', 'ogg', 'wav'],
    video: ['mp4', 'ogg', 'ogv', 'webm']
  };
  var supportedTags = {
    image: ['img', 'picture'],
    audio: ['audio'],
    video: ['video'],
    other: ['iframe']
  };

  var allSupportedTags = _toConsumableArray(new Set(Object.values(supportedTags).reduce(function (a, b) {
    return a.concat(b);
  })));

  var base64head = ';base64,';

  var Resource = function () {
    function Resource(item) {
      _classCallCheck(this, Resource);

      var isElement = item.element instanceof HTMLElement;
      this.url = item.url;
      this.consistent = isElement && allSupportedTags.includes(item.element.tagName.toLowerCase());
      this.element = isElement ? item.element : null;
      var tagName = isElement ? this.element.tagName.toLowerCase() : null;
      this.type = null;
      this.extension = null;

      if (!this.url) {
        return;
      }

      this.url = item.url;

      if (!new RegExp("".concat(base64head)).test(this.url)) {
        this.url = this.url.split(',').pop().split(' ').reduce(function (x, y) {
          return x.length > y.length ? x : y;
        });
      }

      for (var format in supportedExtensions) {
        var extensions = supportedExtensions[format].join('|');

        if (new RegExp("(.(".concat(extensions, ")$)|data:").concat(format, "/(").concat(extensions, ")").concat(base64head)).test(this.url)) {
          var matches = this.url.match(new RegExp(".(".concat(extensions, ")$"), 'g')) || this.url.match(new RegExp("^data:".concat(format, "/(").concat(extensions, ")"), 'g'));

          if (null !== matches) {
            this.type = format;
            this.extension = matches[0].replace("data:".concat(format, "/"), '').replace('.', '');
            break;
          }
        }
      }

      if (this.consistent && (tagName === 'audio' || tagName === 'video' || tagName === 'iframe')) {
        this.type = tagName;
      } else if (tagName) {
        for (var _format in supportedTags) {
          if (supportedTags[_format].includes(tagName)) {
            this.type = _format;
            break;
          }
        }
      }
    }

    _createClass(Resource, null, [{
      key: "isResource",
      value: function isResource(item) {
        return _typeof(item) === 'object' && 'type' in item && 'url' in item && 'extension' in item && 'element' in item;
      }
    }]);

    return Resource;
  }();

  var LoaderPromise = function (_Promise) {
    _inherits(LoaderPromise, _Promise);

    function LoaderPromise(fn) {
      var _this;

      _classCallCheck(this, LoaderPromise);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(LoaderPromise).call(this, function (resolve, reject) {
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
      key: "progress",
      value: function progress(handler) {
        if (typeof handler === 'function') {
          this._progress.push(handler);
        }

        return this;
      }
    }]);

    return LoaderPromise;
  }(_wrapNativeSuper(Promise));

  var find = function find() {
    var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var settings = _objectSpread({}, {
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
      return "[".concat(x, "]");
    }).join(',');

    var targets = _toConsumableArray(element.querySelectorAll(tagsSelector)).filter(function (el) {
      return !el.parentElement || el.parentElement.tagName.toLowerCase() !== 'picture';
    });

    if (element.matches(tagsSelector) && (!element.parentElement || element.parentElement.tagName.toLowerCase() !== 'picture')) {
      targets.push(element);
    }

    targets.forEach(function (target) {
      var source = target;

      if (target.querySelectorAll('source').length) {
        source = target.querySelectorAll('source');
        source = _toConsumableArray(source)[0];
      }

      if (source.matches(srcAttributesSelector)) {
        var attribute = '';

        for (var i = 0, j = srcAttributesValues.length; i < j; i++) {
          attribute = source.getAttribute(srcAttributesValues[i]);

          if (attribute) {
            break;
          }
        }

        collection.push(new Resource({
          element: target,
          url: attribute
        }));
      }
    });

    if (true === settings.backgrounds) {
      targets = _toConsumableArray(element.querySelectorAll('*'));
      targets.push(element);
      targets = targets.filter(function (target) {
        return !target.matches(tagsSelector);
      });
      targets = targets.filter(function (target) {
        return window.getComputedStyle(target).getPropertyValue('background-image') !== 'none';
      });
      targets.forEach(function (target) {
        var url = window.getComputedStyle(target).getPropertyValue('background-image').match(/\((.*?)\)/);

        if (null !== url && url.length >= 2) {
          collection.push(new Resource({
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
      dataAttr = dataAttr === 'src' || dataAttr === 'srcset' ? "data-".concat(dataAttr) : dataAttr;
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
        el.setAttribute(attr === 'src' || attr === 'srcset' ? "data-".concat(attr) : attr, attribute);
      }
    });
  };

  var removeAttributes = function removeAttributes(el, attributes) {
    return attributes.forEach(function (attr) {
      return el.removeAttribute(attr);
    });
  };

  var isElementInViewport = function isElementInViewport(el) {
    return true;
  };

  var ID = function () {
    var s4 = function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    return "".concat(s4()).concat(s4(), "-").concat(s4(), "-").concat(s4(), "-").concat(s4(), "-").concat(s4()).concat(s4()).concat(s4());
  }();

  var threshold = function (num) {
    var segments = [];

    for (var i = 0; i < num; i++) {
      segments.push(2 * i / 100);
    }

    return segments;
  }(50);

  var isIntersectionObserverSupported = 'IntersectionObserver' in window;

  var LoaderEvent = function () {
    if (typeof window.CustomEvent === 'function') {
      return window.CustomEvent;
    }

    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    return CustomEvent;
  }();

  var Loader = function () {
    function Loader() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Loader);

      this._options = _objectSpread({}, {
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

      if (!isIntersectionObserverSupported) {
        this.manuallyObservedElements = [];

        var manuallyObserve = function manuallyObserve() {
          return _this2.manuallyObservedElements.filter(function (item) {
            return !item.intersected;
          }).forEach(function (item) {
            if (!item.intersected && isElementInViewport(item.element)) {
              item.intersected = true;
              item.element.dispatchEvent(new LoaderEvent("intersected__".concat(ID)));
            }
          });
        };

        window.addEventListener('scroll', manuallyObserve);
        window.addEventListener('resize', manuallyObserve);
        window.addEventListener('load', manuallyObserve);
      }
    }

    _createClass(Loader, [{
      key: "abort",
      value: function abort() {
        if (this._state === 0) {
          return;
        }

        this._state = 0;

        this._queue.forEach(function (data, element) {
          return element.dispatchEvent(new LoaderEvent("abort__".concat(ID)));
        });
      }
    }, {
      key: "load",
      value: function load() {
        var _this3 = this;

        this._load = new LoaderPromise(function (resolve, reject, progress) {
          if (_this3._state === 1) {
            reject('This Loader instance is already in progress');
          }

          if (!_this3._collection.length) {
            reject('Resources collection is empty');
          }

          _this3._state = 1;

          if (_this3._options.sequential) {
            var loaded = 0;

            var pipeline = function pipeline() {
              if (_this3._state === 0) {
                reject('Loader instance aborted');
                _this3._collection = [];
                return;
              }

              _this3.fetch(_this3._collection[loaded]).catch(function (payload) {
                console.warn("".concat(payload.event.detail.message, ": ").concat(payload.resource.url));
                return payload;
              }).then(function (payload) {
                if (_this3._state !== 0) {
                  loaded++;
                }

                _this3._percentage = loaded / _this3._collection.length * 100;

                if (_this3._state !== 0) {
                  progress(payload);
                }

                if (loaded < _this3._collection.length) {
                  pipeline();
                  return;
                }

                _this3._state = 0;
                resolve(payload);
              });
            };

            pipeline();
          } else {
            (function () {
              var loaded = 0;

              for (var i = 0; i < _this3._collection.length; i++) {
                if (_this3._state === 0) {
                  reject('Loader instance aborted');
                  _this3._collection = [];
                  break;
                }

                _this3.fetch(_this3._collection[i]).catch(function (payload) {
                  console.warn("".concat(payload.event.detail.message, ": ").concat(payload.resource.url));
                  return payload;
                }).then(function (payload) {
                  if (_this3._state !== 0) {
                    loaded++;
                  }

                  _this3._percentage = loaded / _this3._collection.length * 100;

                  if (_this3._state !== 0) {
                    progress(payload);
                  }

                  if (loaded >= _this3._collection.length) {
                    _this3._state = 0;
                    resolve();
                  }
                });
              }
            })();
          }
        });
        return this._load;
      }
    }, {
      key: "fetch",
      value: function fetch(resource) {
        var _this4 = this;

        return new Promise(function (resolve, reject) {
          var isConsistent = resource.consistent && document.body.contains(resource.element);
          var hasSources = isConsistent && resource.element.querySelectorAll('source').length;
          var tagName = isConsistent ? resource.element.tagName.toLowerCase() : supportedTags[resource.type][0];
          var createdElement = document.createElement(tagName);
          var mainEventsTarget = createdElement;

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
            copyAttributes(createdElement, resource.element, Object.values(_this4._options.srcAttributes));
            copyAttributes(createdElement, resource.element, Object.values(_this4._options.sizesAttributes));

            if (hasSources) {
              _toConsumableArray(resource.element.querySelectorAll('source')).forEach(function (source) {
                var createdSource = document.createElement('source');
                copyAttributes(createdSource, source, Object.values(_this4._options.srcAttributes));
                copyAttributes(createdSource, source, Object.values(_this4._options.sizesAttributes));
                createdElement.append(createdSource);
              });
            }

            if (tagName === 'picture') {
              var img = resource.element.querySelector('img');
              var createdImg = document.createElement('img');
              copyAttributes(createdImg, img, Object.values(_this4._options.srcAttributes));
              copyAttributes(createdImg, img, Object.values(_this4._options.sizesAttributes));
              createdElement.append(createdImg);
              mainEventsTarget = createdImg;
            }
          }

          var finishPromise = function finishPromise(event, resolver) {
            if (isConsistent) {
              switchAttributes(resource.element, _this4._options.srcAttributes);
              switchAttributes(resource.element, _this4._options.sizesAttributes);

              if (hasSources) {
                _toConsumableArray(resource.element.querySelectorAll('source')).forEach(function (source) {
                  switchAttributes(source, _this4._options.srcAttributes);
                  switchAttributes(source, _this4._options.sizesAttributes);
                });
              }

              if (resource.type === 'video' || resource.type === 'audio') {
                resource.element.load();
              }

              if (resource.type === 'iframe') {
                createdElement.parentElement.removeChild(createdElement);
              }
            }

            _this4._queue.delete(createdElement);

            resolver({
              event: event,
              resource: resource
            });
          };

          var prepareLoad = function prepareLoad() {
            if (isConsistent) {
              switchAttributes(createdElement, _this4._options.srcAttributes);
              switchAttributes(createdElement, _this4._options.sizesAttributes);

              if (hasSources) {
                _toConsumableArray(createdElement.querySelectorAll('source')).forEach(function (source) {
                  switchAttributes(source, _this4._options.srcAttributes);
                  switchAttributes(source, _this4._options.sizesAttributes);
                });
              }
            } else {
              createdElement.setAttribute('src', resource.url);
            }

            if (resource.type === 'video' || resource.type === 'audio') {
              createdElement.load();
            }
          };

          var dispatchEvent = function dispatchEvent() {
            var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var event = new LoaderEvent(eventName, {
              detail: _objectSpread({}, data, {
                resource: resource
              })
            });

            if (resource.element) {
              resource.element.dispatchEvent(event);
            }

            document.dispatchEvent(event);
            return event;
          };

          var queuer = {
            resource: resource,
            observer: null,
            element: createdElement
          };
          createdElement.addEventListener("abort__".concat(ID), function () {
            removeAttributes(createdElement, Object.keys(_this4._options.srcAttributes));
            removeAttributes(createdElement, Object.values(_this4._options.srcAttributes));
            removeAttributes(createdElement, Object.keys(_this4._options.sizesAttributes));
            removeAttributes(createdElement, Object.values(_this4._options.sizesAttributes));

            if (hasSources) {
              _toConsumableArray(createdElement.querySelectorAll('source')).forEach(function (source) {
                removeAttributes(source, Object.keys(_this4._options.srcAttributes));
                removeAttributes(source, Object.values(_this4._options.srcAttributes));
                removeAttributes(source, Object.keys(_this4._options.sizesAttributes));
                removeAttributes(source, Object.values(_this4._options.sizesAttributes));
              });
            }

            var dispatchedEvent = dispatchEvent('resourceError', {
              type: 'abortion',
              message: 'Resource load aborted'
            });
            finishPromise(dispatchedEvent, reject);
          });
          mainEventsTarget.addEventListener('error', function (e) {
            var dispatchedEvent = dispatchEvent('resourceError', {
              type: e.type,
              message: 'Resource failed to load'
            });
            finishPromise(dispatchedEvent, reject);
          });

          if (resource.type === 'image' || resource.type === 'iframe') {
            mainEventsTarget.addEventListener('load', function (e) {
              if (e.target.tagName.toLowerCase() === 'iframe' && !e.target.getAttribute('src')) {
                return;
              }

              var dispatchedEvent = dispatchEvent('resourceLoad', {
                type: e.type
              });
              finishPromise(dispatchedEvent, resolve);
            });
          }

          if (resource.type === 'audio' || resource.type === 'video') {
            mainEventsTarget.addEventListener(_this4._options.playthrough ? 'canplaythrough' : 'loadedmetadata', function (e) {
              var dispatchedEvent = dispatchEvent('resourceLoad', {
                type: e.type
              });
              finishPromise(dispatchedEvent, resolve);
            });
          }

          if (resource.element instanceof HTMLElement && _this4._options.lazy) {
            if (isIntersectionObserverSupported) {
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
                threshold: threshold
              });
              queuer.observer.observe(resource.element);
            } else {
              if (isElementInViewport(resource.element)) {
                prepareLoad();
              } else {
                _this4.manuallyObservedElements.push({
                  element: resource.element,
                  intersected: false
                });

                resource.element.addEventListener("intersected__".concat(ID), function () {
                  return prepareLoad();
                });
              }
            }

            _this4._queue.set(resource.element, queuer);
          } else {
            _this4._queue.set(createdElement, queuer);

            prepareLoad();
          }
        });
      }
    }, {
      key: "percentage",
      get: function get() {
        return this._percentage;
      }
    }, {
      key: "collection",
      set: function set(collection) {
        var _this5 = this;

        if (this._state === 0) {
          if (collection instanceof NodeList) {
            collection = _toConsumableArray(collection);
          }

          if (collection instanceof HTMLElement) {
            collection = find(collection, this._options);
          }

          if (typeof collection === 'string') {
            collection = [new Resource({
              url: collection
            })];
          }

          if (Resource.isResource(collection)) {
            collection = [collection];
          }

          if (Array.isArray(collection)) {
            this._collection = [];
            collection.forEach(function (item) {
              var pushCheck = function pushCheck(resource) {
                if (resource.type === 'image' || resource.type === 'video' || resource.type === 'audio' || resource.type === 'iframe' && resource.consistent) {
                  _this5._collection.push(resource);

                  return;
                }

                console.warn("Couldn't add resource to collection", resource);
              };

              if (item instanceof HTMLElement) {
                find(item, _this5._options).forEach(function (resource) {
                  return pushCheck(new Resource(resource));
                });
              }

              if (typeof item === 'string') {
                pushCheck(new Resource({
                  url: item
                }));
              }

              if (Resource.isResource(item)) {
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

  var log = function log() {
    var _console;

    for (var _len = arguments.length, message = new Array(_len), _key = 0; _key < _len; _key++) {
      message[_key] = arguments[_key];
    }

    (_console = console).log.apply(_console, message);

    if (!logEl.hasChildNodes()) {
      var ol = document.createElement('ol');
      logEl.append(ol);
    }

    var list = logEl.querySelector('ol');
    var li = document.createElement('li');
    li.innerHTML = message;
    list.append(li);
    logEl.scrollTop = list.offsetHeight;
  };

  var pageLoader = new Loader({
    playthrough: true,
    backgrounds: true,
    sequential: false
  });
  pageLoader.collection = document.querySelectorAll('.playground');
  window.addEventListener('load', function () {
    var pageLoad = pageLoader.load();
    pageLoad.progress(function (e) {
      if (!e.resource.element) {
        return;
      }

      var container = e.resource.element.matches('.playground') ? e.resource.element : e.resource.element.closest('.playground');
      var percentage = container.querySelector('.playground__percentage');
      var item = e.resource.element.closest('.playground__item');

      if (percentage) {
        percentage.classList.add('visible');
      }

      if (item) {
        e.resource.element.closest('.playground__item').classList.add('loaded');
      }

      if (percentage) {
        percentage.children[0].dataset.percentage = container.querySelectorAll('.playground__item.loaded').length / container.querySelectorAll('.playground__item').length * 100;
      }

      document.querySelector('#preloader').innerHTML = pageLoader.percentage + '%';
      log('Total page load: ' + pageLoader.percentage + '% ' + e.resource.url);
    });
    pageLoad.catch(function (error) {
      return log(error);
    }).then(function () {
      document.querySelector('#preloader').innerHTML = 'done!';
      setTimeout(function () {
        return document.body.classList.add('loaded');
      }, 500);
      log('All done!');
    });
  }, false);
  document.querySelectorAll('img').forEach(function (img) {
    return img.addEventListener('resourceError', function (e) {
      return e.detail.resource.element.classList.add('missing');
    });
  });
});
//# sourceMappingURL=page-preloader.js.map
