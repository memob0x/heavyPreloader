"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('Loader', factory) : (global = global || self, global.Loader = factory());
})(void 0, function () {
  'use strict';

  var body = function body() {
    return onmessage = function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(event) {
        var response, blob;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return fetch(event.data.href, event.data.options);

              case 3:
                response = _context.sent;
                _context.next = 6;
                return response.blob();

              case 6:
                blob = _context.sent;
                event.data.status = response.status;
                event.data.statusText = response.statusText;
                event.data.blob = blob;
                _context.next = 15;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](0);
                event.data.statusText = _context.t0;

              case 15:
                postMessage(event.data);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 12]]);
      }));

      return function onmessage(_x) {
        return _ref.apply(this, arguments);
      };
    }();
  };

  var lworker = null;
  var requests = 0;

  var get = function get() {
    requests++;

    if (lworker) {
      return lworker;
    }

    var url = URL.createObjectURL(new Blob(["(", body.toString(), ")()"], {
      type: "application/javascript"
    }));
    lworker = new Worker(url);
    URL.revokeObjectURL(url);
    return lworker;
  };

  var terminate = function terminate() {
    requests--;

    if (requests <= 0) {
      lworker.terminate();
      lworker = null;
    }
  };

  var cache = {};

  var lfetch = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(href) {
      var options,
          _args2 = arguments;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};

              if (!(href in cache)) {
                _context2.next = 5;
                break;
              }

              _context2.next = 4;
              return cache[href];

            case 4:
              return _context2.abrupt("return", _context2.sent);

            case 5:
              return _context2.abrupt("return", cache[href] = new Promise(function (resolve, reject) {
                var worker = get();
                worker.postMessage({
                  href: href,
                  options: options.fetch
                });
                worker.addEventListener("message", function (event) {
                  var data = event.data;

                  if (data.href !== href) {
                    return;
                  }

                  terminate();

                  if (data.status === 200) {
                    resolve(data.blob);
                    return;
                  }

                  reject(new Error("".concat(data.statusText, " for ").concat(data.href, " resource.")));
                });
              }));

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function lfetch(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  var css = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(blob) {
      var el,
          url,
          sheet,
          _args3 = arguments;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              el = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : document;
              url = URL.createObjectURL(blob);
              sheet = new CSSStyleSheet();
              _context3.next = 5;
              return sheet.replace("@import url(\"".concat(url, "\")"));

            case 5:
              URL.revokeObjectURL(url);

              if ("adoptedStyleSheets" in el) {
                el.adoptedStyleSheets = [].concat(_toConsumableArray(el.adoptedStyleSheets), [sheet]);
              }

              return _context3.abrupt("return", sheet);

            case 8:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function css(_x3) {
      return _ref3.apply(this, arguments);
    };
  }();

  var html = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(blob, el) {
      var reader, promise, result;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              reader = new FileReader();
              promise = new Promise(function (resolve) {
                return reader.addEventListener("loadend", function (buffer) {
                  return resolve(buffer.srcElement.result);
                });
              });
              reader.readAsText(blob);
              _context4.next = 5;
              return promise;

            case 5:
              result = _context4.sent;

              if (el && _typeof(el) === "object" && "innerHTML" in el) {
                el.innerHTML = result;
              }

              return _context4.abrupt("return", promise);

            case 8:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function html(_x4, _x5) {
      return _ref4.apply(this, arguments);
    };
  }();

  var image = function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(blob) {
      var el,
          url,
          promise,
          result,
          _args5 = arguments;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              el = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : new Image();
              url = URL.createObjectURL(blob);
              promise = new Promise(function (resolve, reject) {
                el.onload = resolve;
                el.onerror = reject;
              });
              el.src = url;
              _context5.next = 6;
              return promise;

            case 6:
              result = _context5.sent;
              URL.revokeObjectURL(url);
              return _context5.abrupt("return", result);

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function image(_x6) {
      return _ref5.apply(this, arguments);
    };
  }();

  var javascript = function () {
    var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(blob) {
      var url, result;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              url = URL.createObjectURL(blob);
              _context6.next = 3;
              return Promise.resolve().then(function () {
                return _interopRequireWildcard(require("".concat(url)));
              });

            case 3:
              result = _context6.sent;
              URL.revokeObjectURL(url);
              return _context6.abrupt("return", result);

            case 6:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function javascript(_x7) {
      return _ref6.apply(this, arguments);
    };
  }();

  var lload = function () {
    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(blob, el) {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.t0 = blob.type;
              _context7.next = _context7.t0 === "image/png" ? 3 : _context7.t0 === "image/jpeg" ? 3 : _context7.t0 === "text/html" ? 6 : _context7.t0 === "text/css" ? 9 : _context7.t0 === "text/javascript" ? 12 : 15;
              break;

            case 3:
              _context7.next = 5;
              return image(blob, el);

            case 5:
              return _context7.abrupt("return", _context7.sent);

            case 6:
              _context7.next = 8;
              return html(blob, el);

            case 8:
              return _context7.abrupt("return", _context7.sent);

            case 9:
              _context7.next = 11;
              return css(blob, el);

            case 11:
              return _context7.abrupt("return", _context7.sent);

            case 12:
              _context7.next = 14;
              return javascript(blob);

            case 14:
              return _context7.abrupt("return", _context7.sent);

            case 15:
              throw new TypeError("Invalid argment of type ".concat(_typeof(blob), " passed to Loader class \"fetch\" method."));

            case 16:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function lload(_x8, _x9) {
      return _ref7.apply(this, arguments);
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
      value: function () {
        var _fetch = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(arg) {
          var _this = this;

          var a;
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  if (!Array.isArray(arg)) {
                    _context8.next = 4;
                    break;
                  }

                  _context8.next = 3;
                  return arg.map(function (a) {
                    return _this.fetch(a);
                  });

                case 3:
                  return _context8.abrupt("return", _context8.sent);

                case 4:
                  if (!(typeof arg === "string")) {
                    _context8.next = 10;
                    break;
                  }

                  a = document.createElement("a");
                  a.href = arg;
                  _context8.next = 9;
                  return this.fetch(new URL(a));

                case 9:
                  return _context8.abrupt("return", _context8.sent);

                case 10:
                  if (!(arg instanceof URL)) {
                    _context8.next = 14;
                    break;
                  }

                  _context8.next = 13;
                  return lfetch(arg.href, this.options);

                case 13:
                  return _context8.abrupt("return", _context8.sent);

                case 14:
                  throw new TypeError("Invalid argment of type ".concat(_typeof(arg), " passed to Loader class \"fetch\" method."));

                case 15:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, this);
        }));

        function fetch(_x10) {
          return _fetch.apply(this, arguments);
        }

        return fetch;
      }()
    }, {
      key: "load",
      value: function () {
        var _load = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(arg, el) {
          var _this2 = this;

          var blob;
          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  if (!Array.isArray(arg)) {
                    _context9.next = 4;
                    break;
                  }

                  _context9.next = 3;
                  return arg.map(function (a) {
                    return _this2.load(a, el);
                  });

                case 3:
                  return _context9.abrupt("return", _context9.sent);

                case 4:
                  _context9.next = 6;
                  return this.fetch(arg);

                case 6:
                  blob = _context9.sent;
                  _context9.next = 9;
                  return lload(blob, el);

                case 9:
                  return _context9.abrupt("return", _context9.sent);

                case 10:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9, this);
        }));

        function load(_x11, _x12) {
          return _load.apply(this, arguments);
        }

        return load;
      }()
    }]);

    return Loader;
  }();

  return Loader;
});
//# sourceMappingURL=loader.es5.js.map
