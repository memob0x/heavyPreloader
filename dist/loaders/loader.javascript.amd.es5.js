define(['require'], function (require) { 'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) { return e; } else {
      var n = {};
      if (e) {
        Object.keys(e).forEach(function (k) {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
            }
          });
        });
      }
      n['default'] = e;
      return n;
    }
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  var loader_javascript = (function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(blob) {
      var url, result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              url = URL.createObjectURL(blob);
              _context.next = 3;
              return new Promise(function (resolve, reject) { require([url], function (m) { resolve(_interopNamespace(m)); }, reject) });

            case 3:
              result = _context.sent;
              URL.revokeObjectURL(url);
              return _context.abrupt("return", result);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })();

  return loader_javascript;

});
//# sourceMappingURL=loader.javascript.amd.es5.js.map
