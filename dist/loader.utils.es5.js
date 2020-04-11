"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define('Loader', ['exports'], factory) : (global = global || self, factory(global.Loader = {}));
})(void 0, function (exports) {
  'use strict';

  var a = document.createElement("a");

  var getURL = function getURL(path) {
    a.href = path;
    return new URL(a.href);
  };

  exports.getURL = getURL;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
//# sourceMappingURL=loader.utils.es5.js.map
