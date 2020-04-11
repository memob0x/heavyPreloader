"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('Loader', factory) : (global = global || self, global.Loader = factory());
})(void 0, function () {
  'use strict';

  var loader_load_image = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(blob, options) {
      var image, url, promise, result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              image = options && options.element instanceof HTMLImageElement ? options.element : new Image();
              url = URL.createObjectURL(blob);
              promise = new Promise(function (resolve, reject) {
                image.onload = resolve;

                image.onerror = function () {
                  return reject(new Error("Error loading image ".concat(blob.type)));
                };
              });
              image.src = url;
              _context.next = 6;
              return promise;

            case 6:
              result = _context.sent;
              URL.revokeObjectURL(url);
              return _context.abrupt("return", result);

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function loader_load_image(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  return loader_load_image;
});
//# sourceMappingURL=loader.load.image.es5.js.map
