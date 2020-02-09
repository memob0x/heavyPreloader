"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define('Loader', ['exports'], factory) : (global = global || self, factory(global.Loader = {}));
})(void 0, function (exports) {
  'use strict';

  var parseUrl = function parseUrl(url) {
    var a = document.createElement("a");
    a.href = url;
    return a;
  };

  var urlFromDataObject = function urlFromDataObject(data) {
    return data.blob.type ? URL.createObjectURL(data.blob) : data.response.url;
  };

  var getLoaderTypeFromUrl = function getLoaderTypeFromUrl(url) {
    return "image";
  };

  var isCORSUrl = function isCORSUrl(url) {
    return url.host !== window.location.host;
  };

  var image = function image(url) {
    var attributeName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "src";
    var el = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Image();
    return new Promise(function (resolve, reject) {
      el.onload = resolve;
      el.onerror = reject;
      el.setAttribute(attributeName, url);
    });
  };

  var style = function style(url) {
    var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.createElement("div");
    var sheet = new CSSStyleSheet();
    var promise = sheet.replace("@import url(\"".concat(url, "\")"));

    if ("adoptedStyleSheets" in el) {
      el.adoptedStyleSheets = [].concat(_toConsumableArray(el.adoptedStyleSheets), [sheet]);
    }

    return promise;
  };

  var object = function object(url, el) {
    return new Promise(function (resolve, reject) {
      el.onload = resolve;
      el.onerror = reject;
      el.data = preload[i];
      el.width = 0;
      el.height = 0;
      document.body.append(el);
    });
  };

  var script = function script(url) {
    var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.createElement("object");
    return el.tagName === "OBJECT" ? object(url, el) : new Promise(function (resolve, reject) {
      el.onload = resolve;
      el.onerror = reject;
      el.src = url;
      el.async = true;
      document.head.append(el);
    });
  };

  var Loaders = Object.freeze({
    __proto__: null,
    image: image,
    style: style,
    script: script
  });

  var worker = function worker() {
    onmessage = function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(event) {
        var data, response, blob;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                data = event.data;
                _context.prev = 1;
                _context.next = 4;
                return fetch(data.url);

              case 4:
                response = _context.sent;
                _context.next = 7;
                return response.blob();

              case 7:
                blob = _context.sent;
                data.response = {
                  url: response.url,
                  status: response.status,
                  statusText: response.statusText
                };
                data.blob = blob;
                _context.next = 16;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](1);
                data.response = {
                  url: data.url,
                  status: 200
                };
                data.blob = {
                  type: null
                };

              case 16:
                postMessage(data);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 12]]);
      }));

      return function onmessage(_x) {
        return _ref.apply(this, arguments);
      };
    }();
  };

  var Loader = function () {
    function Loader() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Loader);

      this.worker = new Worker(URL.createObjectURL(new Blob(["(", worker.toString(), ")()"], {
        type: "application/javascript"
      })));
      this._options = _objectSpread({}, options, {}, {});
    }

    _createClass(Loader, [{
      key: "fetch",
      value: function fetch(url) {
        var _this = this;

        var parsedUrl = parseUrl(url);
        url = parsedUrl.href;
        return new Promise(function (resolve, reject) {
          try {
            if (isCORSUrl(parsedUrl)) {
              var type = getLoaderTypeFromUrl(url);
              var defaultData = {
                response: {
                  url: url,
                  status: 200
                },
                blob: {
                  type: null
                }
              };

              if (type in Loaders) {
                return Loaders[type](url).then(function () {
                  return resolve(defaultData);
                })["catch"](reject);
              }

              resolve(defaultData);
              return;
            }

            _this.worker.postMessage({
              url: url
            });

            _this.worker.addEventListener("message", function (event) {
              var data = event.data;

              if (data.url !== url) {
                return;
              }

              if (data.response.status !== 200) {
                reject(new Error("".concat(data.response.statusText, " ").concat(data.response.url)));
                return;
              }

              resolve(data);
            });
          } catch (e) {
            reject(e);
          }
        });
      }
    }], [{
      key: "adoptStyleSheet",
      value: function adoptStyleSheet(data) {
        var url = urlFromDataObject(data);
        return style(url, document)["finally"](function () {
          return URL.revokeObjectURL(url);
        });
      }
    }, {
      key: "insertScript",
      value: function insertScript(data) {
        var url = urlFromDataObject(data);
        return script(url, document.createElement("script"))["finally"](function () {
          return URL.revokeObjectURL(url);
        });
      }
    }, {
      key: "setImageAttribute",
      value: function setImageAttribute(data, el) {
        var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "src";
        var url = urlFromDataObject(data);
        return image(url, name, el)["finally"](function () {
          return URL.revokeObjectURL(url);
        });
      }
    }]);

    return Loader;
  }();

  var loader = new Loader();

  _toConsumableArray(document.querySelectorAll("img[data-src]")).forEach(function (el) {
    return loader.fetch(el.dataset.src).then(function (x) {
      return Loader.setImageAttribute(x, el);
    })["catch"](function (e) {
      return console.error(e);
    });
  });

  loader.fetch("dist/styles.css").then(function (x) {
    return Loader.adoptStyleSheet(x);
  })["catch"](function (e) {
    return console.error(e);
  });
  loader.fetch("dist/extra.css").then(function (x) {
    return Loader.adoptStyleSheet(x);
  })["catch"](function (e) {
    return console.error(e);
  });
  loader.fetch("dist/scripts.js").then(function (x) {
    return Loader.insertScript(x);
  })["catch"](function (e) {
    return console.error(e);
  });
  loader.fetch("dist/not-existent.js").then(function (x) {
    return Loader.insertScript(x);
  })["catch"](function (e) {
    return console.error(e);
  });
  exports.Loader = Loader;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
//# sourceMappingURL=loader.es5.js.map
