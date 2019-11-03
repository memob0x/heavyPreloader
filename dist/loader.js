"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('loader', factory) : (global = global || self, global.loader = factory());
})(void 0, function () {
  'use strict';

  var loadStyle = function loadStyle(url) {
    return new Promise(function (resolve, reject) {
      var proxy = document.createElement("style");
      proxy.textContent = '@import "' + url + '"';
      document.querySelector("head").appendChild(proxy);
    });
  };

  var loadScript = function loadScript(url) {
    return new Promise(function (resolve, reject) {
      var proxy = document.createElement("script");

      proxy.onload = function () {
        return resolve(url);
      };

      proxy.onerror = function (message, source, lineno, colno, error) {
        return reject(error);
      };

      proxy.src = url;
      document.querySelector("head").appendChild(proxy);
    });
  };

  var loadImage = function loadImage(url) {
    return new Promise(function (resolve, reject) {
      var proxy = document.createElement("img");

      proxy.onload = function () {
        return resolve(url);
      };

      proxy.onerror = function (message, source, lineno, colno, error) {
        return reject(error);
      };

      proxy.src = url;
    });
  };

  var loadAudioVideo = function loadAudioVideo(url, tag) {
    return new Promise(function (resolve, reject) {
      var proxy = document.createElement(tag);

      proxy.onloadedmetadata = function () {
        return resolve(url);
      };

      proxy.onerror = function (message, source, lineno, colno, error) {
        return reject(error);
      };

      proxy.src = url;
    });
  };

  var loadAudio = function loadAudio(url) {
    return loadAudioVideo(url, "audio");
  };

  var loadVideo = function loadVideo(url) {
    return loadAudioVideo(url, "video");
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
            _load(_this._resources[key]).then(resolve)["catch"](function () {
              return reject(new Error("Woa"));
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
