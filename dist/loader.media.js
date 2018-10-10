'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Media = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _toolboxUtils = require('./toolbox/src/toolbox.utils.js');

var _loaderSettings = require('./loader.settings.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Media = exports.Media = function () {
    function Media(item) {
        _classCallCheck(this, Media);

        var isElement = item.element instanceof HTMLElement;

        this.url = item.url;
        this.consistent = isElement && (0, _toolboxUtils.isInArray)(item.element.tagName.toLowerCase(), _loaderSettings.allSupportedTags);
        this.element = isElement ? item.element : null;
        this.tagName = this.consistent ? this.element.tagName.toLowerCase() : null;
        this.type = null;
        this.extension = null;

        if (!this.url) {
            return;
        }

        this.url = item.url;

        for (var format in _loaderSettings.supportedExtensions) {
            var extensions = _loaderSettings.supportedExtensions[format].join('|');

            if (new RegExp('(.(' + extensions + ')$)|data:' + format + '/(' + extensions + ');base64,').test(this.url)) {
                var matches = this.url.match(new RegExp('.(' + extensions + ')$', 'g')) || this.url.match(new RegExp('^data:' + format + '/(' + extensions + ')', 'g'));

                if (null !== matches) {
                    this.type = format;
                    this.extension = matches[0].replace('data:' + format + '/', '').replace('.', '');
                    this.tagName = this.tagName ? this.tagName : _loaderSettings.supportedTags[format][0];

                    break;
                }
            }
        }

        if (this.consistent && (this.tagName === 'audio' || this.tagName === 'video' || this.tagName === 'iframe')) {
            this.type = this.tagName;
        } else if (this.tagName) {
            for (var _format in _loaderSettings.supportedTags) {
                if ((0, _toolboxUtils.isInArray)(this.tagName, _loaderSettings.supportedTags[_format])) {
                    this.type = _format;
                    break;
                }
            }
        }
    }

    _createClass(Media, null, [{
        key: 'isMedia',
        value: function isMedia(item) {
            return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && 'tagName' in item && 'type' in item && 'url' in item && 'extension' in item && 'element' in item;
        }
    }]);

    return Media;
}();