"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('Loader', factory) : (global = global || self, global.Loader = factory());
})(void 0, function () {
  'use strict';

  var head = document.querySelector("head");
  var defaults = {
    url: "",
    proxy: null,
    attr: "src",
    success: "onload",
    error: "onerror",
    host: null
  };

  var ILoad = function ILoad() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults;
    return new Promise(function (resolve, reject) {
      options = _objectSpread({}, defaults, {}, options);

      options.proxy[options.success] = function () {
        if (options.host) {
          options.host.removeChild(options.proxy);
        }

        resolve(options.url);
      };

      options.proxy[options.error] = function (message, source, lineno, colno, error) {
        return reject(error);
      };

      options.proxy[options.attr] = options.url;

      if (!options.host) {
        return;
      }

      options.host.appendChild(options.proxy);
      window.requestAnimationFrame(function () {
        options.proxy.disabled = "disabled";
        options.proxy.hidden = "hidden";
      });
    });
  };

  var loadStyle = function loadStyle(url) {
    return ILoad({
      url: url,
      proxy: function () {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        return link;
      }(),
      attr: "href",
      host: head
    });
  };

  var loadScript = function loadScript(url) {
    return ILoad({
      url: url,
      proxy: document.createElement("script"),
      host: head
    });
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
    return ILoad(_objectSpread({}, _objectSpread({}, options, {}, defaults$1), {}, {
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
      tag: document.createElement("video")
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

  var Loader = function () {
    function Loader() {
      var resources = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      _classCallCheck(this, Loader);

      this._resources = resources;
    }

    _createClass(Loader, [{
      key: "load",
      value: function load() {
        var _this = this;

        return new Promise(function (resolve, reject) {
          for (var key in _this._resources) {
            _load(_this._resources[key]).then(resolve)["catch"](reject);
          }
        });
      }
    }]);

    return Loader;
  }();

  return Loader;
});
//# sourceMappingURL=loader.js.map
