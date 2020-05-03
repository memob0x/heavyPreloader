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

var lload = new (function () {
  function LoaderLoad() {
    _classCallCheck(this, LoaderLoad);

    this.loaders = {};
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

export default Loader;
//# sourceMappingURL=loader.es.es5.js.map
