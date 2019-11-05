"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('Loader', factory) : (global = global || self, global.Loader = factory());
})(void 0, function () {
  'use strict';

  var defaults = {
    url: "",
    proxy: null,
    attr: "src",
    success: "onload",
    error: "onerror"
  };

  var ILoad = function ILoad() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults;
    return new Promise(function (resolve, reject) {
      options = _objectSpread({}, defaults, {}, options);

      options.proxy[options.success] = function () {
        return resolve(options.url);
      };

      options.proxy[options.error] = function (message) {
        return reject(new Error(message));
      };

      options.proxy[options.attr] = options.url;
    });
  };

  var loadStyle = function loadStyle(url) {
    var proxy = document.createElement("link");
    proxy.rel = "stylesheet";
    var promise = ILoad({
      url: url,
      proxy: proxy,
      attr: "href"
    });
    document.head.appendChild(proxy);
    proxy.disabled = "disabled";
    promise["finally"](function () {
      return document.head.removeChild(proxy);
    });
    return promise;
  };

  var loadScript = function loadScript(url) {
    var proxy = document.createElement("object");
    proxy.width = 0;
    proxy.height = 0;
    var promise = ILoad({
      url: url,
      proxy: proxy,
      attr: "data"
    });
    document.body.appendChild(proxy);
    promise["finally"](function () {
      return document.body.removeChild(proxy);
    });
    return promise;
  };

  var loadImage = function loadImage(url) {
    return ILoad({
      url: url,
      proxy: document.createElement("img")
    });
  };

  var defaults$1 = {
    url: "",
    proxy: null
  };

  var IMediaLoad = function IMediaLoad() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults$1;
    return ILoad(_objectSpread({}, _objectSpread({}, defaults$1, {}, options), {}, {
      success: "onloadedmetadata"
    }));
  };

  var loadAudio = function loadAudio(url) {
    return IMediaLoad({
      url: url,
      proxy: document.createElement("audio")
    });
  };

  var loadVideo = function loadVideo(url) {
    return IMediaLoad({
      url: url,
      proxy: document.createElement("video")
    });
  };

  var SupportedFileExtensions = {
    IMAGE: ["jp[e]?g", "jpe", "jif", "jfif", "jfi", "gif", "png", "tif[f]?", "bmp", "dib", "webp", "ico", "cur", "svg"],
    AUDIO: ["mp3", "ogg", "oga", "spx", "ogg", "wav"],
    VIDEO: ["mp4", "ogg", "ogv", "webm"],
    SCRIPT: ["js", "mjs"],
    STYLE: ["css"]
  };
  var BASE_64_HEAD = ";base64,";

  var parseStringResource = function parseStringResource(string) {
    if (!new RegExp("".concat(BASE_64_HEAD)).test(string)) {
      string = string.split(",").pop().split(" ").reduce(function (x, y) {
        return x.length > y.length ? x : y;
      });
    }

    for (var format in SupportedFileExtensions) {
      var extensions = SupportedFileExtensions[format].join("|");
      format = format.toLowerCase();

      if (new RegExp("(.(".concat(extensions, ")$)|data:").concat(format, "/(").concat(extensions, ")").concat(BASE_64_HEAD)).test(string)) {
        var matches = string.match(new RegExp(".(".concat(extensions, ")$"), "g")) || string.match(new RegExp("^data:".concat(format, "/(").concat(extensions, ")"), "g"));

        if (null !== matches) {
          return {
            type: format,
            url: string
          };
        }
      }
    }

    throw new Error("Error while parsing the resource string.");
  };

  var parseElementResource = function parseElementResource(element) {
    if ("currentSrc" in element) {
      return element.currentSrc;
    }

    throw new Error("Error while parsing the resource element.");
  };

  var parseResource = function parseResource(resource) {
    if (resource instanceof HTMLElement) {
      resource = parseElementResource(resource);
    }

    if (typeof resource === "string") {
      resource = parseStringResource(resource);
    }

    return resource;
  };

  var loaders = {
    image: loadImage,
    audio: loadAudio,
    video: loadVideo,
    style: loadStyle,
    script: loadScript
  };

  var _load = function load(resource) {
    return new Promise(function (resolve, reject) {
      try {
        resource = parseResource(resource);
      } catch (e) {
        reject(e);
      }

      loaders[resource.type](resource.url).then(resolve)["catch"](reject);
    });
  };

  var LoaderPromise = function (_Promise) {
    _inherits(LoaderPromise, _Promise);

    function LoaderPromise(fn) {
      var _this;

      _classCallCheck(this, LoaderPromise);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(LoaderPromise).call(this, function (resolve, reject) {
        fn(resolve, reject, function (value) {
          try {
            return _this._progress.forEach(function (listener) {
              return listener(value);
            });
          } catch (error) {
            reject(error);
          }
        });
      }));
      _this._progress = [];
      return _this;
    }

    _createClass(LoaderPromise, [{
      key: "progress",
      value: function progress(handler) {
        if (typeof handler === 'function') {
          this._progress.push(handler);
        }

        return this;
      }
    }]);

    return LoaderPromise;
  }(_wrapNativeSuper(Promise));

  var Loader = function () {
    function Loader() {
      var resources = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      _classCallCheck(this, Loader);

      this._resources = resources;
    }

    _createClass(Loader, [{
      key: "load",
      value: function load() {
        var _this2 = this;

        return new LoaderPromise(function (resolve, reject, progress) {
          var loaded = 0;
          var length = _this2._resources.length;
          var errors = false;

          for (var key in _this2._resources) {
            _load(_this2._resources[key])["catch"](function () {
              errors = true;
            })["finally"](function () {
              progress();
              loaded++;

              if (loaded < length) {
                return;
              }

              if (errors) {
                reject(new Error("One or more resources had troubles loading."));
              }

              resolve();
            });
          }
        });
      }
    }]);

    return Loader;
  }();

  return Loader;
});
//# sourceMappingURL=loader.js.map
