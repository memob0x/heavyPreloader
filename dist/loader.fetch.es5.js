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

  var createDynamicWorker = function createDynamicWorker(body) {
    var url = URL.createObjectURL(new Blob(["(", body.toString(), ")()"], {
      type: "application/javascript"
    }));
    var worker = new Worker(url);
    URL.revokeObjectURL(url);
    return worker;
  };

  var createFetchWorker = function createFetchWorker() {
    return createDynamicWorker(function () {
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
    });
  };

  var lworker = new (function () {
    function LoaderWorker() {
      _classCallCheck(this, LoaderWorker);

      this._worker = null;
      this._requests = 0;
    }

    _createClass(LoaderWorker, [{
      key: "terminate",
      value: function terminate() {
        if (this._requests > 0) {
          this._requests--;
        }

        if (this._requests === 0) {
          this._worker.terminate();

          this._worker = null;
        }

        return this._worker;
      }
    }, {
      key: "worker",
      value: function worker() {
        this._requests++;

        if (this._worker) {
          return this._worker;
        }

        this._worker = createFetchWorker();
        return this._worker;
      }
    }]);

    return LoaderWorker;
  }())();
  var loader_fetch = new (function () {
    function LoaderFetch() {
      _classCallCheck(this, LoaderFetch);

      this.cache = {};
    }

    _createClass(LoaderFetch, [{
      key: "fetch",
      value: function () {
        var _fetch = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(href, options) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  options = _objectSpread({}, {
                    cache: true,
                    fetch: {}
                  }, {}, options);

                  if (!(options.cache === true && href in this.cache)) {
                    _context2.next = 5;
                    break;
                  }

                  _context2.next = 4;
                  return this.cache[href];

                case 4:
                  return _context2.abrupt("return", _context2.sent);

                case 5:
                  return _context2.abrupt("return", this.cache[href] = new Promise(function (resolve, reject) {
                    var worker = lworker.worker();
                    worker.postMessage({
                      href: href,
                      options: options.fetch
                    });
                    worker.addEventListener("message", function (event) {
                      var data = event.data;

                      if (data.href !== href) {
                        return;
                      }

                      lworker.terminate();

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
          }, _callee2, this);
        }));

        function fetch(_x2, _x3) {
          return _fetch.apply(this, arguments);
        }

        return fetch;
      }()
    }]);

    return LoaderFetch;
  }())();
  return loader_fetch;
});
//# sourceMappingURL=loader.fetch.es5.js.map
