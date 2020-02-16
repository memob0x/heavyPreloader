"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('Loader', factory) : (global = global || self, global.Loader = factory());
})(void 0, function () {
  'use strict';

  var prop = function prop(o, p) {
    return p.split(".").reduce(function (xs, x) {
      return xs && xs[x] ? xs[x] : null;
    }, o);
  };

  var getURL = function getURL(arg) {
    arg = prop(arg, "url") || arg;
    arg = prop(arg, "href") || arg;
    var a = document.createElement("a");
    a.href = arg;
    return new URL(a);
  };

  var isSupportedElement = function isSupportedElement(el) {
    return el instanceof HTMLImageElement || el instanceof HTMLPictureElement || el instanceof HTMLSourceElement || el instanceof HTMLVideoElement || el instanceof HTMLAudioElement;
  };

  var createWorker = function createWorker(work) {
    work = typeof work !== "function" ? function () {} : work;
    var url = URL.createObjectURL(new Blob(["(", work.toString(), ")()"], {
      type: "application/javascript"
    }));
    var worker = new Worker(url);
    URL.revokeObjectURL(url);
    return worker;
  };

  var getLoaderType = function getLoaderType(arg) {
    arg = getURL(arg).href;
    var ext = arg.split(".");
    ext = ext[ext.length - 1];

    switch (ext) {
      case "jpg":
      case "jpe":
      case "jpeg":
      case "jif":
      case "jfi":
      case "jfif":
      case "gif":
      case "tif":
      case "tiff":
      case "bmp":
      case "dib":
      case "webp":
      case "ico":
      case "cur":
      case "svg":
      case "png":
        return "image";

      case "css":
        return "style";

      case "js":
      case "mjs":
        return "script";

      default:
        return null;
    }
  };

  var isCORS = function isCORS(arg) {
    arg = getURL(arg);
    return arg.hostname !== window.location.hostname || arg.protocol !== window.location.protocol;
  };

  var collection = new WeakMap();

  var build = function build(data) {
    var o = {};

    if (isSupportedElement(data)) {
      o.el = data;
      o.url = getURL(prop(o.el, "dataset.src"));
    } else {
      o.el = prop(data, "el");
      o.url = data instanceof URL ? data : prop(data, "url");
    }

    o.blob = prop(data, "blob");
    return o;
  };

  var LoaderResource = function () {
    function LoaderResource(data, override) {
      _classCallCheck(this, LoaderResource);

      var o = build(data);

      if (collection.has(o.url) && !override) {
        o = collection.get(o.url);
      }

      if (collection.has(o.el) && !override) {
        o = collection.get(o.el);
      }

      this.el = o.el;
      this.url = o.url;
      this.blob = o.blob;
      collection.set(o.el || o.url, this);
    }

    _createClass(LoaderResource, null, [{
      key: "isLoaderResource",
      value: function isLoaderResource(data) {
        return data instanceof this;
      }
    }]);

    return LoaderResource;
  }();

  var loadImage = function loadImage(url) {
    var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Image();
    return new Promise(function (resolve, reject) {
      el.onload = function () {
        return resolve(el);
      };

      el.onerror = reject;
      el.src = url;
    });
  };

  var loadStyle = function loadStyle(url) {
    var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.createElement("div");
    var sheet = new CSSStyleSheet();
    var promise = sheet.replace("@import url(\"".concat(url, "\")"));

    if ("adoptedStyleSheets" in el) {
      el.adoptedStyleSheets = [].concat(_toConsumableArray(el.adoptedStyleSheets), [sheet]);
    }

    return promise;
  };

  var loadObject = function loadObject(url) {
    var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.createElement("object");
    return new Promise(function (resolve, reject) {
      el.onload = function () {
        return resolve(el);
      };

      el.onerror = reject;
      el.data = url;
      el.width = 0;
      el.height = 0;
      document.body.append(el);
    });
  };

  var loadScript = function loadScript(url) {
    var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.createElement("script");
    return new Promise(function (resolve, reject) {
      el.onload = function () {
        return resolve(el);
      };

      el.onerror = reject;
      el.src = url;
      el.async = true;
      document.head.append(el);
    });
  };

  var Loaders = {
    image: function image(url, bool, el) {
      return loadImage(url, bool ? el : void 0);
    },
    script: function script(url, bool) {
      return bool ? loadScript(url) : loadObject(url);
    },
    style: function style(url, bool) {
      return loadStyle(url, bool ? document : void 0);
    }
  };

  var work = function work() {
    onmessage = function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(event) {
        var data, message, response, blob;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                data = event.data;
                _context.prev = 1;
                _context.next = 4;
                return fetch(data.href, data.options);

              case 4:
                response = _context.sent;
                _context.next = 7;
                return response.blob();

              case 7:
                blob = _context.sent;
                message = {
                  status: response.status,
                  statusText: response.statusText,
                  blob: blob
                };
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](1);
                message = {
                  status: 0,
                  statusText: _context.t0
                };

              case 14:
                message.href = data.href;
                postMessage(message);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 11]]);
      }));

      return function onmessage(_x) {
        return _ref.apply(this, arguments);
      };
    }();
  };

  var worker = null;

  var loaderWorker = function loaderWorker() {
    if (worker) {
      return worker;
    }

    return worker = createWorker(work);
  };

  var collection$1 = {};

  var _fetch = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(resource) {
      var options,
          el,
          _args2 = arguments;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};

              if (!(resource.url.href in collection$1)) {
                _context2.next = 7;
                break;
              }

              el = resource.el;
              _context2.next = 5;
              return collection$1[resource.url.href];

            case 5:
              resource = _context2.sent;
              return _context2.abrupt("return", new LoaderResource(_objectSpread({}, resource, {}, {
                el: el
              }), true));

            case 7:
              if (!(isCORS(resource) && options.fetch.cors !== "no-cors")) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt("return", collection$1[resource.url.href] = _load(resource, options, false));

            case 9:
              return _context2.abrupt("return", collection$1[resource.url.href] = new Promise(function (resolve, reject) {
                var worker = loaderWorker();
                worker.postMessage({
                  href: resource.url.href,
                  options: options.fetch
                });
                worker.addEventListener("message", function (event) {
                  var data = event.data;

                  if (data.href !== resource.url.href) {
                    return;
                  }

                  if (data.status === 200) {
                    resource = new LoaderResource(_objectSpread({}, resource, {}, {
                      blob: data.blob
                    }), true);
                    resolve(resource);
                    return;
                  }

                  reject(new Error("".concat(data.statusText, " ").concat(data.href)));
                });
              }));

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function _fetch(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  var _load = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(resource, options, bool) {
      var el, type, url;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(!isCORS(resource) || options.fetch.cors === "no-cors")) {
                _context3.next = 6;
                break;
              }

              el = resource.el;
              _context3.next = 4;
              return _fetch(resource, options);

            case 4:
              resource = _context3.sent;
              resource.el = el;

            case 6:
              type = getLoaderType(resource);

              if (type in Loaders) {
                _context3.next = 9;
                break;
              }

              throw new Error("invalid type");

            case 9:
              url = !!resource.blob ? URL.createObjectURL(resource.blob) : resource.url.href;
              _context3.next = 12;
              return Loaders[type](url, bool, resource.el)["finally"](function () {
                return URL.revokeObjectURL(url);
              });

            case 12:
              return _context3.abrupt("return", resource);

            case 13:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function _load(_x3, _x4, _x5) {
      return _ref3.apply(this, arguments);
    };
  }();

  var Loader = function () {
    function Loader(options) {
      _classCallCheck(this, Loader);

      this.options = _objectSpread({}, {
        fetch: {
          cors: "no-cors"
        }
      }, {}, options);
    }

    _createClass(Loader, [{
      key: "fetch",
      value: function fetch(arg) {
        var _this = this;

        if (arg instanceof NodeList) {
          return this.fetch(_toConsumableArray(arg));
        }

        if (Array.isArray(arg)) {
          return arg.map(function (a) {
            return _this.fetch(a);
          });
        }

        if (typeof arg === "string") {
          return this.fetch(getURL(arg));
        }

        if (isSupportedElement(arg) || arg instanceof URL) {
          return this.fetch(new LoaderResource(arg));
        }

        if (LoaderResource.isLoaderResource(arg)) {
          return _fetch(arg, this.options);
        }

        return Promise.reject(new Error("invalid argument"));
      }
    }, {
      key: "load",
      value: function load(arg) {
        var _this2 = this;

        if (arg instanceof NodeList) {
          return this.load(_toConsumableArray(arg));
        }

        if (Array.isArray(arg)) {
          return arg.map(function (a) {
            return _this2.load(a);
          });
        }

        if (typeof arg === "string") {
          return this.load(getURL(arg));
        }

        if (isSupportedElement(arg) || arg instanceof URL) {
          return this.load(new LoaderResource(arg));
        }

        if (LoaderResource.isLoaderResource(arg)) {
          return _load(arg, this.options, true);
        }

        return Promise.reject(new Error("invalid argument"));
      }
    }]);

    return Loader;
  }();

  return Loader;
});
//# sourceMappingURL=loader.es5.js.map
