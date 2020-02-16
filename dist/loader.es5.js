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
        return "image";

      case "css":
        return "style";

      case "js":
        return "script";

      default:
        return "noop";
    }
  };

  var isCORS = function isCORS(arg) {
    arg = getURL(arg);
    return arg.hostname !== window.location.hostname || arg.protocol !== window.location.protocol;
  };

  var collection = {};

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

      if (o.url.href in collection && !override) {
        o = collection[o.url.href];
      }

      this.el = o.el;
      this.url = o.url;
      this.blob = o.blob;
      collection[this.url.href] = this;
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

  var loadMedia = function loadMedia(url) {
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
    media: function media(url, bool, el) {
      return loadMedia(url, bool ? el : void 0);
    },
    script: function script(url, bool) {
      return bool ? loadScript(url) : loadObject(url);
    },
    style: function style(url, bool) {
      return loadStyle(url, bool ? document : void 0);
    }
  };

  var _load = function _load(resource, bool) {
    var type = getLoaderType(resource);

    if (!(type in Loaders)) {
      return Promise.reject(new Error("invalid type"));
    }

    var url = !!resource.blob ? URL.createObjectURL(resource.blob) : resource.url.href;
    return new Promise(function (resolve, reject) {
      return Loaders[type](url, bool, resource.el)["finally"](function () {
        return URL.revokeObjectURL(url);
      }).then(function () {
        return resolve(resource);
      })["catch"](reject);
    });
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

  var _fetch = function _fetch(resource) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (resource.url.href in collection$1) {
      return collection$1[resource.url.href];
    }

    if (isCORS(resource) && options.cors !== "no-cors") {
      return collection$1[resource.url.href] = _load(resource, false);
    }

    return collection$1[resource.url.href] = new Promise(function (resolve, reject) {
      var worker = loaderWorker();
      worker.postMessage({
        href: resource.url.href,
        options: options
      });
      worker.addEventListener("message", function (event) {
        var data = event.data;

        if (data.href !== resource.url.href) {
          return;
        }

        if (data.status === 200) {
          resolve(new LoaderResource(_objectSpread({}, resource, {}, {
            blob: data.blob
          }), true));
          return;
        }

        reject(new Error("".concat(data.statusText, " ").concat(data.href)));
      });
    });
  };

  var Loader = function () {
    function Loader(options) {
      _classCallCheck(this, Loader);

      this.options = _objectSpread({}, {
        fetch: {}
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
          return _fetch(arg, this.options.fetch);
        }

        return Promise.reject(new Error("invalid argument"));
      }
    }, {
      key: "load",
      value: function () {
        var _load2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(arg) {
          var _this2 = this;

          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (!(arg instanceof NodeList)) {
                    _context2.next = 2;
                    break;
                  }

                  return _context2.abrupt("return", this.load(_toConsumableArray(arg)));

                case 2:
                  if (!Array.isArray(arg)) {
                    _context2.next = 4;
                    break;
                  }

                  return _context2.abrupt("return", arg.map(function (a) {
                    return _this2.load(a);
                  }));

                case 4:
                  if (!(typeof arg === "string")) {
                    _context2.next = 6;
                    break;
                  }

                  return _context2.abrupt("return", this.load(getURL(arg)));

                case 6:
                  if (!(isSupportedElement(arg) || arg instanceof URL)) {
                    _context2.next = 8;
                    break;
                  }

                  return _context2.abrupt("return", this.load(new LoaderResource(arg)));

                case 8:
                  if (!(!isCORS(arg) || this.options.fetch.cors === "no-cors")) {
                    _context2.next = 18;
                    break;
                  }

                  _context2.prev = 9;
                  _context2.next = 12;
                  return this.fetch(arg);

                case 12:
                  arg = _context2.sent;
                  _context2.next = 18;
                  break;

                case 15:
                  _context2.prev = 15;
                  _context2.t0 = _context2["catch"](9);
                  console.warn(_context2.t0);

                case 18:
                  if (!LoaderResource.isLoaderResource(arg)) {
                    _context2.next = 20;
                    break;
                  }

                  return _context2.abrupt("return", _load(arg, true));

                case 20:
                  return _context2.abrupt("return", Promise.reject(new Error("invalid argument")));

                case 21:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this, [[9, 15]]);
        }));

        function load(_x2) {
          return _load2.apply(this, arguments);
        }

        return load;
      }()
    }]);

    return Loader;
  }();

  return Loader;
});
//# sourceMappingURL=loader.es5.js.map
