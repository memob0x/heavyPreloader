"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('Loader', factory) : (global = global || self, global.Loader = factory());
})(void 0, function () {
  'use strict';

  var getURL = function getURL(href) {
    return new URL(function (a) {
      a.href = href;
      return a;
    }(document.createElement("a")));
  };

  var createWorker = function createWorker(work) {
    if (typeof work !== "function") {
      throw new TypeError("Invalid argment of type ".concat(_typeof(work), " passed to Loader class internal \"createWorker\" function."));
    }

    var url = URL.createObjectURL(new Blob(["(", work.toString(), ")()"], {
      type: "application/javascript"
    }));
    var worker = new Worker(url);
    URL.revokeObjectURL(url);
    return worker;
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

  var getOrCreateWorker = function getOrCreateWorker() {
    return worker ? worker : worker = createWorker(work);
  };

  var cache = {};

  var fetch$1 = function () {
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
                var worker = getOrCreateWorker();
                worker.postMessage({
                  href: href,
                  options: options.fetch
                });
                worker.addEventListener("message", function (event) {
                  var data = event.data;

                  if (data.href !== href) {
                    return;
                  }

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

    return function fetch$1(_x2) {
      return _ref2.apply(this, arguments);
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

        if (Array.isArray(arg)) {
          return arg.map(function (a) {
            return _this.fetch(a);
          });
        }

        if (typeof arg === "string") {
          return this.fetch(getURL(arg));
        }

        if (arg instanceof URL) {
          return fetch$1(arg.href, this.options);
        }

        return Promise.reject(new TypeError("Invalid argment of type ".concat(_typeof(arg), " passed to Loader class \"fetch\" method.")));
      }
    }]);

    return Loader;
  }();

  return Loader;
});
//# sourceMappingURL=loader.es5.js.map
