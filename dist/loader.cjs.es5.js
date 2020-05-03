'use strict';

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

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var a = document.createElement("a");
var getURL = function getURL(path) {
  a.href = path;
  return new URL(a.href);
};

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

var lfetch = new (function () {
  function LoaderFetch() {
    _classCallCheck(this, LoaderFetch);

    this.cache = {};
  }

  _createClass(LoaderFetch, [{
    key: "fetch",
    value: function () {
      var _fetch = _asyncToGenerator(regeneratorRuntime.mark(function _callee(href, options) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _objectSpread2(_objectSpread2({}, {
                  cache: true,
                  fetch: {}
                }), options);

                if (!(options.cache === true && href in this.cache)) {
                  _context.next = 5;
                  break;
                }

                _context.next = 4;
                return this.cache[href];

              case 4:
                return _context.abrupt("return", _context.sent);

              case 5:
                return _context.abrupt("return", this.cache[href] = new Promise(function (resolve, reject) {
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
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch(_x, _x2) {
        return _fetch.apply(this, arguments);
      }

      return fetch;
    }()
  }]);

  return LoaderFetch;
}())();

var css = (function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(blob, options) {
    var url, sheet;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = _objectSpread2(_objectSpread2({}, {
              element: document
            }), {}, {
              options: options
            });
            url = URL.createObjectURL(blob);
            sheet = new CSSStyleSheet();
            _context.next = 5;
            return sheet.replace("@import url(\"".concat(url, "\")"));

          case 5:
            URL.revokeObjectURL(url);

            if (_typeof(options.element) === "object" && "adoptedStyleSheets" in options.element) {
              options.element.adoptedStyleSheets = [].concat(_toConsumableArray(options.element.adoptedStyleSheets), [sheet]);
            }

            return _context.abrupt("return", sheet);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

var html = (function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(blob, options) {
    var reader, promise, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            reader = new FileReader();
            promise = new Promise(function (resolve) {
              return reader.addEventListener("loadend", function (buffer) {
                return resolve(buffer.srcElement.result);
              });
            });
            reader.readAsText(blob);
            _context.next = 5;
            return promise;

          case 5:
            result = _context.sent;

            if (options && typeof options.filter === "string" && options.filter.length) {
              result = new DOMParser().parseFromString(result, "text/html").body;
              result = _toConsumableArray(result.querySelectorAll(options.filter));
              result = result.length ? result.map(function (x) {
                return x.outerHTML;
              }).reduce(function (x, y) {
                return x + y;
              }) : result;
            }

            if (options && options.element && options.element instanceof HTMLElement && result && typeof result === "string" && result.length) {
              options.element.innerHTML = result;
            }

            return _context.abrupt("return", promise);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

var image = (function () {
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

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

var javascript = (function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(blob) {
    var url, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = URL.createObjectURL(blob);
            _context.next = 3;
            return new Promise(function (resolve) { resolve(_interopNamespace(require(url))); });

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

var lload = new (function () {
  function LoaderLoad() {
    _classCallCheck(this, LoaderLoad);

    this.loaders = {
      image: image,
      html: html,
      css: css,
      javascript: javascript
    };
  }

  _createClass(LoaderLoad, [{
    key: "register",
    value: function register(type, loader) {
      this.loaders[type] = loader;
    }
  }, {
    key: "load",
    value: function () {
      var _load = _asyncToGenerator(regeneratorRuntime.mark(function _callee(blob, options) {
        var type, keys, key, loader;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                type = blob.type;
                keys = type.split("/").reduce(function (x, y) {
                  return [type, x, y];
                });
                _context.t0 = regeneratorRuntime.keys(keys);

              case 3:
                if ((_context.t1 = _context.t0()).done) {
                  _context.next = 12;
                  break;
                }

                key = _context.t1.value;
                loader = keys[key];

                if (!(loader in this.loaders)) {
                  _context.next = 10;
                  break;
                }

                _context.next = 9;
                return this.loaders[loader](blob, options);

              case 9:
                return _context.abrupt("return", _context.sent);

              case 10:
                _context.next = 3;
                break;

              case 12:
                throw new TypeError("Invalid ".concat(blob.type, " media type passed to Loader class \"load\" method."));

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function load(_x, _x2) {
        return _load.apply(this, arguments);
      }

      return load;
    }()
  }]);

  return LoaderLoad;
}())();

var Loader = function () {
  function Loader() {
    _classCallCheck(this, Loader);
  }

  _createClass(Loader, [{
    key: "fetch",
    value: function () {
      var _fetch = _asyncToGenerator(regeneratorRuntime.mark(function _callee(resource, options) {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!Array.isArray(resource)) {
                  _context.next = 4;
                  break;
                }

                _context.next = 3;
                return resource.map(function (a) {
                  return _this.fetch(a, options);
                });

              case 3:
                return _context.abrupt("return", _context.sent);

              case 4:
                if (!(typeof resource === "string")) {
                  _context.next = 8;
                  break;
                }

                _context.next = 7;
                return this.fetch(getURL(resource), options);

              case 7:
                return _context.abrupt("return", _context.sent);

              case 8:
                if (!(resource instanceof URL)) {
                  _context.next = 12;
                  break;
                }

                _context.next = 11;
                return lfetch.fetch(resource.href, options);

              case 11:
                return _context.abrupt("return", _context.sent);

              case 12:
                throw new TypeError("Invalid argment of type ".concat(_typeof(resource), " passed to Loader class \"fetch\" method."));

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch(_x, _x2) {
        return _fetch.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "load",
    value: function () {
      var _load = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(resource, options) {
        var _this2 = this;

        var isArrayOpts, blob;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!Array.isArray(resource)) {
                  _context2.next = 5;
                  break;
                }

                isArrayOpts = Array.isArray(options);
                _context2.next = 4;
                return resource.map(function (a, i) {
                  return _this2.load(a, isArrayOpts ? options[i] : options);
                });

              case 4:
                return _context2.abrupt("return", _context2.sent);

              case 5:
                if (!(resource instanceof Blob)) {
                  _context2.next = 9;
                  break;
                }

                _context2.t0 = resource;
                _context2.next = 12;
                break;

              case 9:
                _context2.next = 11;
                return this.fetch(resource, options);

              case 11:
                _context2.t0 = _context2.sent;

              case 12:
                blob = _context2.t0;
                _context2.next = 15;
                return lload.load(blob, options);

              case 15:
                return _context2.abrupt("return", _context2.sent);

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function load(_x3, _x4) {
        return _load.apply(this, arguments);
      }

      return load;
    }()
  }, {
    key: "register",
    value: function register(type, loader) {
      return lload.register(type, loader);
    }
  }]);

  return Loader;
}();

module.exports = Loader;
//# sourceMappingURL=loader.cjs.es5.js.map
